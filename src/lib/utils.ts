export type CaptureStackTrace = (targetObject: Error, constructorOpt?: any) => void;

interface ErrorConstructor {
  new (message?: string): Error;
  (message?: string): Error;
  prototype: Error;
  captureStackTrace?: CaptureStackTrace;
}

export interface Error {
  stack: string;
}

declare const Error: ErrorConstructor;

export function lazyCaptureStackTrace(error: Error, ctr?: any): void {
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
}

export const captureStackTrace: CaptureStackTrace = Error.captureStackTrace || lazyCaptureStackTrace;
