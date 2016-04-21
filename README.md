# Incident

Simple custom errors

Features:


* Drop-in replacement for `Error`: __fully compatible with `Error`__ (both in Node and the browser)
* Based on native `Error`s, support for `instanceof Error`
* Easy name and data association for automated error handling
* Track error causes (simple chain or multiple reasons)
* Possibility to extends via standard JS inheritance to provide custom errors
* built with TypeScript: type definition and ES6 builds available
* Lazy stack-trace (so it does not slow down your app if you don't need it)
* Unit-tested

Planned features:  

* Better compatibility between `incident`'s defined in distinct modules (in case if this module is duplicated in the dependency tree)

## Installation ##

````bash
npm install --save incident
````

## Usage ##

````typescript
// ES6 Import:
import Incident from "incident";

// ES5 Compatibility:
let Incident = require("incident").Incident;

let err;
let cause: Error = new Error("Hi, I'm a cause");
let name: string = "incident:demo-error";
let data: any = {much: "information", such: "data", wow: "!"};
let message: string = "Don't worry, it's just a demo error";

err = new Incident();
err = new Incident(message);
err = new Incident(name, message);
err = new Incident(name, data, message);
err = new Incident(cause, message);
err = new Incident(cause, name, message);
err = new Incident(cause, name, data, message);
err = new Incident(data, message);
````

````typescript
interface Incident {
  cause: Error;
  name: string;
  data: {[key: string]: any};
  message: string;
  stack: string;
}
````
