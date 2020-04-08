import objectInspect from "object-inspect";
import { Incident as Interface, StaticIncident as StaticInterface } from "./types";

/**
 * Default message formatter.
 *
 * This uses `object-inspect` to print the `data` object.
 *
 * @param data Data object associated with the error.
 * @return String representation of the data object.
 */
export function format(data: any): string {
  return objectInspect(data, {depth: 30});
}

/**
 * Define a hidden property.
 *
 * @param obj
 * @param propertyName
 * @param value
 */
function defineHiddenProperty(obj: object, propertyName: string, value: any) {
  Object.defineProperty(obj, propertyName, {
    value,
    configurable: true,
    enumerable: false,
    writable: true,
  });
}

/**
 * Define a normal property.
 *
 * @param obj
 * @param propertyName
 * @param value
 */
function defineSimpleProperty(obj: object, propertyName: string, value: any) {
  Object.defineProperty(obj, propertyName, {
    value,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

/**
 * A symbol used internally to prevent the capture of the call stack.
 */
const noStackSymbol: object = {};

// Incident factory, allows a fine control over the getter / setters
// and will eventually allow to have TypeError, SyntaxError, etc. as super classes.
function createIncident(_super: Function): StaticInterface {

  Object.setPrototypeOf(Incident, _super);

  function __(this: typeof __): void {
    this.constructor = Incident;
  }

  __.prototype = _super.prototype;
  Incident.prototype = new (__ as any)();

  // tslint:disable-next-line:max-line-length
  interface PrivateIncident<D extends object, N extends string = string, C extends (Error | undefined) = (Error | undefined)> extends Interface<D, N, C> {
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

  function Incident<D extends object, N extends string, C extends (Error | undefined) = (Error | undefined)>(
    this: PrivateIncident<D, N, C>,
    // tslint:disable-next-line:trailing-comma
    ...args: any[]
  ): Interface<D, N, C> | void {
    if (!(this instanceof Incident)) {
      switch (args.length) {
        case 0:
          return new (Incident as any)(noStackSymbol);
        case 1:
          if (args[0] instanceof Error) {
            const err: Error & PrivateIncident<D, N, C> = args[0] as any;
            let converted: PrivateIncident<D, N, C>;
            const name: string = err.name;
            const message: string | ((data: D) => string) = typeof err._message === "function"
              ? err._message
              : err.message;
            if (err.cause instanceof Error) {
              if (typeof err.data === "object") {
                converted = new (Incident as any)(noStackSymbol, err.cause, name, err.data, message);
              } else {
                converted = new (Incident as any)(noStackSymbol, err.cause, name, message);
              }
            } else {
              if (typeof err.data === "object") {
                converted = new (Incident as any)(noStackSymbol, name, err.data, message);
              } else {
                converted = new (Incident as any)(noStackSymbol, name, message);
              }
            }
            if (err._stackContainer !== undefined) {
              converted._stackContainer = (args[0] as any)._stackContainer;
            } else if (err._stack === undefined) {
              converted._stackContainer = args[0];
              converted._stack = null; // Use the stack as-is
            } else {
              converted._stack = err._stack;
            }
            return converted;
          }
          return new (Incident as any)(noStackSymbol, args[0]);
        case 2:
          return new (Incident as any)(noStackSymbol, args[0], args[1]);
        case 3:
          return new (Incident as any)(noStackSymbol, args[0], args[1], args[2]);
        default:
          return new (Incident as any)(noStackSymbol, args[0], args[1], args[2], args[3]);
      }
    }

    let noStack: boolean = false;
    let name: N;
    let data: D | undefined = undefined;
    let cause: C | undefined = undefined;
    let message: string | ((data: D) => string);

    const argCount: number = args.length;
    let argIndex: number = 0;

    if (argCount > 0 && args[0] === noStackSymbol) {
      noStack = true;
      argIndex++;
    }
    if (argIndex < argCount && args[argIndex] instanceof Error) {
      cause = args[argIndex++];
    }
    if (typeof args[argIndex] !== "string") {
      throw new TypeError("Missing required `name` argument to `Incident`.");
    }
    name = args[argIndex++];
    if (argIndex < argCount && typeof args[argIndex] === "object") {
      data = args[argIndex++];
    }
    if (argIndex < argCount && (typeof args[argCount - 1] === "string" || typeof args[argCount - 1] === "function")) {
      message = args[argIndex];
    } else {
      if (data !== undefined) {
        message = format;
      } else {
        message = "";
      }
    }
    if (data === undefined) {
      data = {} as D;
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

  Incident.prototype.toString = Error.prototype.toString;

  function getMessage(this: PrivateIncident<object>): string {
    if (typeof this._message === "function") {
      this._message = this._message(this.data);
    }
    defineSimpleProperty(this, "message", this._message);
    return this._message;
  }

  function setMessage<D extends object>(this: PrivateIncident<D>, message: string | ((data: D) => string)): void {
    this._message = message;
  }

  function getStack(this: PrivateIncident<object>): string {
    if (this._stack === undefined || this._stack === null) {
      if (this._stackContainer !== undefined && this._stackContainer.stack !== undefined) {
        // This removes the firs lines corresponding to: "Error\n    at new Incident [...]"
        if (this._stack === null) {
          // `null` indicates that the stack has to be used without any transformation
          // This usually occurs when the stack container is an error that was converted
          this._stack = this._stackContainer.stack;
        } else {
          const stack: string = this._stackContainer.stack.replace(/^[^\n]+\n[^\n]+\n/, "");
          this._stack = this.message === "" ?
            `${this.name}\n${stack}` :
            `${this.name}: ${this.message}\n${stack}`;
        }
      } else {
        this._stack = this.message === "" ? this.name : `${this.name}: ${this.message}`;
      }
      if (this.cause !== undefined && this.cause.stack !== undefined) {
        this._stack = `${this._stack}\n  caused by ${this.cause.stack}`;
      }
    }
    Object.defineProperty(this, "stack", {
      configurable: true,
      value: this._stack,
      writable: true,
    });
    return this._stack;
  }

  function setStack(this: PrivateIncident<object>, stack: string): void {
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

// tslint:disable-next-line:variable-name
export const Incident: StaticInterface = createIncident(Error);

// tslint:disable-next-line:max-line-length
export interface Incident<D extends object, N extends string = string, C extends (Error | undefined) = (Error | undefined)>
  extends Interface<D, N, C> {
}
