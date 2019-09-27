import { Connection } from "./connection";
export declare class Pipeline {
    _connection: Connection;
    name: string;
    constructor(connection: Connection, pipelineName: string);
    create(regions: Array<string>, enabled?: boolean, config?: object): Promise<any>;
    drop(): Promise<any>;
    details(): Promise<any>;
    update(regions: Array<string>, enabled?: boolean, config?: object): Promise<any>;
}
//# sourceMappingURL=pipeline.d.ts.map