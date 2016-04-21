export interface IncidentConstructorOptions {
    stack?: string;
    name?: string;
    message?: string;
    formater?: any;
    cause?: Error;
    data?: {
        [key: string]: any;
    };
}
export declare class Incident extends Error {
    stack: string;
    name: string;
    message: string;
    cause: Error;
    data: {
        [key: string]: any;
    };
    Incident: Object;
    static cast(obj: Incident | Error | any): Incident;
    constructor();
    constructor(simpleError: Error);
    constructor(message: string);
    constructor(cause: Error, message: string);
    constructor(name: string, message: string);
    constructor(cause: Error, name: string, message: string);
    constructor(name: string, data: {
        [key: string]: any;
    }, message: string);
    constructor(data: {
        [key: string]: any;
    }, message: string);
    constructor(cause: Error, name: string, data: {
        [key: string]: any;
    }, message: string);
    setCause(cause: Error): Incident;
    setName(name: string): Incident;
    setData(data: {
        [key: string]: any;
    }): Incident;
    setMessage(message: string): Incident;
    setStack(message: string): Incident;
    toString(): any;
}
export default Incident;
