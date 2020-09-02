import { Connection } from "./connection";
export declare type KVPairHandle = {
    _key?: string;
    value: any;
    expireAt: number;
};
export declare class KeyValue {
    private _connection;
    name: string;
    constructor(connection: Connection, name: string);
    getCollections(): Promise<any>;
    getKVCount(): Promise<any>;
    getKVKeys(opts?: any): Promise<any>;
    getValueForKey(key: string): Promise<any>;
    createCollection(expiration?: boolean): Promise<any>;
    deleteCollection(): Promise<any>;
    deleteEntryForKey(key: string): Promise<any>;
    deleteEntryForKeys(keys: string[]): Promise<any>;
    insertKVPairs(keyValuePairs: KVPairHandle[]): Promise<any>;
}
//# sourceMappingURL=keyValue.d.ts.map