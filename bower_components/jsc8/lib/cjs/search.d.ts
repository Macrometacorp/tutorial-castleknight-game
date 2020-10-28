import { Connection } from "./connection";
export declare type SearchOptions = {
    viewName?: string;
    analyzerName?: string;
};
export declare type Properties = {
    links?: {
        [collectionName: string]: {
            analyzers?: [string];
            fields?: object;
            includeAllFields?: boolean;
            storeValues?: string;
            trackListPositions?: boolean;
        };
    };
};
export declare class Search {
    private _connection;
    _viewName: string;
    _analyzerName: string;
    viewUrlPrefix: string;
    analyzerUrlPrefix: string;
    constructor(connection: Connection, searchOptions?: SearchOptions);
    setSearch(collectionName: string, enable: boolean, field: string): Promise<any>;
    searchInCollection(collection: string, search: string, bindVars?: object, ttl?: number): Promise<any>;
    getListOfViews(): Promise<any>;
    createView(properties?: Properties): Promise<any>;
    getViewInfo(): Promise<any>;
    renameView(name: string): Promise<any>;
    deleteView(): Promise<any>;
    getViewProperties(): Promise<any>;
    updateViewProperties(properties: Properties): Promise<any>;
    getListOfAnalyzers(): Promise<any>;
    createAnalyzer(type: string, properties?: object, features?: Array<string>): Promise<any>;
    getAnalyzerDefinition(): Promise<any>;
    deleteAnalyzer(force?: boolean): Promise<any>;
}
//# sourceMappingURL=search.d.ts.map