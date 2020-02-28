"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Streamapps {
    constructor(connection, appName) {
        this._connection = connection;
        this.name = appName;
    }
    retriveApplication() {
        return this._connection.request({
            method: "GET",
            path: `/_api/streamapps/${this.name}`,
        }, res => res.body);
    }
    updateApplication(regions, appDefinition) {
        return this._connection.request({
            method: "PUT",
            path: `/_api/streamapps/${this.name}`,
            body: JSON.stringify({
                "definition": appDefinition,
                "regions": regions,
            })
        }, res => res.body);
    }
    deleteApplication() {
        return this._connection.request({
            method: "DELETE",
            path: `/_api/streamapps/${this.name}`,
        }, res => res.body);
    }
    activateStreamApplication(active) {
        return this._connection.request({
            method: "PATCH",
            path: `/_api/streamapps/${this.name}/active?active=${active}`,
        }, res => res.body);
    }
    query(appName, query) {
        return this._connection.request({
            method: "POST",
            path: `/_api/streamapps/query/${appName}`,
            body: {
                "query": query,
            }
        }, res => res.body);
    }
}
exports.Streamapps = Streamapps;
//# sourceMappingURL=streamapps.js.map