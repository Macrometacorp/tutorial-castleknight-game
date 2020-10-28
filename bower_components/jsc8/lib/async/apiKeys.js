"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiKeys {
    constructor(connection, keyid = "", dbName = "") {
        this._connection = connection;
        this.keyid = keyid;
        this.dbName = dbName;
    }
    validateApiKey(data) {
        return this._connection.request({
            method: "POST",
            path: "/_api/key/validate",
            body: data
        }, (res) => res.body);
    }
    createApiKey() {
        return this._connection.request({
            method: "POST",
            path: "/_api/key",
            body: {
                keyid: this.keyid
            }
        }, (res) => res.body);
    }
    getAvailableApiKeys() {
        return this._connection.request({
            method: "GET",
            path: "/_api/key",
        }, (res) => res.body);
    }
    getAvailableApiKey() {
        return this._connection.request({
            method: "GET",
            path: `/_api/key/${this.keyid}`,
        }, (res) => res.body);
    }
    removeApiKey() {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/key/${this.keyid}`,
        }, (res) => res.body);
    }
    //---------------- database access level ----------------
    listAccessibleDatabases(full = false) {
        return this._connection.request({
            method: "GET",
            path: `/_api/key/${this.keyid}/database`,
            qs: {
                full
            }
        }, (res) => res.body);
    }
    getDatabaseAccessLevel() {
        return this._connection.request({
            method: "GET",
            path: `/_api/key/${this.keyid}/database/${this.dbName}`,
        }, (res) => res.body);
    }
    clearDatabaseAccessLevel() {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/key/${this.keyid}/database/${this.dbName}`,
        }, (res) => res.body);
    }
    setDatabaseAccessLevel(permission) {
        return this._connection.request({
            method: "PUT",
            path: `/_api/key/${this.keyid}/database/${this.dbName}`,
            body: {
                grant: permission
            }
        }, (res) => res.body);
    }
    //---------------- Collection access level ----------------
    listAccessibleCollections(full = false) {
        return this._connection.request({
            method: "GET",
            path: `/_api/key/${this.keyid}/database/${this.dbName}/collection`,
            qs: {
                full
            }
        }, (res) => res.body);
    }
    getCollectionAccessLevel(collectionName) {
        return this._connection.request({
            method: "GET",
            path: `/_api/key/${this.keyid}/database/${this.dbName}/collection/${collectionName}`,
        }, (res) => res.body);
    }
    clearCollectionAccessLevel(collectionName) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/key/${this.keyid}/database/${this.dbName}/collection/${collectionName}`,
        }, (res) => res.body);
    }
    setCollectionAccessLevel(collectionName, permission) {
        return this._connection.request({
            method: "PUT",
            path: `/_api/key/${this.keyid}/database/${this.dbName}/collection/${collectionName}`,
            body: {
                grant: permission
            }
        }, (res) => res.body);
    }
    //---------------- Stream access level ----------------
    listAccessibleStreams(full = false) {
        return this._connection.request({
            method: "GET",
            path: `/_api/key/${this.keyid}/database/${this.dbName}/stream`,
            qs: {
                full
            }
        }, (res) => res.body);
    }
    getStreamAccessLevel(streamName) {
        return this._connection.request({
            method: "GET",
            path: `/_api/key/${this.keyid}/database/${this.dbName}/stream/${streamName}`,
        }, (res) => res.body);
    }
    clearStreamAccessLevel(streamName) {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/key/${this.keyid}/database/${this.dbName}/stream/${streamName}`,
        }, (res) => res.body);
    }
    setStreamAccessLevel(streamName, permission) {
        return this._connection.request({
            method: "PUT",
            path: `/_api/key/${this.keyid}/database/${this.dbName}/stream/${streamName}`,
            body: {
                grant: permission
            }
        }, (res) => res.body);
    }
    //---------------- Billing access level ----------------
    getBillingAccessLevel() {
        return this._connection.request({
            method: "GET",
            path: `/_api/key/${this.keyid}/billing`,
        }, (res) => res.body);
    }
    clearBillingAccessLevel() {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/key/${this.keyid}/billing`,
        }, (res) => res.body);
    }
    setBillingAccessLevel(permission) {
        return this._connection.request({
            method: "PUT",
            path: `/_api/key/${this.keyid}/billing`,
            body: {
                grant: permission
            }
        }, (res) => res.body);
    }
}
exports.ApiKeys = ApiKeys;
//# sourceMappingURL=apiKeys.js.map