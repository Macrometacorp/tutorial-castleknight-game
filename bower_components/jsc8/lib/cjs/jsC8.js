"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c8ql_query_1 = require("./c8ql-query");
exports.c8ql = c8ql_query_1.c8ql;
const collection_1 = require("./collection");
exports.BaseCollection = collection_1.BaseCollection;
const fabric_1 = require("./fabric");
exports.Fabric = fabric_1.Fabric;
const error_1 = require("./error");
const cursor_1 = require("./cursor");
exports.ArrayCursor = cursor_1.ArrayCursor;
const client_1 = require("./client");
exports.C8Client = client_1.C8Client;
function jsC8(config) {
    return new client_1.C8Client(config);
}
exports.default = jsC8;
Object.assign(jsC8, { CollectionType: collection_1.CollectionType, C8Error: error_1.C8Error, Fabric: fabric_1.Fabric, c8ql: c8ql_query_1.c8ql, C8Client: client_1.C8Client });
var collection_2 = require("./collection");
exports.DocumentCollection = collection_2.DocumentCollection;
exports.EdgeCollection = collection_2.EdgeCollection;
var graph_1 = require("./graph");
exports.Graph = graph_1.Graph;
var tenant_1 = require("./tenant");
exports.Tenant = tenant_1.Tenant;
var stream_1 = require("./stream");
exports.Stream = stream_1.Stream;
var streamapps_1 = require("./streamapps");
exports.Streamapps = streamapps_1.Streamapps;
//# sourceMappingURL=jsC8.js.map