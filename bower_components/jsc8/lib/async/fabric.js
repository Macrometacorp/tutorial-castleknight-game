"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c8ql_query_1 = require("./c8ql-query");
const collection_1 = require("./collection");
const connection_1 = require("./connection");
const cursor_1 = require("./cursor");
const error_1 = require("./error");
const graph_1 = require("./graph");
const tenant_1 = require("./tenant");
const stream_1 = require("./stream");
const route_1 = require("./route");
const btoa_1 = require("./util/btoa");
const event_1 = require("./event");
const user_1 = require("./user");
const streamapps_1 = require("./streamapps");
function colToString(collection) {
    if (collection_1.isC8Collection(collection)) {
        return String(collection.name);
    }
    else
        return String(collection);
}
const FABRIC_NOT_FOUND = 1228;
class Fabric {
    constructor(config) {
        this._connection = new connection_1.Connection(config);
    }
    get name() {
        return this._connection.getFabricName() || null;
    }
    route(path, headers) {
        return new route_1.Route(this._connection, path, headers);
    }
    close() {
        this._connection.close();
    }
    // Fabric manipulation
    useFabric(fabricName) {
        this._connection.setFabricName(fabricName);
        return this;
    }
    useBearerAuth(token) {
        this._connection.setHeader("authorization", `Bearer ${token}`);
        return this;
    }
    useBasicAuth(username, password) {
        this._connection.setHeader("authorization", `Basic ${btoa_1.btoa(`${username}:${password}`)}`);
        return this;
    }
    get() {
        return this._connection.request({ path: "/database/current" }, (res) => res.body.result);
    }
    exists() {
        return this.get().then(() => true, (err) => {
            if (error_1.isC8Error(err) && err.errorNum === FABRIC_NOT_FOUND) {
                return false;
            }
            throw err;
        });
    }
    createFabric(fabricName, users, options) {
        return this._connection.request({
            method: "POST",
            path: "/database",
            body: { users: users || [], name: fabricName, options },
        }, (res) => res.body);
    }
    listFabrics() {
        return this._connection.request({ path: "/database" }, (res) => res.body.result);
    }
    listUserFabrics() {
        return this._connection.request({ path: "/database/user" }, (res) => res.body.result);
    }
    dropFabric(fabricName) {
        return this._connection.request({
            method: "DELETE",
            path: `/database/${fabricName}`,
        }, (res) => res.body);
    }
    login(email, password) {
        return this._connection.request({
            method: "POST",
            path: "/_open/auth",
            body: { email, password },
            absolutePath: true,
        }, (res) => {
            this.useBearerAuth(res.body.jwt);
            this.useTenant(res.body.tenant);
            return res.body;
        });
    }
    updateFabricSpotRegion(tenantName, fabricName, datacenter = "") {
        return this._connection.request({
            method: "PUT",
            path: `_tenant/${tenantName}/_fabric/${fabricName}/database/${datacenter}`,
            absolutePath: true,
        }, (res) => res.body);
    }
    getEvents() {
        return this._connection.request({
            method: "GET",
            path: `/events`,
        }, (res) => res.body);
    }
    deleteEvents(eventIds) {
        return this._connection.request({
            method: "DELETE",
            path: `/events`,
            body: JSON.stringify(eventIds),
        }, (res) => res.body);
    }
    event(entityName, eventId) {
        return new event_1.Event(this._connection, entityName, eventId);
    }
    // Collection manipulation
    collection(collectionName) {
        return new collection_1.DocumentCollection(this._connection, collectionName);
    }
    edgeCollection(collectionName) {
        return new collection_1.EdgeCollection(this._connection, collectionName);
    }
    listCollections(excludeSystem = true) {
        return this._connection.request({
            path: "/collection",
            qs: { excludeSystem },
        }, (res) => this._connection.c8Major <= 2 ? res.body.collections : res.body.result);
    }
    async collections(excludeSystem = true) {
        const collections = await this.listCollections(excludeSystem);
        return collections.map((data) => collection_1.constructCollection(this._connection, data));
    }
    async truncate(excludeSystem = true) {
        const collections = await this.listCollections(excludeSystem);
        return await Promise.all(collections.map((data) => this._connection.request({
            method: "PUT",
            path: `/collection/${data.name}/truncate`,
        }, (res) => res.body)));
    }
    // Graph manipulation
    graph(graphName) {
        return new graph_1.Graph(this._connection, graphName);
    }
    listGraphs() {
        return this._connection.request({ path: "/_api/graph" }, (res) => res.body.graphs);
    }
    async graphs() {
        const graphs = await this.listGraphs();
        return graphs.map((data) => this.graph(data._key));
    }
    transaction(collections, action, params, options) {
        if (typeof params === "number") {
            options = params;
            params = undefined;
        }
        if (typeof options === "number") {
            options = { lockTimeout: options };
        }
        if (typeof collections === "string") {
            collections = { write: [collections] };
        }
        else if (Array.isArray(collections)) {
            collections = { write: collections.map(colToString) };
        }
        else if (collection_1.isC8Collection(collections)) {
            collections = { write: colToString(collections) };
        }
        else if (collections && typeof collections === "object") {
            collections = Object.assign({}, collections);
            if (collections.read) {
                if (!Array.isArray(collections.read)) {
                    collections.read = colToString(collections.read);
                }
                else
                    collections.read = collections.read.map(colToString);
            }
            if (collections.write) {
                if (!Array.isArray(collections.write)) {
                    collections.write = colToString(collections.write);
                }
                else
                    collections.write = collections.write.map(colToString);
            }
        }
        return this._connection.request({
            method: "POST",
            path: "/transaction",
            body: Object.assign({ collections,
                action,
                params }, options),
        }, (res) => res.body.result);
    }
    query(query, bindVars, opts) {
        if (c8ql_query_1.isC8QLQuery(query)) {
            opts = bindVars;
            bindVars = query.bindVars;
            query = query.query;
        }
        else if (c8ql_query_1.isC8QLLiteral(query)) {
            query = query.toC8QL();
        }
        return this._connection.request({
            method: "POST",
            path: "/cursor",
            body: Object.assign({}, opts, { query, bindVars }),
        }, (res) => new cursor_1.ArrayCursor(this._connection, res.body, res.host));
    }
    validateQuery(query) {
        return this._connection.request({
            method: "POST",
            path: "/query",
            body: { query },
        }, (res) => res.body);
    }
    explainQuery(explainQueryObj) {
        return this._connection.request({
            method: "POST",
            path: "/_api/explain",
            body: Object.assign({}, explainQueryObj),
        }, (res) => res.body);
    }
    getCurrentQueries() {
        return this._connection.request({
            path: "/query/current",
        }, (res) => res.body);
    }
    clearSlowQueries() {
        return this._connection.request({
            method: "DELETE",
            path: "/query/slow",
        }, (res) => res.body);
    }
    getSlowQueries() {
        return this._connection.request({
            path: "/query/slow",
        }, (res) => res.body);
    }
    terminateRunningQuery(queryId) {
        return this._connection.request({
            method: "DELETE",
            path: `/query/${queryId}`,
        }, (res) => res.body);
    }
    // Function management
    listFunctions() {
        return this._connection.request({ path: "/c8qlfunction" }, (res) => res.body);
    }
    createFunction(name, code, isDeterministic) {
        return this._connection.request({
            method: "POST",
            path: "/c8qlfunction",
            body: { name, code, isDeterministic },
        }, (res) => res.body);
    }
    dropFunction(name, group) {
        const path = typeof group === "boolean"
            ? `/c8qlfunction/${name}?group=${group}`
            : `/c8qlfunction/${name}`;
        return this._connection.request({
            method: "DELETE",
            path,
        }, (res) => res.body);
    }
    version(details = false) {
        return this._connection.request({
            method: "GET",
            path: `/_fabric/${this._connection.getFabricName()}/_api/version`,
            absolutePath: true,
            qs: { details },
        }, (res) => res.body);
    }
    // Tenant
    useTenant(tenantName) {
        this._connection.setTenantName(tenantName);
        return this;
    }
    tenant(email, tenantName) {
        return new tenant_1.Tenant(this._connection, email, tenantName);
    }
    listTenants() {
        return this._connection.request({
            method: "GET",
            path: "/tenants",
            absolutePath: true,
        }, (res) => res.body);
    }
    //Stream
    stream(streamName, local, isCollectionStream = false) {
        return new stream_1.Stream(this._connection, streamName, local, isCollectionStream);
    }
    /* -------------------------------- DUPLICATE ------------------------------- */
    // TODO: @RACHIT choose which Fn to deprecate
    getStreams(global = undefined) {
        return this._connection.request({
            method: "GET",
            path: "/streams",
            qs: global === undefined ? "" : `global=${global}`,
        }, (res) => res.body);
    }
    getAllStreams() {
        return this._connection.request({
            method: "GET",
            path: "/streams",
        }, (res) => res.body);
    }
    /* ----------------------------------- --- ---------------------------------- */
    // TODO: RACHIT/VIKAS DO WE STILL HAVE THIS API?
    listPersistentStreams(local = false) {
        return this._connection.request({
            method: "GET",
            path: `/streams/persistent`,
            qs: `local=${local}`,
        }, (res) => res.body);
    }
    clearBacklog() {
        return this._connection.request({
            method: "POST",
            path: "/streams/clearbacklog",
        }, (res) => res.body);
    }
    clearSubscriptionBacklog(subscription) {
        return this._connection.request({
            method: "POST",
            path: `/streams/clearbacklog/${subscription}`,
        }, (res) => res.body);
    }
    unsubscribe(subscription) {
        return this._connection.request({
            method: "POST",
            path: `/streams/unsubscribe/${subscription}`,
        }, (res) => res.body);
    }
    //edge locations
    getAllEdgeLocations() {
        return this._connection.request({
            method: "GET",
            path: "/datacenter/all",
            absolutePath: true,
        }, (res) => res.body);
    }
    getTenantEdgeLocations() {
        return this._connection.request({
            method: "GET",
            path: `/datacenter/_tenant/${this._connection.getTenantName()}`,
            absolutePath: true,
        }, (res) => res.body);
    }
    getLocalEdgeLocation() {
        return this._connection.request({
            method: "GET",
            path: "/datacenter/local",
            absolutePath: true,
        }, (res) => res.body);
    }
    changeEdgeLocationSpotStatus(dcName, isSpot) {
        return this._connection.request({
            method: "PUT",
            path: `_api/datacenter/${dcName}/${isSpot}`,
            absolutePath: true,
        }, (res) => res.body);
    }
    //user
    user(user, email = '') {
        return new user_1.default(this._connection, user, email);
    }
    getAllUsers() {
        return this._connection.request({
            method: "GET",
            path: `/_admin/user`,
        }, (res) => res.body);
    }
    //User Queries / RESTQL
    listSavedQueries() {
        return this._connection.request({
            method: "GET",
            path: `/restql/user`,
        }, (res) => res.body);
    }
    saveQuery(name, parameter = {}, value) {
        try {
            if (name.includes(" "))
                throw "Spaces are not allowed in query name";
            return this._connection.request({
                method: "POST",
                path: "/restql",
                body: {
                    query: {
                        name: name,
                        parameter: parameter,
                        value: value,
                    },
                },
            }, (res) => res.body);
        }
        catch (err) {
            return err;
        }
    }
    executeSavedQuery(queryName, bindVars = {}) {
        return this._connection.request({
            method: "POST",
            path: `/restql/execute/${queryName}`,
            body: {
                bindVars: bindVars,
            },
        }, (res) => res.body);
    }
    updateSavedQuery(queryName, parameter = {}, value) {
        return this._connection.request({
            method: "PUT",
            path: `/restql/${queryName}`,
            body: {
                query: {
                    parameter: parameter,
                    value: value,
                },
            },
        }, (res) => res.body);
    }
    deleteSavedQuery(queryName) {
        return this._connection.request({
            method: "DELETE",
            path: `/restql/${queryName}`,
        }, (res) => res.body);
    }
    createRestqlCursor(query, bindVars = {}) {
        return this._connection.request({
            method: "POST",
            path: `/restql/dynamic`,
            body: {
                bindVars: [bindVars],
                cache: true,
                count: true,
                options: {
                    profile: true,
                },
                query: query,
            },
        }, (res) => res.body);
    }
    // Stream Applications
    streamApp(appName) {
        return new streamapps_1.Streamapps(this._connection, appName);
    }
    createStreamApp(regions, appDefinition) {
        return this._connection.request({
            method: "POST",
            path: "/_api/streamapps",
            body: JSON.stringify({
                definition: appDefinition,
                regions: regions,
            }),
        }, (res) => res.body);
    }
    getAllStreamApps() {
        return this._connection.request({
            method: "GET",
            path: "/_api/streamapps",
        }, (res) => res.body);
    }
    validateStreamappDefinition(appDefinition) {
        return this._connection.request({
            method: "POST",
            path: "/_api/streamapps/validate",
            body: {
                definition: appDefinition,
            },
        }, (res) => res.body);
    }
    getSampleStreamApps() {
        return this._connection.request({
            method: "GET",
            path: "/_api/streamapps/samples",
        }, (res) => res.body);
    }
}
exports.Fabric = Fabric;
//# sourceMappingURL=fabric.js.map