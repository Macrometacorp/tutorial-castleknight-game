import { Connection } from "./connection";
export declare type validateApiKeyHandle = {
    apikey?: string;
    jwt?: string;
};
export declare class ApiKeys {
    private _connection;
    keyid: string;
    dbName: string;
    constructor(connection: Connection, keyid?: string, dbName?: string);
    validateApiKey(data: validateApiKeyHandle): Promise<any>;
    createApiKey(): Promise<any>;
    getAvailableApiKeys(): Promise<any>;
    getAvailableApiKey(): Promise<any>;
    removeApiKey(): Promise<any>;
    listAccessibleDatabases(full?: boolean): Promise<any>;
    getDatabaseAccessLevel(): Promise<any>;
    clearDatabaseAccessLevel(): Promise<any>;
    setDatabaseAccessLevel(permission: "rw" | "ro" | "none"): Promise<any>;
    listAccessibleCollections(full?: boolean): Promise<any>;
    getCollectionAccessLevel(collectionName: string): Promise<any>;
    clearCollectionAccessLevel(collectionName: string): Promise<any>;
    setCollectionAccessLevel(collectionName: string, permission: "rw" | "ro" | "none"): Promise<any>;
    listAccessibleStreams(full?: boolean): Promise<any>;
    getStreamAccessLevel(streamName: string): Promise<any>;
    clearStreamAccessLevel(streamName: string): Promise<any>;
    setStreamAccessLevel(streamName: string, permission: "rw" | "ro" | "none"): Promise<any>;
    getBillingAccessLevel(): Promise<any>;
    clearBillingAccessLevel(): Promise<any>;
    setBillingAccessLevel(permission: "rw" | "ro" | "none"): Promise<any>;
}
//# sourceMappingURL=apiKeys.d.ts.map