interface ErrorConstructor {
  new (message?: string): Error;
  (message?: string): Error;
  prototype: Error;
  captureStackTrace?: (targetObject: any, constructorOpt?: any) => void;
}

export interface Error {
  stack: string;
}

declare const Error: ErrorConstructor;

export let captureStackTrace: (targetObject: Error, constructorOpt?: any) => void;

if (Error.captureStackTrace) {
  captureStackTrace = Error.captureStackTrace;
} else {
  captureStackTrace = function captureStackTrace(error: Error, ctr) {
    const stackContainer: Error = new Error();

    // tslint:disable:no-invalid-this
    Object.defineProperty(error, "stack", {
      configurable: true,
      get: function getStack(this: Error): string {
        const stack: string = stackContainer.stack;

        // Replace property with value for faster future accesses.
        Object.defineProperty(this, "stack", {
          value: stack
        });

        return stack;
      },
      set: function setStack(this: Error, stack: string): void {
        Object.defineProperty(error, "stack", {
          configurable: true,
          value: stack,
          writable: true
        });
      }
    });
  };
}
