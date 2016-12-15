# Incident

[![npm](https://img.shields.io/npm/v/incident.svg?maxAge=2592000)](https://www.npmjs.com/package/incident)
[![Build status](https://img.shields.io/travis/demurgos/incident/master.svg?maxAge=2592000)](https://travis-ci.org/demurgos/incident)
[![GitHub repository](https://img.shields.io/badge/Github-demurgos%2Fincident-blue.svg)](https://github.com/demurgos/incident)

Simple errors

## Features

- Drop-in replacement for `Error`: __fully compatible with `Error`__ (both in Node and the browser)
- Based on native `Error`s, support for `instanceof Error`
- Easy name and data association for automated error handling
- Track error causes (simple chain or multiple reasons)
- Possibility to extends via standard JS inheritance to provide custom errors
- built with TypeScript: type definition and ES6 builds available
- Lazy stack-trace (so it does not slow down your app if you don't need it)
- Unit-tested

### Planned features

- Better compatibility between `incident`'s defined in distinct modules (in case if this module is duplicated in the dependency tree)

## Installation

```shell
npm install --save incident
```

## Usage ##

```typescript
// ES6 import
import Incident from "incident";

// ES5 import
const Incident = require("incident").Incident;

let err: Incident;
const cause: Error = new Error("Hi, I'm a cause");
const name: string = "incident:demo-error";
const data: any = {much: "information", such: "data", wow: "!"};
const message: string = "Don't worry, it's just a demo error";

err = new Incident();
err = new Incident(message);
err = new Incident(name, message);
err = new Incident(name, data, message);
err = new Incident(cause, message);
err = new Incident(cause, name, message);
err = new Incident(cause, name, data, message);
err = new Incident(data, message);
```

```typescript
interface Incident<D extends {}> {
  cause: Error;
  name: string;
  data: D;
  message: string;
  stack: string;
}
```

## License

[MIT License](./LICENSE.md)
