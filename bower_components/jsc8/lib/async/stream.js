"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./util/helper");
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
        /**
         * CHANGED this.local implementation to this.global
         * keeping the stream as local so !local
         */
        this.global = !local;
        this.name = name;
        let topic = this.name;
        if (!this.isCollectionStream) {
            if (this.global)
                topic = `c8globals.${this.name}`;
            else
                topic = `c8locals.${this.name}`;
        }
        this.topic = topic;
    }
    _getPath(useName, urlSuffix) {
        let topic = useName ? this.name : this.topic;
        return helper_1.getFullStreamPath(topic, urlSuffix);
    }
    getOtp() {
        return this._connection.request({
            method: "POST",
            path: "/apid/otp",
            absolutePath: true,
        }, (res) => res.body.otp);
    }
    createStream() {
        return this._connection.request({
            method: "POST",
            path: this._getPath(true),
            qs: `global=${this.global}`,
        }, (res) => res.body);
    }
    backlog() {
        const urlSuffix = "/backlog";
        return this._connection.request({
            method: "GET",
            path: this._getPath(false, urlSuffix),
            qs: `global=${this.global}`,
        }, (res) => res.body);
    }
    clearBacklog() {
        const urlSuffix = `/clearbacklog`;
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `global=${this.global}`,
        }, (res) => res.body);
    }
    getStreamStatistics() {
        const urlSuffix = "/stats";
        return this._connection.request({
            method: "GET",
            path: this._getPath(false, urlSuffix),
            qs: `global=${this.global}`,
        }, (res) => res.body);
    }
    deleteSubscription(subscription) {
        const urlSuffix = `/subscription/${subscription}`;
        return this._connection.request({
            method: "DELETE",
            path: this._getPath(false, urlSuffix),
            qs: `global=${this.global}`,
        }, (res) => res.body);
    }
    expireMessages(expireTimeInSeconds) {
        const urlSuffix = `/expiry/${expireTimeInSeconds}`;
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `global=${this.global}`,
        }, (res) => res.body);
    }
    clearSubscriptionBacklog(subscription) {
        const urlSuffix = `/clearbacklog/${subscription}`;
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `global=${this.global}`,
        }, (res) => res.body);
    }
    getSubscriptionList() {
        const urlSuffix = "/subscriptions";
        return this._connection.request({
            method: "GET",
            path: this._getPath(false, urlSuffix),
            qs: `global=${this.global}`,
        }, (res) => res.body);
    }
    deleteStream(force = false) {
        return this._connection.request({
            method: "DELETE",
            path: this._getPath(false),
            qs: `global=${this.global}&force=${force}`,
        }, (res) => res.body);
    }
    consumer(subscriptionName, dcName, params = {}) {
        const lowerCaseUrl = dcName.toLocaleLowerCase();
        if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https"))
            throw "Invalid DC name";
        const persist = StreamConstants.PERSISTENT;
        const region = this.global ? "c8global" : "c8local";
        const tenant = this._connection.getTenantName();
        const queryParams = query_string_1.stringify(params);
        let dbName = this._connection.getFabricName();
        if (!dbName || !tenant)
            throw "Set correct DB and/or tenant name before using.";
        let consumerUrl = `wss://api-${dcName}/_ws/ws/v2/consumer/${persist}/${tenant}/${region}.${dbName}/${this.topic}/${subscriptionName}`;
        // Appending query params to the url
        consumerUrl = `${consumerUrl}?${queryParams}`;
        return webSocket_1.ws(consumerUrl);
    }
    producer(dcName, params = {}) {
        if (!dcName)
            throw "DC name not provided to establish producer connection";
        const lowerCaseUrl = dcName.toLocaleLowerCase();
        if (lowerCaseUrl.includes("http") || lowerCaseUrl.includes("https"))
            throw "Invalid DC name";
        const persist = StreamConstants.PERSISTENT;
        const region = this.global ? "c8global" : "c8local";
        const tenant = this._connection.getTenantName();
        const queryParams = query_string_1.stringify(params);
        let dbName = this._connection.getFabricName();
        if (!dbName || !tenant)
            throw "Set correct DB and/or tenant name before using.";
        let producerUrl = `wss://api-${dcName}/_ws/ws/v2/producer/${persist}/${tenant}/${region}.${dbName}/${this.topic}`;
        // Appending query params to the url
        producerUrl = `${producerUrl}?${queryParams}`;
        return webSocket_1.ws(producerUrl);
    }
    publishMessage(message) {
        const urlSuffix = "/publish";
        return this._connection.request({
            method: "POST",
            path: this._getPath(false, urlSuffix),
            qs: `global=${this.global}`,
            body: message,
        }, (res) => res.body);
    }
    getMessageTtl() {
        return this._connection.request({
            method: "GET",
            path: "/_api/streams/ttl",
        }, (res) => res.body);
    }
    setMessageTtl(ttl = 3600) {
        return this._connection.request({
            method: "POST",
            path: `/_api/streams/ttl/${ttl}`,
        }, (res) => res.body);
    }
    deleteSubscriptions(subscription) {
        const urlSuffix = `/subscriptions/${subscription}`;
        return this._connection.request({
            method: "DELETE",
            path: this._getPath(false, urlSuffix),
            qs: `global=${this.global}`,
        }, (res) => res.body);
    }
}
exports.Stream = Stream;
//# sourceMappingURL=stream.js.map