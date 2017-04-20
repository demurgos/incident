import isExtensible = Reflect.isExtensible;

export interface IncidentConstructorOptions<D> {
  name?: string;
  message?: string | ((data: D) => string);
  cause?: Error;
  data?: D;
}

/**
 * Used to stringify Incident errors.
 */
const dummyError: Error = new Error();

/**
 * A symbol used internally to not capture the stack.
 */
const noStackSymbol: Object = {};

export interface Interface<D extends {}> extends Error {
  stack: string;
  name: string;
  cause: Error | null;
  data: D;
  message: string;
  Incident: StaticInterface;

  setCause(cause: Error | null): this;
  setName(name: string): this;
  setData(data: D): this;
  setMessage(message: string | ((data: D) => string)): this;
  setStack(message: string): this;
  toString(): string;
}

interface PrivateInterface<D extends {}> extends Interface<D> {
  _message: string | ((data: D) => string);
  _stack?: string;
  _stackContainer?: Error;
}

export interface StaticInterface extends Function {
  new<D extends {}>(): Interface<D>;
  new<D extends {}>(simpleError: Error): Interface<D>;
  new<D extends {}>(message: string): Interface<D>;
  new<D extends {}>(name: string, message: string): Interface<D>;
  new<D extends {}>(name: string, lazyMessage: ((data: D) => string)): Interface<D>;
  new<D extends {}>(name: string, data: D, message: string): Interface<D>;
  new<D extends {}>(name: string, data: D, lazyMessage: ((data: D) => string)): Interface<D>;
  new<D extends {}>(lazyMessage: ((data: D) => string)): Interface<D>;
  new<D extends {}>(data: D, message: string): Interface<D>;
  new<D extends {}>(data: D, lazyMessage: ((data: D) => string)): Interface<D>;
  new<D extends {}>(cause: Error, message: string): Interface<D>;
  new<D extends {}>(cause: Error, lazyMessage: ((data: D) => string)): Interface<D>;
  new<D extends {}>(cause: Error, name: string, message: string): Interface<D>;
  new<D extends {}>(cause: Error, name: string, lazyMessage: ((data: D) => string)): Interface<D>;
  new<D extends {}>(cause: Error, name: string, data: D, message: string): Interface<D>;
  new<D extends {}>(cause: Error, name: string, data: D, lazyMessage: ((data: D) => string)): Interface<D>;

  cast<D extends {}>(obj: Interface<D>): Interface<D>;
  cast<D extends {}>(obj: Error | any): Interface<D>;
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

  function Incident<D extends {}>(this: PrivateInterface<D>, ...args: any[]): Incident<D> | void {
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

    const options: IncidentConstructorOptions<D> = {};
    let argsLen: number = args.length;
    const noStack: boolean = argsLen > 0 && args[0] === noStackSymbol;
    let argIndex: number = noStack ? 1 : 0;

    if (argsLen > 0) {
      options.message = args[--argsLen];
    } else {
      options.message = "";
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

    const message: string | ((data: D) => string) = options.message === undefined ? "" : options.message;

    _super.call(this, typeof message === "function" ? "<lazyMessage was not evaluated>" : message);

    this.setCause(options.cause || null);

    let name: string;
    if (options.name) {
      name = options.name;
    } else if (this.constructor && (<{name?: string}> <any> this.constructor).name) {
      name = (<{name: string}> <any> this.constructor).name;
    } else {
      name = "Incident";
    }

    this.setName(name);
    this.setData(options.data || <D> {});

    Object.defineProperty(this, "_message", {
      value: message,
      writable: true,
      enumerable: false,
      configurable: true
    });

    Object.defineProperty(this, "_stack", {
      value: undefined,
      writable: true,
      enumerable: false,
      configurable: true
    });

    Object.defineProperty(this, "_stackContainer", {
      value: noStack ? undefined : new Error(),
      writable: true,
      enumerable: false,
      configurable: true
    });
  }

  (<any> Incident as StaticInterface).cast = function (obj: any): any {
    if (obj instanceof Incident) {
      return obj;
    } else if (obj instanceof Error) {
      return new (<any> Incident as StaticInterface)(obj.name, obj.message);
    } else {
      return new (<any> Incident as StaticInterface)();
    }
  };

  Incident.prototype.Incident = Incident;

  Incident.prototype.setCause = function <This extends PrivateInterface<{}>>(
    this: This,
    cause: Error | null
  ): This {
    if (cause instanceof Error) {
      this.cause = cause;
    } else {
      if (cause !== null) {
        throw new TypeError("`Incident.setCause` expected `cause` to be of type: `Error | null`");
      }
      this.cause = null;
    }
    return this;
  };

  Incident.prototype.setName = function <This extends PrivateInterface<{}>>(
    this: This,
    name: string
  ): This {
    this.name = name;
    return this;
  };

  Incident.prototype.setData = function <D extends {}, This extends PrivateInterface<D>>(
    this: This,
    data: D
  ): This {
    this.data = data;
    return this;
  };

  Incident.prototype.setMessage = function <D extends {}, This extends PrivateInterface<D>>(
    this: This,
    message: string | ((data: D) => string)
  ): This {
    this._message = message;
    return this;
  };

  Incident.prototype.setStack = function <This extends PrivateInterface<{}>>(
    this: This,
    stack: string
  ): This {
    this.stack = stack;
    return this;
  };

  Incident.prototype.toString = function (this: PrivateInterface<{}>): string {
    return dummyError.toString.apply(this, arguments);
  };

  function getMessage<D extends {}, This extends PrivateInterface<D>>(this: This): string {
    if (typeof this._message === "function") {
      this._message = this._message(this.data);
    }
    Object.defineProperty(this, "message", {
      configurable: true,
      value: this._message,
      writable: true
    });
    return this._message;
  }

  function setMessage<D extends {}, This extends PrivateInterface<D>>(
    this: This,
    message: string | ((data: D) => string)
  ): void {
    this._message = message;
  }

  function getStack(this: PrivateInterface<{}>): string {
    if (this._stack === undefined) {
      if (this._stackContainer !== undefined && this._stackContainer.stack !== undefined) {
        // Remove "Error\n    at new Incident..."
        const stack: string = this._stackContainer.stack.replace(/^[^\n]+\n[^\n]+\n/, "");
        this._stack = `${this.name}: ${this._message}\n${stack}`;
      } else {
        this._stack = `${this.name}: ${this._message}`;
      }
      if (this.cause !== null && this.cause.stack !== undefined) {
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

  function setStack(this: PrivateInterface<{}>, stack: string): void {
    this._stackContainer = undefined;
    this._stack = stack;
  }

  const stackContainer: Error = new Error();

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
export interface Incident<D extends {}> extends Interface<D> {
}

export default Incident;
