import { Connection } from "./connection";
export declare const USER_NOT_FOUND = 1703;
declare class User {
    _connection: Connection;
    user: string;
    email: string;
    urlPrefix: string;
    constructor(connection: Connection, user: string, email?: string);
    createUser(passwd?: string, active?: boolean, extra?: object): Promise<any>;
    getUserDeatils(): Promise<any>;
    hasUser(): Promise<boolean>;
    deleteUser(): Promise<any>;
    _makeModification(config: {
        active?: boolean;
        passwd?: string;
        extra?: object;
    }, methodType: string): Promise<any>;
    modifyUser(config: {
        active?: boolean;
        passwd?: string;
        extra?: object;
    }): Promise<any>;
    replaceUser(config: {
        active?: boolean;
        passwd: string;
        extra?: object;
    }): Promise<any>;
    getAllDatabases(isFullRequested?: boolean): Promise<any>;
    getDatabaseAccessLevel(databaseName: string): Promise<any>;
    clearDatabaseAccessLevel(fabricName: string): Promise<any>;
    setDatabaseAccessLevel(fabricName: string, permission: "rw" | "ro" | "none"): Promise<any>;
    getCollectionAccessLevel(databaseName: string, collectionName: string): Promise<any>;
    clearCollectionAccessLevel(fabricName: string, collectionName: string): Promise<any>;
    setCollectionAccessLevel(fabricName: string, collectionName: string, permission: "rw" | "ro" | "none"): Promise<any>;
    listAvailableUsers(): Promise<any>;
    getStreamAccessLevel(databaseName: string, streamName: string): Promise<any>;
    clearStreamAccessLevel(databaseName: string, streamName: string): Promise<any>;
    setStreamAccessLevel(databaseName: string, streamName: string, permission: "rw" | "ro" | "none"): Promise<any>;
    listAccessibleCollections(databaseName: string, isFullRequested?: boolean): Promise<any>;
    listAccessibleStreams(databaseName: string, isFullRequested?: boolean): Promise<any>;
    getBillingAccessLevel(): Promise<any>;
    clearBillingAccessLevel(): Promise<any>;
    setBillingAccessLevel(permission: "rw" | "ro" | "none"): Promise<any>;
}
export default User;
//# sourceMappingURL=user.d.ts.map