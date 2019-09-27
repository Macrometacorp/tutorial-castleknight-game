import { Connection } from "./connection";
export declare const enum Status {
    OK = "OK",
    WARN = "WARN",
    ERROR = "ERROR"
}
export declare const enum EntityType {
    COLLECTION = "COLLECTION",
    GRAPH = "GRAPH",
    PIPELINE = "PIPELINE",
    AUTH = "AUTH",
    STREAM = "STREAM",
    GEOFABRIC = "GEOFABRIC"
}
export declare const enum ActionType {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    EXECUTE = "EXECUTE",
    LOGIN = "LOGIN"
}
export interface IEventCreateRequest {
    status: Status;
    description: string;
    entityType: EntityType;
    details: string;
    action: ActionType;
    attributes: object;
}
export declare class Event {
    _connection: Connection;
    entityName: string;
    eventId?: number;
    constructor(connection: Connection, entityName: string, eventId?: number);
    create(requestObject: IEventCreateRequest): Promise<any>;
    details(): Promise<any>;
}
//# sourceMappingURL=event.d.ts.map