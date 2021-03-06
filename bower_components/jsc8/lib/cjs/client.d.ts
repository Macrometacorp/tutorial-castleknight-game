import { Config } from "./connection";
import { Fabric } from "./fabric";
import { DocumentHandle, DocumentsHandle, DocumentSaveOptions } from "./collection";
import { C8QLLiteral } from "./c8ql-query";
import { KeyValue, KVPairHandle } from "./keyValue";
import { ApiKeys, validateApiKeyHandle } from "./apiKeys";
import { Search, SearchOptions, Properties } from "./search";
export declare class C8Client extends Fabric {
    constructor(config: Config);
    useApiKeyAuth(apikey: string): this;
    loginWithToken(jwt: string): Promise<void>;
    loginWithApiKey(apikey: string): Promise<void>;
    createCollection(collectionName: string, properties?: any, isEdge?: boolean): Promise<any>;
    deleteCollection(collectionName: string, opts?: any): Promise<any>;
    hasCollection(collectionName: string): Promise<boolean>;
    getCollection(collectionName: string): Promise<any>;
    getCollections(excludeSystem?: boolean): Promise<any>;
    onCollectionChange(collectionName: string, dcName: string, subscriptionName: string): Promise<any>;
    getDocument(collectionName: string, documentHandle: DocumentHandle, graceful?: boolean): Promise<any>;
    getDocumentMany(collectionName: string, limit?: number, skip?: number): Promise<any>;
    insertDocument(collectionName: string, data: any, opts?: DocumentSaveOptions | boolean): Promise<any>;
    insertDocumentMany(collectionName: string, data: any, opts?: DocumentSaveOptions | boolean): Promise<any>;
    insertDocumentFromFile(collectionName: string, csvPath: string, opts?: DocumentSaveOptions | boolean): Promise<any>;
    updateDocument(collectionName: string, documentHandle: any, newValue: any, opts?: any): Promise<any>;
    updateDocumentMany(collectionName: string, documentsHandle: DocumentsHandle[], opts?: any): Promise<any>;
    replaceDocument(collectionName: string, documentHandle: any, newValue: any, opts?: any): Promise<any>;
    replaceDocumentMany(collectionName: string, documentsHandle: DocumentsHandle[], opts?: any): Promise<any>;
    deleteDocument(collectionName: string, documentHandle: any, opts?: any): Promise<any>;
    deleteDocumentMany(collectionName: string, documentsHandle: string[] | DocumentsHandle[], opts?: any): Promise<any>;
    listCollectionIndexes(collectionName: string): Promise<any>;
    addHashIndex(collectionName: string, fields: string[] | string, opts?: any): Promise<any>;
    addGeoIndex(collectionName: string, fields: string[] | string, opts?: any): Promise<any>;
    addSkiplistIndex(collectionName: string, fields: string[] | string, opts?: any): Promise<any>;
    addPersistentIndex(collectionName: string, fields: string[] | string, opts?: any): Promise<any>;
    addFullTextIndex(collectionName: string, fields: string[] | string, minLength?: number): Promise<any>;
    addTtlIndex(collectionName: string, fields: string[] | string, expireAfter: number): Promise<any>;
    deleteIndex(collectionName: string, indexName: string): Promise<any>;
    getCollectionIds(collectionName: string): Promise<any>;
    getCollectionKeys(collectionName: string): Promise<any>;
    getCollectionIndexes(collectionName: string): Promise<any>;
    executeQuery(query: string | C8QLLiteral, bindVars?: any, opts?: any): Promise<any>;
    getRunningQueries(): Promise<any>;
    killQuery(queryId: string): Promise<any>;
    createRestql(restqlName: string, value: string, parameter?: any): any;
    executeRestql(restqlName: string, bindVars?: any): Promise<any>;
    updateRestql(restqlName: string, value: string, parameter?: any): Promise<any>;
    deleteRestql(restqlName: string): Promise<any>;
    getRestqls(): Promise<any>;
    getDcList(): Promise<any>;
    getLocalDc(): Promise<any>;
    createStream(streamName: string, local: boolean, isCollectionStream?: boolean): Promise<any>;
    hasStream(streamName: string, local: boolean): Promise<boolean>;
    getStream(streamName: string, local: boolean, isCollectionStream?: boolean): import("./stream").Stream;
    getStreamStats(streamName: string, local: boolean, isCollectionStream?: boolean): Promise<any>;
    createStreamProducer(streamName: string, local: boolean, isCollectionStream: boolean | undefined, dcName: string, params?: {
        [key: string]: any;
    }): Promise<any>;
    createStreamReader(streamName: string, subscriptionName: string, local: boolean, isCollectionStream: boolean | undefined, dcName: string, params?: {
        [key: string]: any;
    }): Promise<any>;
    subscribe(streamName: string, local: boolean, isCollectionStream: boolean | undefined, subscriptionName: string, dcName: string, params?: {
        [key: string]: any;
    }): Promise<any>;
    getStreamBacklog(streamName: string, local: boolean, isCollectionStream?: boolean): Promise<any>;
    clearStreamBacklog(subscription: string): Promise<any>;
    clearStreamsBacklog(): Promise<any>;
    getStreamSubscriptions(streamName: string, local: boolean, isCollectionStream?: boolean): Promise<any>;
    deleteStreamSubscription(streamName: string, subscription: string, local: boolean, isCollectionStream?: boolean): Promise<any>;
    validateStreamApp(appDefinition: string): Promise<any>;
    retrieveStreamApp(): Promise<any>;
    deleteStreamApp(appName: string): Promise<any>;
    getStreamApp(appName: string): Promise<any>;
    getStreamAppSamples(): Promise<any>;
    activateStreamApp(appName: string, active: boolean): Promise<any>;
    createGraph(graphName: string, properties?: any): Promise<any>;
    deleteGraph(graphName: string, dropCollections: boolean): Promise<any>;
    hasGraph(graphName: string): Promise<boolean>;
    getGraph(graphName: string): Promise<any>;
    getGraphs(): Promise<import("./graph").Graph[]>;
    insertEdge(graphName: string, definition: any): Promise<any>;
    updateEdge(graphName: string, collectionName: string, documentHandle: DocumentHandle, newValue: any, opts?: any): Promise<any>;
    replaceEdge(graphName: string, collectionName: string, documentHandle: DocumentHandle, newValue: any, opts?: any): Promise<any>;
    deleteEdge(graphName: string, collectionName: string, documentHandle: DocumentHandle, opts?: any): Promise<any>;
    getEdges(graphName: string): Promise<any>;
    linkEdge(graphName: string, collectionName: string, fromId: string | string[], toId: string | string[]): Promise<any>;
    hasUser(userName: string): Promise<boolean>;
    createUser(userName: string, email: string, passwd?: string, active?: boolean, extra?: object): Promise<any>;
    deleteUser(userName: string): Promise<any>;
    getUsers(): Promise<any>;
    getUser(userName: string): Promise<any>;
    updateUser(userName: string, data: {
        active?: boolean;
        passwd: string;
        extra?: object;
    }): Promise<any>;
    replaceUser(userName: string, data: {
        active?: boolean;
        passwd: string;
        extra?: object;
    }): Promise<any>;
    getPermissions(userName: string, isFullRequested?: boolean): Promise<any>;
    getPermission(userName: string, databaseName: string, collectionName?: string): Promise<any>;
    updatePermission(userName: string, fabricName: string, permission: "rw" | "ro" | "none", collectionName?: string): Promise<any>;
    resetPermission(userName: string, fabricName: string, collectionName?: string): Promise<any>;
    keyValue(collectionName: string): KeyValue;
    getKVCollections(): Promise<any>;
    getKVCount(collectionName: string): Promise<any>;
    getKVKeys(collectionName: string, opts?: any): Promise<any>;
    getValueForKey(collectionName: string, key: string): Promise<any>;
    createKVCollection(collectionName: string, expiration?: boolean): Promise<any>;
    insertKVPairs(collectionName: string, keyValuePairs: KVPairHandle[]): Promise<any>;
    deleteEntryForKey(collectionName: string, key: string): Promise<any>;
    deleteEntryForKeys(collectionName: string, keys: string[]): Promise<any>;
    deleteKVCollection(collectionName: string): Promise<any>;
    apiKeys(keyid?: string, dbName?: string): ApiKeys;
    validateApiKey(data: validateApiKeyHandle): Promise<any>;
    createApiKey(keyid: string): Promise<any>;
    getAvailableApiKeys(): Promise<any>;
    getAvailableApiKey(keyid: string): Promise<any>;
    removeApiKey(keyid: string): Promise<any>;
    listAccessibleDatabases(keyid: string, full?: boolean): Promise<any>;
    getDatabaseAccessLevel(keyid: string, dbName: string): Promise<any>;
    clearDatabaseAccessLevel(keyid: string, dbName: string): Promise<any>;
    setDatabaseAccessLevel(keyid: string, dbName: string, permission: "rw" | "ro" | "none"): Promise<any>;
    listAccessibleCollections(keyid: string, dbName: string, full?: boolean): Promise<any>;
    getCollectionAccessLevel(keyid: string, dbName: string, collectionName: string): Promise<any>;
    clearCollectionAccessLevel(keyid: string, dbName: string, collectionName: string): Promise<any>;
    setCollectionAccessLevel(keyid: string, dbName: string, collectionName: string, permission: "rw" | "ro" | "none"): Promise<any>;
    listAccessibleStreams(keyid: string, dbName: string, full?: boolean): Promise<any>;
    getStreamAccessLevel(keyid: string, dbName: string, streamName: string): Promise<any>;
    clearStreamAccessLevel(keyid: string, dbName: string, streamName: string): Promise<any>;
    setStreamAccessLevel(keyid: string, dbName: string, streamName: string, permission: "rw" | "ro" | "none"): Promise<any>;
    getBillingAccessLevel(keyid: string): Promise<any>;
    clearBillingAccessLevel(keyid: string): Promise<any>;
    setBillingAccessLevel(keyid: string, permission: "rw" | "ro" | "none"): Promise<any>;
    search(searchOptions?: SearchOptions): Search;
    setSearch(collectionName: string, enable: boolean, field: string): Promise<any>;
    searchInCollection(collectionName: string, searchString: string, bindVars?: object, ttl?: number): Promise<any>;
    getListOfViews(): Promise<any>;
    createView(viewName: string, properties?: Properties): Promise<any>;
    getViewInfo(viewName: string): Promise<any>;
    renameView(viewName: string, newName: string): Promise<any>;
    deleteView(viewName: string): Promise<any>;
    getViewProperties(viewName: string): Promise<any>;
    updateViewProperties(viewName: string, properties: Properties): Promise<any>;
    getListOfAnalyzers(): Promise<any>;
    createAnalyzer(analyzerName: string, type: string, properties?: object, features?: Array<string>): Promise<any>;
    deleteAnalyzer(analyzerName: string, force?: boolean): Promise<any>;
    getAnalyzerDefinition(analyzerName: string): Promise<any>;
}
//# sourceMappingURL=client.d.ts.map