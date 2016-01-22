interface ErrorConstructor {
    new (message?: string): Error;
    (message?: string): Error;
    prototype: Error;
    captureStackTrace?: (targetObject: any, constructorOpt?: any) => void;
}

interface Error {
    stack: string;
}

declare var Error: ErrorConstructor;

export let captureStackTrace: (targetObject: any, constructorOpt?: any) => void;
if (Error.captureStackTrace) {
    captureStackTrace = Error.captureStackTrace;
} else {
    captureStackTrace = function captureStackTrace (error, ctr) {
        let container = new Error();

        Object.defineProperty(error, "stack", {
            configurable: true,
            get: function getStack () {
                let stack = container.stack;

                // Replace property with value for faster future accesses.
                Object.defineProperty(this, "stack", {
                    value: stack
                });

                return stack;
            },
            set: function setStack (stack) {
                Object.defineProperty(error, "stack", {
                    configurable: true,
                    value: stack,
                    writable: true
                });
            }
        });
    };
}
