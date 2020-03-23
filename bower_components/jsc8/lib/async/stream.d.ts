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
    local: boolean;
    isCollectionStream: boolean;
    topic: string;
    private _producer;
    private _noopProducer;
    private _consumers;
    private _setIntervalId?;
    private _producerIntervalId?;
    constructor(connection: Connection, name: string, local?: boolean, isCollectionStream?: boolean);
    _getPath(useName: boolean, urlSuffix?: string): string;
    createStream(): Promise<any>;
    expireMessagesOnAllSubscriptions(expireTimeInSeconds: number): Promise<any>;
    backlog(): Promise<any>;
    getStreamStatistics(): Promise<any>;
    deleteSubscription(subscription: string): Promise<any>;
    resetSubscriptionToPosition(subscription: string): Promise<any>;
    expireMessages(subscription: string, expireTimeInSeconds: number): Promise<any>;
    resetCursor(subscription: string): Promise<any>;
    resetSubscriptionToTimestamp(subscription: string, timestamp: number): Promise<any>;
    skipNumberOfMessages(subscription: string, numMessages: number): Promise<any>;
    skipAllMessages(subscription: string): Promise<any>;
    getSubscriptionList(): Promise<any>;
    terminateStream(): Promise<any>;
    consumer(subscriptionName: string, callbackObj: wsCallbackObj, dcName: string, params?: {
        [key: string]: any;
    }): any;
    private noopProducer;
    producer(message: string | Array<string>, dcName?: string, callbackObj?: wsCallbackObj): void;
    closeConnections(): void;
}
//# sourceMappingURL=stream.d.ts.map