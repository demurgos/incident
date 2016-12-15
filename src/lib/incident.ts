/* tslint:disable:no-angle-bracket-type-assertion */

import {captureStackTrace} from "./utils";

const INCIDENT_NAME: string = "Incident";

export interface IncidentConstructorOptions<D> {
  stack?: string;
  name?: string;
  message?: string;
  formater?: any;
  cause?: Error;
  data?: D;
}

/**
 * Used to stringify Incident errors.
 */
const dummyError: Error = new Error();

export class Incident<D extends {}> extends Error {
  stack: string;
  name: string;
  message: string;
  cause: Error | null;
  data: D;

  // reference to the root Incident class for compatibility between duplicated Incident modules
  // tslint:disable:variable-name
  Incident: typeof Incident;

  static cast<D>(obj: Incident<D>): Incident<D>;
  static cast<D extends {}>(obj: Error | any): Incident<D>;

  static cast(obj: any): any {
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
  constructor(name: string, data: D, message: string);
  constructor(data: D, message: string);
  constructor(cause: Error, name: string, data: D, message: string);

  constructor(...args: any[]) {
    const options: IncidentConstructorOptions<D> = {};
    let argIndex: number = 0;
    let argsLen: number = args.length;

    if (argsLen > 0) {
      options.message = args[--argsLen];
    }
    if (argIndex < argsLen && args[argIndex] instanceof Error) {
      options.cause = args[argIndex++];
    }
    if (argIndex < argsLen && typeof args[argIndex] === "string") {
      options.name = args[argIndex++];
    }
    if (argIndex < argsLen && typeof args[argIndex] === "object") {
      options.data = args[argIndex++];
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
    this.setData(options.data || <D> {});

    captureStackTrace(this, this.constructor);
  }

  setCause(cause: Error | null): this {
    if (cause instanceof Error) {
      this.cause = cause;
    } else {
      if (cause !== null) {
        throw new TypeError("`Incident.setCause` expected `cause` to be of type: `Error | null`");
      }
      this.cause = null;
    }
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setData(data: D): this {
    this.data = data;
    return this;
  }

  setMessage(message: string): this {
    this.message = message;
    return this;
  }

  setStack(message: string): this {
    this.stack = message;
    return this;
  }

  toString() {
    return dummyError.toString.apply(this, arguments);
  }
}

Incident.prototype.Incident = Incident;

export default Incident;
