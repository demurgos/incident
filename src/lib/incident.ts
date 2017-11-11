import { Incident as Interface, StaticIncident as StaticInterface } from "./types";

/**
 * Define a hidden property
 *
 * @param obj
 * @param propertyName
 * @param value
 */
function defineHiddenProperty(obj: {}, propertyName: string, value: any) {
  Object.defineProperty(obj, propertyName, {
    value,
    configurable: true,
    enumerable: false,
    writable: true,
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
    value,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

/**
 * Used to stringify Incident errors.
 */
const dummyError: Error = new Error();

/**
 * A symbol used internally to prevent the capture of the call stack.
 */
const noStackSymbol: Object = {};

// Incident factory, allows a fine control over the getter / setters
// and will eventually allow to have TypeError, SyntaxError, etc. as super classes.
function createIncident(_super: Function): StaticInterface {

  Object.setPrototypeOf(Incident, _super);

  function __(this: typeof __): void {
    this.constructor = Incident;
  }

  __.prototype = _super.prototype;
  Incident.prototype = new (<any> __)();

  interface PrivateIncident<N extends string, D extends {}, C extends (Error | undefined)> extends Interface<N, D, C> {
    /**
     * `(data: D) => string`: A lazy formatter, called once when needed. Its result replaces `_message`
     * `string`: The resolved error message.
     */
    _message: string | ((data: D) => string);

    /**
     * `undefined`: The stack is not resolved yet, clean the stack when resolving
     * `null`: The stack is not resolved yet, do not clean the stack when resolving
     * `string`: The stack is resolved stack
     */
    _stack?: string | null;

    /**
     * An error containing an untouched stack
     */
    _stackContainer?: {stack?: string};
  }

  function Incident<N extends string, D extends {}, C extends (Error | undefined)>(
    this: PrivateIncident<N, D, C>,
    ...args: any[],
  ): Interface<N, D, C> | void {
    if (!(this instanceof Incident)) {
      switch (args.length) {
        case 0:
          return new (<any> Incident)(noStackSymbol);
        case 1:
          if (args[0] instanceof Error) {
            let converted: PrivateIncident<any, any, any>;
            // tslint:disable-next-line:strict-boolean-expressions
            const name: string = args[0].name || "";
            // tslint:disable-next-line:strict-boolean-expressions
            const message: string = typeof args[0]._message === "function" ? args[0]._message : args[0].message || "";
            if (args[0].cause instanceof Error) {
              if (typeof args[0].data === "object") {
                converted = new (<any> Incident)(noStackSymbol, args[0].cause, name, args[0].data, message);
              } else {
                converted = new (<any> Incident)(noStackSymbol, args[0].cause, name, message);
              }
            } else {
              if (typeof args[0].data === "object") {
                converted = new (<any> Incident)(noStackSymbol, name, args[0].data, message);
              } else {
                converted = new (<any> Incident)(noStackSymbol, name, message);
              }
            }
            if (args[0]._stackContainer !== undefined) {
              converted._stackContainer = args[0]._stackContainer;
            } else if (args[0]._stack === undefined) {
              converted._stackContainer = args[0];
              converted._stack = null; // Use the stack as-is
            } else {
              converted._stack = args[0]._stack;
            }
            return converted;
          }
          return new (<any> Incident)(noStackSymbol, args[0]);
        case 2:
          return new (<any> Incident)(noStackSymbol, args[0], args[1]);
        case 3:
          return new (<any> Incident)(noStackSymbol, args[0], args[1], args[2]);
        default:
          return new (<any> Incident)(noStackSymbol, args[0], args[1], args[2], args[3]);
      }
    }

    let noStack: boolean = false;
    let name: N = "Incident" as N;
    let data: D = {} as D;
    let cause: C | undefined = undefined;
    let message: string | ((data: D) => string) = "";

    let argsLen: number = args.length;
    let argIndex: number = 0;

    if (argsLen > 0 && args[0] === noStackSymbol) {
      noStack = true;
      argIndex++;
    }
    if (argsLen > argIndex && (typeof args[argsLen - 1] === "string" || typeof args[argsLen - 1] === "function")) {
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

    _super.call(this, typeof message === "function" ? "<non-evaluated lazy message>" : message);

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

  Incident.prototype.toString = function (this: PrivateIncident<string, {}, Error | undefined>): string {
    return dummyError.toString.apply(this, arguments);
  };

  function getMessage(this: PrivateIncident<string, {}, Error | undefined>): string {
    if (typeof this._message === "function") {
      this._message = this._message(this.data);
    }
    defineSimpleProperty(this, "message", this._message);
    return this._message;
  }

  function setMessage<D extends {}>(
    this: PrivateIncident<string, D, Error | undefined>,
    message: string | ((data: D) => string),
  ): void {
    this._message = message;
  }

  function getStack(this: PrivateIncident<string, {}, Error | undefined>): string {
    if (this._stack === undefined || this._stack === null) {
      if (this._stackContainer !== undefined && this._stackContainer.stack !== undefined) {
        // This removes the firs lines corresponding to: "Error\n    at new Incident [...]"
        const stack: string = this._stack === null ?
          this._stackContainer.stack :
          this._stackContainer.stack.replace(/^[^\n]+\n[^\n]+\n/, "");
        this._stack = this.message === "" ?
          `${this.name}\n${stack}` :
          `${this.name}: ${this.message}\n${stack}`;
      } else {
        this._stack = this.message === "" ? this.name : `${this.name}: ${this.message}`;
      }
      if (this.cause !== undefined && this.cause.stack !== undefined) {
        this._stack = `${this._stack}\n  caused by ${this.cause.stack}`;
      }
    }
    Object.defineProperty(this, "message", {
      configurable: true,
      value: this._stack,
      writable: true,
    });
    return this._stack;
  }

  function setStack(this: PrivateIncident<string, {}, Error | undefined>, stack: string): void {
    this._stackContainer = undefined;
    this._stack = stack;
  }

  Object.defineProperty(Incident.prototype, "message", {
    get: getMessage,
    set: setMessage,
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(Incident.prototype, "stack", {
    get: getStack,
    set: setStack,
    enumerable: true,
    configurable: true,
  });

  return Incident as any;
}

/* tslint:disable-next-line:variable-name */
export const Incident: StaticInterface = createIncident(Error);

export interface Incident<Name extends string, Data extends {}, Cause extends (Error | undefined)>
  extends Interface<Name, Data, Cause> {
}
