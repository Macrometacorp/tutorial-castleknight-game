"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
exports.USER_NOT_FOUND = 1703;
class User {
    constructor(connection, user, email = '') {
        this.user = "";
        this.urlPrefix = "/_admin/user";
        this.user = user;
        this._connection = connection;
        this.email = email;
    }
    createUser(passwd = "", active = true, extra = {}) {
        return this._connection.request({
            method: "POST",
            path: this.urlPrefix,
            body: {
                user: this.user,
                email: this.email,
                passwd: passwd,
                active,
                extra
            }
        }, res => res.body);
    }
    getUserDeatils() {
        return this._connection.request({
            method: "GET",
            path: `${this.urlPrefix}/${this.user}`
        }, res => res.body);
    }
    hasUser() {
        return this.getUserDeatils().then(() => true, (err) => {
            if (error_1.isC8Error(err) && err.errorNum === exports.USER_NOT_FOUND) {
                return false;
            }
            throw err;
        });
    }
    deleteUser() {
        return this._connection.request({
            method: "DELETE",
            path: `${this.urlPrefix}/${this.user}`
        }, res => res.body);
    }
    _makeModification(config, methodType) {
        return this._connection.request({
            method: methodType,
            path: `${this.urlPrefix}/${this.user}`,
            body: Object.assign({}, config)
        }, res => res.body);
    }
    modifyUser(config) {
        return this._makeModification(config, "PATCH");
    }
    replaceUser(config) {
        return this._makeModification(config, "PUT");
    }
    getAllDatabases(isFullRequested = false) {
        return this._connection.request({
            method: "GET",
            path: `${this.urlPrefix}/${this.user}/database`,
            qs: {
                full: isFullRequested
            }
        }, res => res.body);
    }
    getDatabaseAccessLevel(databaseName) {
        return this._connection.request({
            method: "GET",
            path: `${this.urlPrefix}/${this.user}/database/${databaseName}`
        }, res => res.body);
    }
    clearDatabaseAccessLevel(fabricName) {
        return this._connection.request({
            method: "DELETE",
            path: `${this.urlPrefix}/${this.user}/database/${fabricName}`
        }, res => res.body);
    }
    setDatabaseAccessLevel(fabricName, permission) {
        return this._connection.request({
            method: "PUT",
            path: `${this.urlPrefix}/${this.user}/database/${fabricName}`,
            body: {
                grant: permission
            }
        }, res => res.body);
    }
    getCollectionAccessLevel(databaseName, collectionName) {
        return this._connection.request({
            method: "GET",
            path: `${this.urlPrefix}/${this.user}/database/${databaseName}/collection/${collectionName}`
        }, res => res.body);
    }
    clearCollectionAccessLevel(fabricName, collectionName) {
        return this._connection.request({
            method: "DELETE",
            path: `${this.urlPrefix}/${this.user}/database/${fabricName}/collection/${collectionName}`
        }, res => res.body);
    }
    setCollectionAccessLevel(fabricName, collectionName, permission) {
        return this._connection.request({
            method: "PUT",
            path: `${this.urlPrefix}/${this.user}/database/${fabricName}/collection/${collectionName}`,
            body: {
                grant: permission
            }
        }, res => res.body);
    }
    listAvailableUsers() {
        return this._connection.request({
            method: "GET",
            path: `${this.urlPrefix}`
        }, res => res.body);
    }
    getStreamAccessLevel(databaseName, streamName) {
        return this._connection.request({
            method: "GET",
            path: `${this.urlPrefix}/${this.user}/database/${databaseName}/stream/${streamName}`
        }, res => res.body);
    }
    clearStreamAccessLevel(databaseName, streamName) {
        return this._connection.request({
            method: "DELETE",
            path: `${this.urlPrefix}/${this.user}/database/${databaseName}/stream/${streamName}`
        }, res => res.body);
    }
    setStreamAccessLevel(databaseName, streamName, permission) {
        return this._connection.request({
            method: "PUT",
            path: `${this.urlPrefix}/${this.user}/database/${databaseName}/stream/${streamName}`,
            body: {
                grant: permission
            }
        }, res => res.body);
    }
    listAccessibleCollections(databaseName, isFullRequested = false) {
        return this._connection.request({
            method: "GET",
            path: `${this.urlPrefix}/${this.user}/database/${databaseName}/collection`,
            qs: {
                full: isFullRequested
            }
        }, res => res.body);
    }
    listAccessibleStreams(databaseName, isFullRequested = false) {
        return this._connection.request({
            method: "GET",
            path: `${this.urlPrefix}/${this.user}/database/${databaseName}/stream`,
            qs: {
                full: isFullRequested
            }
        }, res => res.body);
    }
    getBillingAccessLevel() {
        return this._connection.request({
            method: "GET",
            path: `${this.urlPrefix}/${this.user}/billing`
        }, res => res.body);
    }
    clearBillingAccessLevel() {
        return this._connection.request({
            method: "DELETE",
            path: `${this.urlPrefix}/${this.user}/billing`
        }, res => res.body);
    }
    setBillingAccessLevel(permission) {
        return this._connection.request({
            method: "PUT",
            path: `${this.urlPrefix}/${this.user}/billing`,
            body: {
                grant: permission
            }
        }, res => res.body);
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map