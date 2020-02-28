import { Connection } from "./connection";
export declare class Tenant {
    _connection: Connection;
    name?: string;
    email: string;
    constructor(connection: Connection, email: string, tenantName?: string);
    createTenant(passwd: string, dcList: string | string[], extra?: object): Promise<any>;
    dropTenant(): Promise<any>;
    getTenantEdgeLocations(): Promise<any>;
    tenantDetails(): Promise<any>;
    modifyTenant(passwd: string, extra?: object): Promise<any>;
}
//# sourceMappingURL=tenant.d.ts.map