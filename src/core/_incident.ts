import * as _ from 'lodash';
import {captureStackTrace} from './utils';

export interface IncidentConstructorOptions {
    stack?:string;
    name?:string;
    message?:string;
    formater?:any;
    cause?:Error;
    data?:{[key:string]: any};
}

export class Incident extends Error {
    static name = 'Incident';

    stack:string;
    name:string;
    message:string;
    cause:Error;
    data:{[key:string]: any};

    Incident:Object; // reference to the root Incident class for compatibility between various Incident definitions.

    constructor();
    constructor(simpleError:Error);
    constructor(message:string);
    constructor(cause:Error, message:string);
    constructor(name:string, message:string);
    constructor(cause:Error, name:string, message:string);
    constructor(name:string, data:{[key:string]: any}, message:string);
    constructor(cause:Error, name:string, data:{[key:string]: any}, message:string);

    constructor(...args:any[]) {
        var options:IncidentConstructorOptions = {};
        var i = 0, l = args.length;

        if (l > 0) {
            options.message = args[--l];
        }
        if (i < l && args[i] instanceof Error) {
            options.cause = args[i++];
        }
        if (i < l && _.isString(args[i])) {
            options.name = args[i++];
        }
        if (i < l && _.isObject(args[i])) {
            options.data = args[i++];
        }

        super(options.message);

        this.setMessage(options.message || '');
        this.setCause(options.cause || null);
        this.setName(options.name || Incident.name);
        this.setData(options.data || {});

        captureStackTrace(this, this.constructor);

        // this.setStack('');
    }

    setCause(cause:Error):Incident {
        if (cause instanceof Error) {
            this.cause = cause;
        } else {
            console.warn("Incident expects cause to be an Error or array of Errors");
            this.cause = null;
        }
        return this;
    }

    setName(name:string):Incident {
        this.name = name;
        return this;
    }

    setData(data:{[key:string]: any}):Incident {
        this.data = data;
        return this;
    }

    setMessage(message:string):Incident {
        this.message = message;
        return this;
    }

    setStack(message:string):Incident {
        this.stack = message;
        return this;
    }

    toString() {
        return Error.toString.apply(this, arguments);
    }


    static cast = function (obj:Incident|Error|any):Incident {
        if (obj instanceof Incident) {
            return obj;
        } else if (obj instanceof Error) {
            return new Incident(obj.name, obj.message);
        } else {
            return new Incident();
        }
    }
}

Incident.prototype.Incident = Incident;

export default Incident;
