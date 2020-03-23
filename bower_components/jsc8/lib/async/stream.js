"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./util/helper");
const btoa_1 = require("./util/btoa");
const query_string_1 = require("query-string");
// 2 document
// 3 edge
// 4 persistent
const webSocket_1 = require("./util/webSocket");
var StreamConstants;
(function (StreamConstants) {
    StreamConstants["PERSISTENT"] = "persistent";
})(StreamConstants = exports.StreamConstants || (exports.StreamConstants = {}));
class Stream {
    constructor(connection, name, local = false, isCollectionStream = false) {
        this._connection = connection;
        this.isCollectionStream = isCollectionStream;
        this.local = local;
        this._consumers = [];
        this._setIntervalId = undefined;
        this._producerIntervalId = undefined;
        this.name = name;
        let topic = this.name;
        if (!this.isCollectionStream) {
            if (this.local)
                topic = `c8locals.${this.name}`;
            else
                topic = `c8globals.${this.name}`;
        }
        this.topic = topic;
    }
    _getPath(useName, urlSuffix) {
        let topic = useName ? this.name : this.topic;
        return helper_1.getFullStreamPath(topic, urlSuffix);
    }
    createStream() {
        return this._connection.request({
            method: "POST",
            path: this._getPath(true),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    expireMessagesOnAllSubscriptions(expireTimeInSeconds) {
        const urlSuffix = `/all_subscription/expireMessages/${expireTimeInSeconds}`;
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    backlog() {
        const urlSuffix = "/backlog";
        return this._connection.request({
            method: "GET",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    getStreamStatistics() {
        const urlSuffix = "/stats";
        return this._connection.request({
            method: "GET",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    deleteSubscription(subscription) {
        const urlSuffix = `/subscription/${subscription}`;
        return this._connection.request({
            method: "DELETE",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    resetSubscriptionToPosition(subscription) {
        const urlSuffix = `/subscription/${subscription}`;
        return this._connection.request({
            method: "PUT",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    expireMessages(subscription, expireTimeInSeconds) {
        const urlSuffix = `/subscription/${subscription}/expireMessages/${expireTimeInSeconds}`;
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    resetCursor(subscription) {
        const urlSuffix = `/subscription/${subscription}/resetcursor`;
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    resetSubscriptionToTimestamp(subscription, timestamp) {
        const urlSuffix = `/subscription/${subscription}/resetcursor/${timestamp}`;
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    skipNumberOfMessages(subscription, numMessages) {
        const urlSuffix = `/subscription/${subscription}/skip/${numMessages}`;
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    skipAllMessages(subscription) {
        const urlSuffix = `/subscription/${subscription}/skip_all`;
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    getSubscriptionList() {
        const urlSuffix = "/subscriptions";
        return this._connection.request({
            method: "GET",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    terminateStream() {
        const urlSuffix = "/terminate";
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `local=${this.local}`
        }, res => res.body);
    }
    consumer(subscriptionName, callbackObj, dcName, params = {}) {
        const lowerCaseUrl = dcName.toLocaleLowerCase();
        if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https"))
            throw "Invalid DC name";
        const { onopen, onclose, onerror, onmessage } = callbackObj;
        const persist = StreamConstants.PERSISTENT;
        const region = this.local ? "c8local" : "c8global";
        const tenant = this._connection.getTenantName();
        let dbName = this._connection.getFabricName();
        let queryParams = query_string_1.stringify(params);
        if (!dbName || !tenant)
            throw "Set correct DB and/or tenant name before using.";
        const consumerUrl = `wss://${dcName}/_ws/ws/v2/consumer/${persist}/${tenant}/${region}.${dbName}/${this.topic}/${subscriptionName}?${queryParams}`;
        this._consumers.push(webSocket_1.ws(consumerUrl));
        const lastIndex = this._consumers.length - 1;
        const consumer = this._consumers[lastIndex];
        consumer.on("open", () => {
            typeof onopen === "function" && onopen();
        });
        consumer.on("close", () => {
            this._setIntervalId && clearInterval(this._setIntervalId);
            typeof onclose === "function" && onclose();
        });
        consumer.on("error", (e) => {
            typeof onerror === "function" && onerror(e);
        });
        consumer.on("message", async (msg) => {
            const message = JSON.parse(msg);
            const ackMsg = { messageId: message.messageId };
            const { payload } = message;
            if (payload !== btoa_1.btoa("noop") && payload !== "noop") {
                if (typeof onmessage === "function") {
                    const shouldAck = await onmessage(msg);
                    if (shouldAck !== false) {
                        consumer.send(JSON.stringify(ackMsg));
                    }
                }
            }
            else {
                consumer.send(JSON.stringify(ackMsg));
            }
        });
        !this._noopProducer && this.noopProducer(dcName);
        return consumer;
    }
    noopProducer(dcName) {
        const lowerCaseUrl = dcName.toLocaleLowerCase();
        if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https"))
            throw "Invalid DC name";
        const persist = StreamConstants.PERSISTENT;
        const region = this.local ? "c8local" : "c8global";
        const tenant = this._connection.getTenantName();
        let dbName = this._connection.getFabricName();
        if (!dbName || !tenant)
            throw "Set correct DB and/or tenant name before using.";
        const noopProducerUrl = `wss://${dcName}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${this.topic}`;
        this._noopProducer = webSocket_1.ws(noopProducerUrl);
        this._noopProducer.on("open", () => {
            this._setIntervalId = setInterval(() => {
                this._noopProducer.send(JSON.stringify({ payload: "noop" }));
            }, 30000);
        });
        this._noopProducer.on("error", (e) => console.log("noop producer errored ", e));
    }
    producer(message, dcName, callbackObj) {
        let onopen;
        let onclose;
        let onmessage;
        let onerror;
        if (callbackObj !== undefined) {
            onopen = callbackObj.onopen;
            onclose = callbackObj.onclose;
            onmessage = callbackObj.onmessage;
            onerror = callbackObj.onerror;
        }
        if (this._producer === undefined) {
            if (!dcName)
                throw "DC name not provided to establish producer connection";
            const lowerCaseUrl = dcName.toLocaleLowerCase();
            if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https"))
                throw "Invalid DC name";
            const persist = StreamConstants.PERSISTENT;
            const region = this.local ? "c8local" : "c8global";
            const tenant = this._connection.getTenantName();
            let dbName = this._connection.getFabricName();
            if (!dbName || !tenant)
                throw "Set correct DB and/or tenant name before using.";
            const producerUrl = `wss://${dcName}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${this.topic}`;
            this._producer = webSocket_1.ws(producerUrl);
            this._producer.on("message", (msg) => {
                typeof onmessage === "function" && onmessage(msg);
            });
            this._producer.on("open", () => {
                this._producerIntervalId = setInterval(() => {
                    this._producer.send(JSON.stringify({ payload: "noop" }));
                }, 30000);
                if (!Array.isArray(message)) {
                    this._producer.send(JSON.stringify({ payload: btoa_1.btoa(message) }));
                }
                else {
                    for (let i = 0; i < message.length; i++) {
                        this._producer.send(JSON.stringify({ payload: btoa_1.btoa(message[i]) }));
                    }
                }
                typeof onopen === "function" && onopen();
            });
            this._producer.on("close", () => {
                clearInterval(this._producerIntervalId);
                typeof onclose === "function" && onclose();
            });
            this._producer.on("error", (e) => {
                typeof onerror === "function" && onerror(e);
            });
        }
        else {
            if (this._producer.readyState === this._producer.OPEN) {
                if (!Array.isArray(message)) {
                    this._producer.send(JSON.stringify({ payload: btoa_1.btoa(message) }));
                }
                else {
                    for (let i = 0; i < message.length; i++) {
                        this._producer.send(JSON.stringify({ payload: btoa_1.btoa(message[i]) }));
                    }
                }
            }
            else {
                console.warn("Producer connection not open yet. Please wait.");
            }
        }
    }
    closeConnections() {
        this._setIntervalId && clearInterval(this._setIntervalId);
        this._producerIntervalId && clearInterval(this._producerIntervalId);
        this._producer && this._producer.terminate();
        this._noopProducer && this._noopProducer.terminate();
        this._consumers &&
            this._consumers.forEach(consumer => consumer.terminate());
    }
}
exports.Stream = Stream;
//# sourceMappingURL=stream.js.map