import * as _ from "lodash";
import {captureStackTrace} from "./utils";

const INCIDENT_NAME: string = "Incident";

export interface IncidentConstructorOptions {
  stack?: string;
  name?: string;
  message?: string;
  formater?: any;
  cause?: Error;
  data?: {[key: string]: any};
}

let dummyError = new Error();

export class Incident extends Error {
  stack: string;
  name: string;
  message: string;
  cause: Error;
  data: {[key: string]: any};

  Incident: Object; // reference to the root Incident class for compatibility between various Incident definitions.

  static cast (obj: Incident|Error|any): Incident {
    if (obj instanceof Incident) {
      return obj;
    } else if (obj instanceof Error) {
      return new Incident(obj.name, obj.message);
    } else {
      return new Incident();
    }
  }

  constructor();
  constructor(simpleError: Error);
  constructor(message: string);
  constructor(cause: Error, message: string);
  constructor(name: string, message: string);
  constructor(cause: Error, name: string, message: string);
  constructor(name: string, data: {[key: string]: any}, message: string);
  constructor(cause: Error, name: string, data: {[key: string]: any}, message: string);

  constructor(...args: any[]) {
    let options: IncidentConstructorOptions = {};
    let i = 0, l = args.length;

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

    this.setMessage(options.message || "");
    this.setCause(options.cause || null);

    let name: string;
    if (options.name) {
      name = options.name;
    } else if (this.constructor && (<{name?: string}> <any> this.constructor).name) {
      name = (<{name: string}> <any> this.constructor).name;
    } else {
      name = INCIDENT_NAME;
    }

    this.setName(name);
    this.setData(options.data || {});

    captureStackTrace(this, this.constructor);

    // this.setStack('');
  }

  setCause(cause: Error): Incident {
    if (cause instanceof Error) {
      this.cause = cause;
    } else {
      if (cause !== null) {
        console.warn("Incident expects cause to be an Error or array of Errors");
      }
      this.cause = null;
    }
    return this;
  }

  setName(name: string): Incident {
    this.name = name;
    return this;
  }

  setData(data: {[key: string]: any}): Incident {
    this.data = data;
    return this;
  }

  setMessage(message: string): Incident {
    this.message = message;
    return this;
  }

  setStack(message: string): Incident {
    this.stack = message;
    return this;
  }

  toString() {
    return dummyError.toString.apply(this, arguments);
  }
}

Incident.prototype.Incident = Incident;

export default Incident;