"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_1 = require("./fabric");
const keyValue_1 = require("./keyValue");
const apiKeys_1 = require("./apiKeys");
const csv = require("csvtojson");
class C8Client extends fabric_1.Fabric {
    constructor(config) {
        super(config);
    }
    useApiKeyAuth(apikey) {
        this._connection.setHeader("authorization", `apikey ${apikey}`);
        return this;
    }
    async loginWithToken(jwt) {
        this.useBearerAuth(jwt);
        const { error, errorMessage, result } = await this.validateApiKey({ jwt });
        if (error) {
            throw new Error(errorMessage);
        }
        else {
            const { tenant } = result;
            this.useTenant(tenant);
        }
    }
    async loginWithApiKey(apikey) {
        this.useApiKeyAuth(apikey);
        const { error, errorMessage, result } = await this.validateApiKey({ apikey });
        if (error) {
            throw new Error(errorMessage);
        }
        else {
            const { tenant } = result;
            this.useTenant(tenant);
        }
    }
    createCollection(collectionName, properties, isEdge = false) {
        let collection;
        if (isEdge) {
            collection = this.edgeCollection(collectionName);
        }
        else {
            collection = this.collection(collectionName);
        }
        return collection.create(properties);
    }
    deleteCollection(collectionName, opts) {
        const collection = this.collection(collectionName);
        return collection.drop(opts);
    }
    hasCollection(collectionName) {
        const collection = this.collection(collectionName);
        return collection.exists();
    }
    getCollection(collectionName) {
        const collection = this.collection(collectionName);
        return collection.get();
    }
    getCollections(excludeSystem = true) {
        return this.listCollections(excludeSystem);
    }
    async onCollectionChange(collectionName, dcName, subscriptionName) {
        const dcList = await this.getDcList();
        let dcUrl = dcList[0].dcInfo[0].tags.url;
        if (dcName) {
            dcUrl = dcName;
        }
        const collection = this.collection(collectionName);
        return collection.onChange(dcUrl, subscriptionName);
    }
    getDocument(collectionName, documentHandle, graceful = false) {
        const collection = this.collection(collectionName);
        return collection.document(documentHandle, graceful);
    }
    getDocumentMany(collectionName, limit, skip) {
        const getDocumentsQuery = `FOR doc IN ${collectionName} ${limit ? `limit ${skip ? `${skip},` : ""}${limit}` : ""} return doc`;
        return this.executeQuery(getDocumentsQuery);
    }
    insertDocument(collectionName, data, opts) {
        const collection = this.collection(collectionName);
        return collection.save(data, opts);
    }
    insertDocumentMany(collectionName, data, opts) {
        const collection = this.collection(collectionName);
        return collection.save(data, opts);
    }
    async insertDocumentFromFile(collectionName, csvPath, opts) {
        const data = await csv().fromFile(csvPath);
        const collection = this.collection(collectionName);
        return collection.save(data, opts);
    }
    updateDocument(collectionName, documentHandle, newValue, opts = {}) {
        const collection = this.collection(collectionName);
        return collection.update(documentHandle, newValue, opts);
    }
    updateDocumentMany(collectionName, documentsHandle, opts = {}) {
        const collection = this.collection(collectionName);
        return collection.updateDocuments(documentsHandle, opts);
    }
    replaceDocument(collectionName, documentHandle, newValue, opts = {}) {
        const collection = this.collection(collectionName);
        return collection.replace(documentHandle, newValue, opts);
    }
    replaceDocumentMany(collectionName, documentsHandle, opts = {}) {
        const collection = this.collection(collectionName);
        return collection.replaceDocuments(documentsHandle, opts);
    }
    deleteDocument(collectionName, documentHandle, opts = {}) {
        const collection = this.collection(collectionName);
        return collection.remove(documentHandle, opts);
    }
    deleteDocumentMany(collectionName, documentsHandle, opts = {}) {
        const collection = this.collection(collectionName);
        return collection.removeDocuments(documentsHandle, opts);
    }
    listCollectionIndexes(collectionName) {
        const collection = this.collection(collectionName);
        return collection.indexes();
    }
    addHashIndex(collectionName, fields, opts) {
        const collection = this.collection(collectionName);
        return collection.createHashIndex(fields, opts);
    }
    addGeoIndex(collectionName, fields, opts) {
        const collection = this.collection(collectionName);
        return collection.createGeoIndex(fields, opts);
    }
    addSkiplistIndex(collectionName, fields, opts) {
        const collection = this.collection(collectionName);
        return collection.createSkipList(fields, opts);
    }
    addPersistentIndex(collectionName, fields, opts) {
        const collection = this.collection(collectionName);
        return collection.createPersistentIndex(fields, opts);
    }
    addFullTextIndex(collectionName, fields, minLength) {
        const collection = this.collection(collectionName);
        return collection.createFulltextIndex(fields, minLength);
    }
    addTtlIndex(collectionName, fields, expireAfter) {
        const collection = this.collection(collectionName);
        return collection.createTtlIndex(fields, expireAfter);
    }
    deleteIndex(collectionName, indexName) {
        const collection = this.collection(collectionName);
        return collection.dropIndex(indexName);
    }
    getCollectionIds(collectionName) {
        const getIdsQuery = `FOR doc IN ${collectionName} RETURN doc._id`;
        return this.executeQuery(getIdsQuery);
    }
    getCollectionKeys(collectionName) {
        const getKeysQuery = `FOR doc IN ${collectionName} RETURN doc._key`;
        return this.executeQuery(getKeysQuery);
    }
    getCollectionIndexes(collectionName) {
        const collection = this.collection(collectionName);
        return collection.indexes();
    }
    // validateQuery() { } already available
    executeQuery(query, bindVars, opts) {
        return this.query(query, bindVars, opts).then((cursor) => cursor.all());
    }
    // explainQuery() { } already available
    getRunningQueries() {
        return this.getCurrentQueries();
    }
    killQuery(queryId) {
        return this.terminateRunningQuery(queryId);
    }
    createRestql(restqlName, value, parameter = {}) {
        return this.saveQuery(restqlName, parameter, value);
    }
    executeRestql(restqlName, bindVars = {}) {
        return this.executeSavedQuery(restqlName, bindVars);
    }
    updateRestql(restqlName, value, parameter = {}) {
        return this.updateSavedQuery(restqlName, parameter, value);
    }
    deleteRestql(restqlName) {
        return this.deleteSavedQuery(restqlName);
    }
    getRestqls() {
        return this.listSavedQueries();
    }
    getDcList() {
        return this.getTenantEdgeLocations();
    }
    getLocalDc() {
        return this.getLocalEdgeLocation();
    }
    createStream(streamName, local, isCollectionStream = false) {
        const stream = this.stream(streamName, local, isCollectionStream);
        return stream.createStream();
    }
    hasStream(streamName, local) {
        const topic = local ? `c8locals.${streamName}` : `c8globals.${streamName}`;
        // @VIKAS Cant we use any other api eg: /_api/streams/c8locals.test/stats
        // If 200 api exits else api does not exist
        return this.getStreams(!local).then((res) => !!res.result.find((stream) => stream.topic === topic), (err) => {
            throw err;
        });
    }
    getStream(streamName, local, isCollectionStream = false) {
        const stream = this.stream(streamName, local, isCollectionStream);
        return stream;
    }
    //getStreams() { } // already present
    getStreamStats(streamName, local, isCollectionStream = false) {
        const stream = this.stream(streamName, local, isCollectionStream);
        return stream.getStreamStatistics();
    }
    async createStreamProducer(streamName, local, isCollectionStream = false, dcName, params = {}) {
        const dcList = await this.getDcList();
        let dcUrl = dcList[0].dcInfo[0].tags.url;
        if (dcName) {
            dcUrl = dcName;
        }
        const stream = this.stream(streamName, local, isCollectionStream);
        const otp = await stream.getOtp();
        return stream.producer(dcUrl, Object.assign({}, params, { otp }));
    }
    async createStreamReader(streamName, subscriptionName, local, isCollectionStream = false, dcName, params = {}) {
        const dcList = await this.getDcList();
        let dcUrl = dcList[0].dcInfo[0].tags.url;
        if (dcName) {
            dcUrl = dcName;
        }
        const stream = this.stream(streamName, local, isCollectionStream);
        const otp = await stream.getOtp();
        return stream.consumer(subscriptionName, dcUrl, Object.assign({}, params, { otp }));
    }
    async subscribe(streamName, local, isCollectionStream = false, subscriptionName, dcName, params = {}) {
        const dcList = await this.getDcList();
        let dcUrl = dcList[0].dcInfo[0].tags.url;
        if (dcName) {
            dcUrl = dcName;
        }
        const stream = this.stream(streamName, local, isCollectionStream);
        const otp = await stream.getOtp();
        return stream.consumer(subscriptionName, dcUrl, Object.assign({}, params, { otp }));
    } // how is it same as create  web socket handler
    // unsubscribe(){} already available
    getStreamBacklog(streamName, local, isCollectionStream = false) {
        const stream = this.stream(streamName, local, isCollectionStream);
        return stream.backlog();
    }
    clearStreamBacklog(subscription) {
        return this.clearSubscriptionBacklog(subscription);
    }
    clearStreamsBacklog() {
        return this.clearBacklog();
    }
    getStreamSubscriptions(streamName, local, isCollectionStream = false) {
        const stream = this.stream(streamName, local, isCollectionStream);
        return stream.getSubscriptionList();
    }
    deleteStreamSubscription(streamName, subscription, local, isCollectionStream = false) {
        const stream = this.stream(streamName, local, isCollectionStream);
        return stream.deleteSubscription(subscription);
    }
    // createStreamApp() { } already present
    validateStreamApp(appDefinition) {
        return this.validateStreamappDefinition(appDefinition);
    }
    retrieveStreamApp() {
        return this.getAllStreamApps();
    }
    deleteStreamApp(appName) {
        const streamApp = this.streamApp(appName);
        return streamApp.deleteApplication();
    }
    getStreamApp(appName) {
        const streamApp = this.streamApp(appName);
        return streamApp.retriveApplication();
    }
    getStreamAppSamples() {
        return this.getSampleStreamApps();
    }
    activateStreamApp(appName, active) {
        const streamApp = this.streamApp(appName);
        return streamApp.activateStreamApplication(active);
    }
    createGraph(graphName, properties = {}) {
        const graph = this.graph(graphName);
        return graph.create(properties);
    }
    deleteGraph(graphName, dropCollections) {
        const graph = this.graph(graphName);
        return graph.drop(dropCollections);
    }
    hasGraph(graphName) {
        const graph = this.graph(graphName);
        return graph.exists();
    }
    getGraph(graphName) {
        const graph = this.graph(graphName);
        return graph.get();
    }
    getGraphs() {
        return this.graphs();
    }
    insertEdge(graphName, definition) {
        const graph = this.graph(graphName);
        return graph.addEdgeDefinition(definition);
    }
    updateEdge(graphName, collectionName, documentHandle, newValue, opts = {}) {
        const graph = this.graph(graphName);
        const graphEdgeCollection = graph.edgeCollection(collectionName);
        return graphEdgeCollection.update(documentHandle, newValue, opts);
    }
    replaceEdge(graphName, collectionName, documentHandle, newValue, opts = {}) {
        const graph = this.graph(graphName);
        const graphEdgeCollection = graph.edgeCollection(collectionName);
        return graphEdgeCollection.replace(documentHandle, newValue, opts);
    }
    deleteEdge(graphName, collectionName, documentHandle, opts = {}) {
        const graph = this.graph(graphName);
        const graphEdgeCollection = graph.edgeCollection(collectionName);
        return graphEdgeCollection.remove(documentHandle, opts);
    }
    async getEdges(graphName) {
        const graph = this.graph(graphName);
        const graphDetails = await graph.get();
        return graphDetails.edgeDefinitions;
    }
    linkEdge(graphName, collectionName, fromId, toId) {
        const graph = this.graph(graphName);
        return graph.create({
            edgeDefinitions: [{
                    collection: collectionName,
                    from: fromId,
                    to: toId
                }]
        });
    }
    hasUser(userName) {
        const user = this.user(userName);
        return user.hasUser();
    }
    createUser(userName, email, passwd = "", active = true, extra = {}) {
        const user = this.user(userName, email);
        return user.createUser(passwd, active, extra);
    }
    deleteUser(userName) {
        const user = this.user(userName);
        return user.deleteUser();
    }
    getUsers() {
        return this.getAllUsers();
    }
    getUser(userName) {
        const user = this.user(userName);
        return user.getUserDeatils();
    }
    updateUser(userName, data) {
        const user = this.user(userName);
        return user.modifyUser(data);
    }
    replaceUser(userName, data) {
        const user = this.user(userName);
        return user.replaceUser(data);
    }
    getPermissions(userName, isFullRequested) {
        const user = this.user(userName);
        return user.getAllDatabases(isFullRequested);
    }
    getPermission(userName, databaseName, collectionName) {
        const user = this.user(userName);
        if (!!collectionName) {
            return user.getCollectionAccessLevel(databaseName, collectionName);
        }
        return user.getDatabaseAccessLevel(databaseName);
    }
    updatePermission(userName, fabricName, permission, collectionName) {
        const user = this.user(userName);
        if (!!collectionName) {
            return user.setCollectionAccessLevel(fabricName, collectionName, permission);
        }
        return user.setDatabaseAccessLevel(fabricName, permission);
    }
    resetPermission(userName, fabricName, collectionName) {
        const user = this.user(userName);
        if (!!collectionName) {
            return user.clearCollectionAccessLevel(fabricName, collectionName);
        }
        return user.clearDatabaseAccessLevel(fabricName);
    }
    //--------------- Key Value ---------------
    keyValue(collectionName) {
        return new keyValue_1.KeyValue(this._connection, collectionName);
    }
    getKVCollections() {
        const keyValueColl = this.keyValue('');
        return keyValueColl.getCollections();
    }
    getKVCount(collectionName) {
        const keyValueColl = this.keyValue(collectionName);
        return keyValueColl.getKVCount();
    }
    getKVKeys(collectionName, opts) {
        const keyValueColl = this.keyValue(collectionName);
        return keyValueColl.getKVKeys(opts);
    }
    getValueForKey(collectionName, key) {
        const keyValueColl = this.keyValue(collectionName);
        return keyValueColl.getValueForKey(key);
    }
    createKVCollection(collectionName, expiration) {
        const keyValueColl = this.keyValue(collectionName);
        return keyValueColl.createCollection(expiration);
    }
    insertKVPairs(collectionName, keyValuePairs) {
        const keyValueColl = this.keyValue(collectionName);
        return keyValueColl.insertKVPairs(keyValuePairs);
    }
    deleteEntryForKey(collectionName, key) {
        const keyValueColl = this.keyValue(collectionName);
        return keyValueColl.deleteEntryForKey(key);
    }
    deleteEntryForKeys(collectionName, keys) {
        const keyValueColl = this.keyValue(collectionName);
        return keyValueColl.deleteEntryForKeys(keys);
    }
    deleteKVCollection(collectionName) {
        const keyValueColl = this.keyValue(collectionName);
        return keyValueColl.deleteCollection();
    }
    //--------------- Api keys ---------------
    apiKeys(keyid = '', dbName = '') {
        return new apiKeys_1.ApiKeys(this._connection, keyid, dbName);
    }
    validateApiKey(data) {
        const apiKeys = this.apiKeys();
        return apiKeys.validateApiKey(data);
    }
    createApiKey(keyid) {
        const apiKeys = this.apiKeys(keyid);
        return apiKeys.createApiKey();
    }
    getAvailableApiKeys() {
        const apiKeys = this.apiKeys();
        return apiKeys.getAvailableApiKeys();
    }
    getAvailableApiKey(keyid) {
        const apiKeys = this.apiKeys(keyid);
        return apiKeys.getAvailableApiKey();
    }
    removeApiKey(keyid) {
        const apiKeys = this.apiKeys(keyid);
        return apiKeys.removeApiKey();
    }
    // ----------------------------------
    listAccessibleDatabases(keyid, full) {
        const apiKeys = this.apiKeys(keyid);
        return apiKeys.listAccessibleDatabases(full);
    }
    getDatabaseAccessLevel(keyid, dbName) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.getDatabaseAccessLevel();
    }
    clearDatabaseAccessLevel(keyid, dbName) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.clearDatabaseAccessLevel();
    }
    setDatabaseAccessLevel(keyid, dbName, permission) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.setDatabaseAccessLevel(permission);
    }
    // ----------------------------------
    listAccessibleCollections(keyid, dbName, full) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.listAccessibleCollections(full);
    }
    getCollectionAccessLevel(keyid, dbName, collectionName) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.getCollectionAccessLevel(collectionName);
    }
    clearCollectionAccessLevel(keyid, dbName, collectionName) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.clearCollectionAccessLevel(collectionName);
    }
    setCollectionAccessLevel(keyid, dbName, collectionName, permission) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.setCollectionAccessLevel(collectionName, permission);
    }
    // ----------------------------------
    listAccessibleStreams(keyid, dbName, full) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.listAccessibleStreams(full);
    }
    getStreamAccessLevel(keyid, dbName, streamName) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.getStreamAccessLevel(streamName);
    }
    clearStreamAccessLevel(keyid, dbName, streamName) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.clearStreamAccessLevel(streamName);
    }
    setStreamAccessLevel(keyid, dbName, streamName, permission) {
        const apiKeys = this.apiKeys(keyid, dbName);
        return apiKeys.setStreamAccessLevel(streamName, permission);
    }
    // ----------------------------------
    getBillingAccessLevel(keyid) {
        const apiKeys = this.apiKeys(keyid);
        return apiKeys.getBillingAccessLevel();
    }
    clearBillingAccessLevel(keyid) {
        const apiKeys = this.apiKeys(keyid);
        return apiKeys.clearBillingAccessLevel();
    }
    setBillingAccessLevel(keyid, permission) {
        const apiKeys = this.apiKeys(keyid);
        return apiKeys.setBillingAccessLevel(permission);
    }
}
exports.C8Client = C8Client;
//# sourceMappingURL=client.js.map