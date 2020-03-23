import { Connection } from "./connection";
export declare class Streamapps {
    _connection: Connection;
    name: string;
    constructor(connection: Connection, appName: string);
    retriveApplication(): Promise<any>;
    updateApplication(regions: Array<string>, appDefinition: string): Promise<any>;
    deleteApplication(): Promise<any>;
    activateStreamApplication(active: boolean): Promise<any>;
    query(query: string): Promise<any>;
}
//# sourceMappingURL=streamapps.d.ts.map