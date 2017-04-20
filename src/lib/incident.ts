/**
 * Define a hidden property
 *
 * @param obj
 * @param propertyName
 * @param value
 */
function defineHiddenProperty(obj: {}, propertyName: string, value: any) {
  Object.defineProperty(obj, propertyName, {
    value: value,
    configurable: true,
    enumerable: false,
    writable: true
  });
}

/**
 * Define a simple property
 *
 * @param obj
 * @param propertyName
 * @param value
 */
function defineSimpleProperty(obj: {}, propertyName: string, value: any) {
  Object.defineProperty(obj, propertyName, {
    value: value,
    configurable: true,
    enumerable: true,
    writable: true
  });
}

/**
 * Used to stringify Incident errors.
 */
const dummyError: Error = new Error();

/**
 * A symbol used internally to not capture the stack.
 */
const noStackSymbol: Object = {};

export interface InterfaceAttributes<Name extends string, Data extends {}, Cause extends (Error | undefined)> {
  message: string;
  name: Name;
  data: Data;
  cause: Cause;
  stack: string;
}

export interface Interface<Name extends string, Data extends {}, Cause extends (Error | undefined)>
  extends Error, InterfaceAttributes<Name, Data, Cause> {
  name: Name;
  stack: string;

  toString(): string;
}

interface PrivateInterface<N extends string, D extends {}, C extends (Error | undefined)> extends Interface<N, D, C> {
  _message: string | ((data: D) => string);
  _stack?: string;
  _stackContainer?: Error;
}

export interface StaticInterface extends Function {
  new(): Interface<"Incident", {}, undefined>;
  new(message: string): Interface<"Incident", {}, undefined>;
  new<N extends string>(name: N, message: string): Interface<N, {}, undefined>;
  new<N extends string>(name: N, lazyMessage: ((data: {}) => string)): Interface<N, {}, undefined>;
  new<N extends string, D extends {}>(name: N, data: D, message: string): Interface<N, D, undefined>;
  new<N extends string, D extends {}>(name: N, data: D, lazyMessage: ((data: D) => string)): Interface<N, D, undefined>;
  new(lazyMessage: ((data: {}) => string)): Interface<"Incident", {}, undefined>;
  new<C extends Error>(cause: C): Interface<"Incident", {}, C>;
  new<C extends Error>(cause: C, message: string): Interface<"Incident", {}, C>;
  new<C extends Error>(cause: C, lazyMessage: ((data: {}) => string)): Interface<"Incident", {}, C>;
  new<D extends {}>(data: D, message: string): Interface<"Incident", D, undefined>;
  new<D extends {}>(data: D, lazyMessage: ((data: D) => string)): Interface<"Incident", D, undefined>;
  new<N extends string, C extends Error>(cause: C, name: N, message: string): Interface<N, {}, C>;
  new<N extends string, C extends Error>(cause: C, name: N, lazyMessage: ((data: {}) => string)): Interface<N, {}, C>;
  new<N extends string, D extends {}, C extends Error>(cause: C, name: N, data: D, message: string): Interface<N, D, C>;
  new<N extends string, D extends {}, C extends Error> (
    cause: C,
    name: N,
    data: D,
    lazyMessage: ((data: D) => string)
  ): Interface<N, D, C>;
}

export interface IncidentConstructorOptions<D> {
  name?: string;
  message?: string | ((data: D) => string);
  cause?: Error;
  data?: D;
}

// Incident factory, allows a fine control over the getter / setters
// and will eventually to have TypeError, SyntaxError, etc. as super classes.
function createIncident(_super: Function): StaticInterface {

  Object.setPrototypeOf(Incident, _super);

  function __(this: typeof __): void {
    this.constructor = Incident;
  }

  __.prototype = _super.prototype;
  Incident.prototype = new (<any> __)();

  function Incident<N extends string, D extends {}, C extends (Error | undefined)>(
    this: PrivateInterface<N, D, C>,
    ...args: any[]
  ): Incident<N, D, C> | void {
    if (!(this instanceof Incident)) {
      switch (args.length) {
        case 0:
          return new (<any> Incident)(noStackSymbol);
        case 1:
          return new (<any> Incident)(noStackSymbol, args[0]);
        case 2:
          return new (<any> Incident)(noStackSymbol, args[0], args[1]);
        case 3:
          return new (<any> Incident)(noStackSymbol, args[0], args[1], args[2]);
        default:
          return new (<any> Incident)(noStackSymbol, args[0], args[1], args[2], args[3]);
      }
    }

    let name: N = "Incident" as N;
    let data: D = {} as D;
    let cause: C | undefined = undefined;
    let message: string | ((data: D) => string) = "";

    const options: IncidentConstructorOptions<D> = {};
    let argsLen: number = args.length;
    const noStack: boolean = argsLen > 0 && args[0] === noStackSymbol;
    let argIndex: number = noStack ? 1 : 0;

    if (argsLen > 0) {
      message = args[--argsLen];
    }
    if (argIndex < argsLen && args[argIndex] instanceof Error) {
      cause = args[argIndex++];
    }
    if (argIndex < argsLen && typeof args[argIndex] === "string") {
      name = args[argIndex++];
    }
    if (argIndex < argsLen && typeof args[argIndex] === "object") {
      data = args[argIndex++];
    }

    _super.call(this, typeof message === "function" ? "<lazyMessage was not evaluated>" : message);

    this.name = name;
    defineHiddenProperty(this, "_message", message);
    this.data = data;
    if (cause !== undefined) {
      this.cause = cause;
    }
    defineHiddenProperty(this, "_stack", undefined);
    defineHiddenProperty(this, "_stackContainer", noStack ? undefined : new Error());
  }

  Incident.prototype.Incident = Incident;

  Incident.prototype.toString = function (this: PrivateInterface<string, {}, Error | undefined>): string {
    return dummyError.toString.apply(this, arguments);
  };

  function getMessage(this: PrivateInterface<string, {}, Error | undefined>): string {
    if (typeof this._message === "function") {
      this._message = this._message(this.data);
    }
    defineSimpleProperty(this, "message", this._message);
    return this._message;
  }

  function setMessage<D extends {}>(
    this: PrivateInterface<string, D, Error | undefined>,
    message: string | ((data: D) => string)
  ): void {
    this._message = message;
  }

  function getStack(this: PrivateInterface<string, {}, Error | undefined>): string {
    if (this._stack === undefined) {
      if (this._stackContainer !== undefined && this._stackContainer.stack !== undefined) {
        // Remove "Error\n    at new Incident..."
        const stack: string = this._stackContainer.stack.replace(/^[^\n]+\n[^\n]+\n/, "");
        this._stack = `${this.name}: ${this._message}\n${stack}`;
      } else {
        this._stack = `${this.name}: ${this._message}`;
      }
      if (this.cause !== undefined && this.cause.stack !== undefined) {
        this._stack = `${this._stack}\n  caused by ${this.cause.stack}`;
      }
    }
    Object.defineProperty(this, "message", {
      configurable: true,
      value: this._stack,
      writable: true
    });
    return this._stack;
  }

  function setStack(this: PrivateInterface<string, {}, Error | undefined>, stack: string): void {
    this._stackContainer = undefined;
    this._stack = stack;
  }

  Object.defineProperty(Incident.prototype, "message", {
    get: getMessage,
    set: setMessage,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(Incident.prototype, "stack", {
    get: getStack,
    set: setStack,
    enumerable: true,
    configurable: true
  });

  return Incident as any;
}

/* tslint:disable-next-line:variable-name */
export const Incident: StaticInterface = createIncident(Error);
export interface Incident<Name extends string, Data extends {}, Cause extends (Error | undefined)>
  extends Interface<Name, Data, Cause> {
}

export default Incident;
