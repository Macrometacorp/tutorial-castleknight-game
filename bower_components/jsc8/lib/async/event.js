"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status["OK"] = "OK";
    Status["WARN"] = "WARN";
    Status["ERROR"] = "ERROR";
})(Status = exports.Status || (exports.Status = {}));
var EntityType;
(function (EntityType) {
    EntityType["COLLECTION"] = "COLLECTION";
    EntityType["GRAPH"] = "GRAPH";
    EntityType["AUTH"] = "AUTH";
    EntityType["STREAM"] = "STREAM";
    EntityType["GEOFABRIC"] = "GEOFABRIC";
})(EntityType = exports.EntityType || (exports.EntityType = {}));
var ActionType;
(function (ActionType) {
    ActionType["CREATE"] = "CREATE";
    ActionType["UPDATE"] = "UPDATE";
    ActionType["DELETE"] = "DELETE";
    ActionType["EXECUTE"] = "EXECUTE";
    ActionType["LOGIN"] = "LOGIN";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
class Event {
    constructor(connection, entityName, eventId) {
        this._connection = connection;
        this.entityName = entityName;
        this.eventId = eventId;
    }
    create(requestObject) {
        const { status, description, entityType, details, action, attributes } = requestObject;
        return this._connection.request({
            method: "POST",
            path: "/events",
            body: {
                status,
                description,
                entityName: this.entityName,
                entityType,
                details,
                action,
                attributes,
            }
        }, res => {
            this.eventId = res.body._key;
            return res.body;
        });
    }
    details() {
        if (!this.eventId) {
            throw new Error("Event ID is not set. Either provide while creating the handler or create a new event.");
        }
        return this._connection.request({
            method: "GET",
            path: `/events/${this.eventId}`,
        }, res => res.body);
    }
}
exports.Event = Event;
//# sourceMappingURL=event.js.map