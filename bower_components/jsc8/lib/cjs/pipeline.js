"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pipeline {
    constructor(connection, pipelineName) {
        this._connection = connection;
        this.name = pipelineName;
    }
    create(regions, enabled = true, config = {}) {
        return this._connection.request({
            method: "POST",
            path: "/pipeline",
            body: {
                name: this.name,
                regions,
                enabled,
                config,
            }
        }, res => res.body);
    }
    drop() {
        return this._connection.request({
            method: "DELETE",
            path: `/pipeline/${this.name}`,
        }, res => res.body);
    }
    details() {
        return this._connection.request({
            method: "GET",
            path: `/pipeline/${this.name}`,
        }, res => res.body);
    }
    update(regions, enabled = true, config = {}) {
        return this._connection.request({
            method: "PUT",
            path: `/pipeline/${this.name}`,
            body: {
                name: this.name,
                regions,
                enabled,
                config,
            }
        }, res => res.body);
    }
}
exports.Pipeline = Pipeline;
//# sourceMappingURL=pipeline.js.map