import * as _ from 'lodash';

export interface IncidentConstructorOptions {
    stack?:string;
    name?:string;
    message?:string;
    formater?:any;
    cause?:Error|Array<Error>;
    data?:{[key:string]: any};
}

export class Incident extends Error {
    static NAME = 'Incident';
    static INDENT = '  ';

    stack:string;
    name:string;
    message:string;
    // formater:any;
    cause:Array<Error>;
    data:{[key:string]: any};

    Incident:Object; // reference to the root Incident class for compatibility between various Incident definitions.

    constructor();
    constructor(simpleError:Error);
    constructor(message:string);
    constructor(cause:Error|Array<Error>, message:string);
    constructor(name:string, message:string);
    constructor(cause:Error|Array<Error>, name:string, message:string);
    constructor(name:string, data:{[key:string]: any}, message:string);
    constructor(cause:Error|Array<Error>, name:string, data:{[key:string]: any}, message:string);

    constructor() {
        var args = new Array(arguments.length);
        for (var i = 0, l = arguments.length; i < l; i++) {
            args[i] = arguments[i];
        }

        // type coercion
        if (!(this instanceof Incident)) {
            if (args.length != 1) {
                console.warn("Incident coercion expects exactly one parameter");
            }
            return Incident.coerce(args[0]);
        }

        super();

        var options:IncidentConstructorOptions = {};
        var i = 0, l = args.length;

        if (l > 0) {
            options.message = args[--l];
        }
        if (i < l && Incident.isCause(args[i])) {
            options.cause = args[i++];
        }
        if (i < l && _.isString(args[i])) {
            options.name = args[i++];
        }
        if (i < l && _.isObject(args[i])) {
            options.data = args[i++];
        }

        this.setMessage(options.message || '');
        this.setCause(options.cause || null);
        this.setName(options.name || Incident.NAME);
        this.setData(options.data || {});
        this.setStack('');

    }

    setCause(cause:Error|Array<Error>):Incident {
        if (cause instanceof Array) {
            this.cause = cause;
        } else if (cause instanceof Error) {
            this.cause = [cause];
        } else {
            console.warn("Incident expects cause to be an Error or array of Errors");
            this.cause = [];
        }
        return this;
    }

    setName(name:string):Incident {
        this.name = name;
        return this;
    }

    setData(data:{[key:string]: any}):Incident {
        this.data = data;
        return this;
    }

    setMessage(message:string):Incident {
        this.message = message;
        return this;
    }

    setStack(message:string):Incident {
        this.stack = message;
        return this;
    }

    /*
     ["a", "b", [["c"], ["d", [["e"], ["f"], ["g", "h"]]]]]
     ->
     a: b: 2 errors: {
     c,
     d: 3 errors: {
     e,
     f,
     g: h
     }
     }

     */

    getCausalityTree() {
        let chain:Array<any> = [];
        let cur:any = this;
        while (cur) {
            chain.push(cur);
            if (cur.cause.length === 0) {
                break;
            }
            if (cur.cause.length === 1) {
                if (cur.cause[0] instanceof Incident) {
                    cur = cur.cause[0];
                } else {
                    chain.push(cur.cause[0]);
                    break;
                }
            } else {
                chain.push(_.map(cur.cause, function (cause) {
                    return cause instanceof Incident ? cause.getCausalityTree() : [cause];
                }));
                break;
            }
        }
        return chain;
    }

    getOwnMessage() {
        let name = this.name;
        let msg = this.message;
        let ownMessage:string;
        if (name === "") {
            ownMessage = "" + msg;
        } else if (msg === "") {
            ownMessage = "" + name;
        } else {
            ownMessage = "" + msg;
        }

        return ownMessage;
    }

    toString() {
        return Incident.printTree(this.getCausalityTree());
    }

    static isCause(cause:Error|Array<Error>):boolean {
        if (cause instanceof Array) {
            let onlyErrors = true;
            for (let i = 0, l = cause.length; i < l; i++) {
                if (!(cause[i] instanceof Error)) {
                    onlyErrors = false;
                    break;
                }
            }
            return onlyErrors;
        } else {
            return cause instanceof Error;
        }
    }

    /*
     ["a", "b", [["c"], ["d", [["e"], ["f"], ["g", "h"]]]]]
     ->
     a: b: 2 errors: [
     c,
     d: 3 errors: [
     e,
     f,
     g: h
     ]
     ]

     */

    static printTree(tree:Array<any>, indent?:string) {
        if (tree.length < 1) {
            return indent + '(empty)';
        } else {
            if (_.isArray(tree[tree.length - 1])) {
                let list = tree.pop();
                let cause = list.length + ' error' + (list.length > 1 ? 's' : '') + ': '; //useless plural test?
                list = _.map(list, function (subTree:Array<any>) {
                    return Incident.printTree(subTree, indent);
                });
                if (list.length) {
                    cause += '[\n' + Incident.indent(list.join(',\n'), indent) + '\n]';
                } else {
                    cause += '[]';
                }
                tree.push(cause);
            }

            return _.reduce(tree, function (chain, cause) {
                if (chain.length) {
                    chain += ': ';
                }

                if (_.isString(cause)) {
                    return chain += cause;
                } else if (cause instanceof Incident) {
                    return chain += cause.getOwnMessage();
                } else if (cause instanceof Error) {
                    return chain += cause.toString();
                } else {
                    return chain += '' + cause;
                }
            }, '');
        }
    }

    static indent = function (str:string, indent:string):string {
        indent = indent || Incident.INDENT;
        return indent + str.replace(new RegExp('\n', 'g'), '\n' + indent);
    };

    static coerce = function (src:Incident|Error|any):Incident {
        if (src instanceof Incident) {
            return src;
        } else if (src instanceof Error) {
            return new Incident(src.name, src.message);
        } else {
            return new Incident();
        }
    }
}

Incident.prototype.Incident = Incident;

export default Incident;
