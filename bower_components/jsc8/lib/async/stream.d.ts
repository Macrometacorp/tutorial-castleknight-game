import { Connection } from "./connection";
export declare enum StreamConstants {
    PERSISTENT = "persistent"
}
export declare type wsCallbackObj = {
    onopen?: () => void;
    onclose?: () => void;
    onerror?: (e: Error) => void;
    onmessage: (msg: string) => Promise<boolean> | boolean | void;
};
export declare class Stream {
    private _connection;
    name: string;
    global: boolean;
    isCollectionStream: boolean;
    topic: string;
    constructor(connection: Connection, name: string, local?: boolean, isCollectionStream?: boolean);
    _getPath(useName: boolean, urlSuffix?: string): string;
    getOtp(): Promise<any>;
    createStream(): Promise<any>;
    backlog(): Promise<any>;
    clearBacklog(): Promise<any>;
    getStreamStatistics(): Promise<any>;
    deleteSubscription(subscription: string): Promise<any>;
    expireMessages(expireTimeInSeconds: number): Promise<any>;
    clearSubscriptionBacklog(subscription: string): Promise<any>;
    getSubscriptionList(): Promise<any>;
    deleteStream(force?: boolean): Promise<any>;
    consumer(subscriptionName: string, dcName: string, params?: {
        [key: string]: any;
    }): any;
    producer(dcName: string, params?: {
        [key: string]: any;
    }): any;
    publishMessage(message: any): Promise<any>;
    getMessageTtl(): Promise<any>;
    setMessageTtl(ttl?: number): Promise<any>;
    deleteSubscriptions(subscription: string): Promise<any>;
}
//# sourceMappingURL=stream.d.ts.map