"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Search {
    constructor(connection, searchOptions) {
        this.viewUrlPrefix = "/_api/search/view";
        this.analyzerUrlPrefix = "/_api/search/analyzer";
        this._connection = connection;
        this._viewName = (searchOptions && searchOptions.viewName) || "";
        this._analyzerName = (searchOptions && searchOptions.analyzerName) || "";
    }
    setSearch(collectionName, enable, field) {
        return this._connection.request({
            method: "POST",
            path: `/_api/search/collection/${collectionName}`,
            qs: {
                enable,
                field
            },
            absolutePath: true,
            body: {}
        }, res => res.body);
    }
    searchInCollection(collection, search, bindVars = {}, ttl = 60) {
        return this._connection.request({
            method: "POST",
            path: "/_api/search",
            body: {
                collection,
                search,
                bindVars,
                ttl
            },
            absolutePath: true
        }, res => res.body);
    }
    getListOfViews() {
        return this._connection.request({
            method: "GET",
            path: `${this.viewUrlPrefix}`,
            absolutePath: true
        }, res => res.body);
    }
    createView(properties = {}) {
        return this._connection.request({
            method: "POST",
            path: `${this.viewUrlPrefix}`,
            body: {
                type: "search",
                name: this._viewName,
                properties
            },
            absolutePath: true
        }, res => res.body);
    }
    getViewInfo() {
        return this._connection.request({
            method: "GET",
            path: `${this.viewUrlPrefix}/${this._viewName}`,
            absolutePath: true
        }, res => res.body);
    }
    renameView(name) {
        return this._connection.request({
            method: "PUT",
            path: `${this.viewUrlPrefix}/${this._viewName}/rename`,
            absolutePath: true,
            body: {
                name
            }
        }, res => res.body);
    }
    deleteView() {
        return this._connection.request({
            method: "DELETE",
            path: `${this.viewUrlPrefix}/${this._viewName}`,
            absolutePath: true
        }, res => res.body);
    }
    getViewProperties() {
        return this._connection.request({
            method: "GET",
            path: `${this.viewUrlPrefix}/${this._viewName}/properties`,
            absolutePath: true
        }, res => res.body);
    }
    updateViewProperties(properties) {
        return this._connection.request({
            method: "PUT",
            path: `${this.viewUrlPrefix}/${this._viewName}/properties`,
            absolutePath: true,
            body: properties
        }, res => res.body);
    }
    getListOfAnalyzers() {
        return this._connection.request({
            method: "GET",
            path: `${this.analyzerUrlPrefix}`,
            absolutePath: true
        }, res => res.body);
    }
    createAnalyzer(type, properties, features) {
        return this._connection.request({
            method: "POST",
            path: `${this.analyzerUrlPrefix}`,
            body: {
                name: this._analyzerName,
                type,
                features,
                properties
            },
            absolutePath: true
        }, res => res.body);
    }
    getAnalyzerDefinition() {
        return this._connection.request({
            method: "GET",
            path: `${this.analyzerUrlPrefix}/${this._analyzerName}`,
            absolutePath: true
        }, res => res.body);
    }
    deleteAnalyzer(force = false) {
        return this._connection.request({
            method: "DELETE",
            path: `${this.analyzerUrlPrefix}/${this._analyzerName}`,
            qs: {
                force
            },
            absolutePath: true
        }, res => res.body);
    }
}
exports.Search = Search;
//# sourceMappingURL=search.js.map