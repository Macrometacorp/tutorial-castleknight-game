"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tenant {
    constructor(connection, email, tenantName) {
        this._connection = connection;
        this.name = tenantName;
        this.email = email;
    }
    createTenant(passwd, dcList, extra = {}) {
        return this._connection.request({
            method: "POST",
            path: "/tenant",
            absolutePath: true,
            body: {
                dcList: Array.isArray(dcList) ? dcList.join(',') : dcList,
                email: this.email,
                passwd,
                extra
            }
        }, res => {
            this.name = res.body.tenant;
            return res.body;
        });
    }
    dropTenant() {
        return this._connection.request({
            method: "DELETE",
            path: `/tenant/${this.name}`,
            absolutePath: true
        }, res => res.body);
    }
    getTenantEdgeLocations() {
        return this._connection.request({
            method: "GET",
            path: `/datacenter/_tenant/${this.name}`,
            absolutePath: true
        }, res => res.body);
    }
    tenantDetails() {
        return this._connection.request({
            method: "GET",
            path: `/tenant/${this.name}`,
            absolutePath: true
        }, res => res.body);
    }
    modifyTenant(passwd, extra) {
        return this._connection.request({
            method: "PATCH",
            path: `/tenant/${this.name}`,
            absolutePath: true,
            body: {
                extra,
                passwd
            }
        }, res => res.body);
    }
}
exports.Tenant = Tenant;
//# sourceMappingURL=tenant.js.map