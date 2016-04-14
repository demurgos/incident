"use strict";
if (Error.captureStackTrace) {
    exports.captureStackTrace = Error.captureStackTrace;
}
else {
    exports.captureStackTrace = function captureStackTrace(error, ctr) {
        var container = new Error();
        Object.defineProperty(error, 'stack', {
            configurable: true,
            get: function getStack() {
                var stack = container.stack;
                // Replace property with value for faster future accesses.
                Object.defineProperty(this, 'stack', {
                    value: stack
                });
                return stack;
            },
            set: function setStack(stack) {
                Object.defineProperty(error, 'stack', {
                    configurable: true,
                    value: stack,
                    writable: true
                });
            }
        });
    };
}
