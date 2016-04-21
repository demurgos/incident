"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var utils_1 = require("./utils");
var INCIDENT_NAME = "Incident";
var dummyError = new Error();
var Incident = (function (_super) {
    __extends(Incident, _super);
    function Incident() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var options = {};
        var i = 0, l = args.length;
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
        _super.call(this, options.message);
        this.setMessage(options.message || "");
        this.setCause(options.cause || null);
        var name;
        if (options.name) {
            name = options.name;
        }
        else if (this.constructor && this.constructor.name) {
            name = this.constructor.name;
        }
        else {
            name = INCIDENT_NAME;
        }
        this.setName(name);
        this.setData(options.data || {});
        utils_1.captureStackTrace(this, this.constructor);
        // this.setStack('');
    }
    Incident.cast = function (obj) {
        if (obj instanceof Incident) {
            return obj;
        }
        else if (obj instanceof Error) {
            return new Incident(obj.name, obj.message);
        }
        else {
            return new Incident();
        }
    };
    Incident.prototype.setCause = function (cause) {
        if (cause instanceof Error) {
            this.cause = cause;
        }
        else {
            if (cause !== null) {
                console.warn("Incident expects cause to be an Error or array of Errors");
            }
            this.cause = null;
        }
        return this;
    };
    Incident.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    Incident.prototype.setData = function (data) {
        this.data = data;
        return this;
    };
    Incident.prototype.setMessage = function (message) {
        this.message = message;
        return this;
    };
    Incident.prototype.setStack = function (message) {
        this.stack = message;
        return this;
    };
    Incident.prototype.toString = function () {
        return dummyError.toString.apply(this, arguments);
    };
    return Incident;
}(Error));
exports.Incident = Incident;
Incident.prototype.Incident = Incident;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Incident;
