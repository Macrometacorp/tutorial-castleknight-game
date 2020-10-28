"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyValue {
    constructor(connection, name) {
        this._connection = connection;
        this.name = name;
    }
    getCollections() {
        return this._connection.request({
            method: "GET",
            path: "/_api/kv",
        }, (res) => res.body);
    }
    getKVCount() {
        return this._connection.request({
            method: "GET",
            path: `/_api/kv/${this.name}/count`,
        }, (res) => res.body);
    }
    getKVKeys(opts = {}) {
        return this._connection.request({
            method: "GET",
            path: `/_api/kv/${this.name}/keys`,
            qs: Object.assign({}, opts)
        }, (res) => res.body);
    }
    getValueForKey(key) {
        return this._connection.request({
            method: "GET",
            path: `/_api/kv/${this.name}/value/${key}`,
        }, (res) => res.body);
    }
    createCollection(expiration = false) {
        return this._connection.request({
            method: "POST",
            path: `/_api/kv/${this.name}`,
            qs: {
                expiration
            },
        }, (res) => res.body);
    }
    deleteCollection() {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/kv/${this.name}`,
        }, (res) => res.body);
    }
    deleteEntryForKey(key) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/kv/${this.name}/value/${key}`,
        }, (res) => res.body);
    }
    deleteEntryForKeys(keys) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/kv/${this.name}/values`,
            body: keys
        }, (res) => res.body);
    }
    insertKVPairs(keyValuePairs) {
        return this._connection.request({
            method: "PUT",
            path: `/_api/kv/${this.name}/value`,
            body: keyValuePairs
        }, (res) => res.body);
    }
}
exports.KeyValue = KeyValue;
//# sourceMappingURL=keyValue.js.map