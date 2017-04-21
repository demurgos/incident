# Incident

[![npm](https://img.shields.io/npm/v/incident.svg?maxAge=2592000)](https://www.npmjs.com/package/incident)
[![Build status](https://img.shields.io/travis/demurgos/incident/master.svg?maxAge=2592000)](https://travis-ci.org/demurgos/incident)
[![GitHub repository](https://img.shields.io/badge/Github-demurgos%2Fincident-blue.svg)](https://github.com/demurgos/incident)

Simple powerful errors for Typescript and Javascript.

## Installation

```shell
npm install --save incident
```

## Features

- Drop-in replacement for `Error`: __fully compatible with `Error`__ (both in Node and the browser)
- Supports `instanceof Error` tests.
- Built-in error causality tracking.
- **Compatible with Typescript discriminated unions**. If you type the name, you can then use it
  as a discriminant property to resolve the type of the data and cause.
  See the example  below.
- Compatible with prototypal inheritance and ES6 classe inheritance
- Distributed with type definitions for Typescript
- Lazy stack capture and support for lazy message formatter: never called if not needed
- No dependencies

```typescript
// Example of type resolution on a discriminated type
import Incident from "incident";

// Associate the name "SyntaxError" to {index: number}
type SyntaxError = Incident<"SyntaxError", {index: number}, undefined>;
// Associate the name "TypeError" to {typeName: string}
type TypeError = Incident<"TypeError", {typeName: string}, undefined>;
// Created a discriminated type
type BaseError = SyntaxError | TypeError;

// Example usage accepting the discriminated type
function printError(error: BaseError): void {
  // Switch on the discriminant
  switch (error.name) {
    case "SyntaxError":
      // No need to cast: successfully resolved to SyntaxError
      const index: number = error.data.index;
      console.log(`Received a syntax error with index: ${index}`);
      break;
    case "TypeError":
      // Successfully resolved to TypeError
      const typename: string = error.data.typeName;
      console.log(`Received a type error with typename: ${typename}`);
      break;
  }
}
```

## Usage

### Exports

```typescript
function Incident; // The Incident constructor
interface StaticIncident; // Interface of the constructor
interface Incident; // Interface of the instance
```

### `Incident`

An `Incident` has the following interface:

```typescript
interface Incident<Name extends string, Data extends {}, Cause extends (Error | undefined)> extends Error {
  name: Name;
  message: string;
  data: Data;
  cause: Cause;
  stack: string;
  toString(): string;
}
```

### Generic parameters

- **Name**: The type of the name, use a literal string type to be able to switch
  ont the name and benefit from Typescript's type discrimination.
- **Data**: The interface of the data associated to this error. Must respect `typeof data === "object"`
- **Cause**: The type of the error cause. Use `undefined` if there is no cause.

### Attributes

#### `name`

A name uniquely identifying the error. Displayed at the top of the stack.

#### `message`

A debug message for developers describing the error. Displayed at the top of the stack.

#### `data`

A data object associated to the error. This should describe the error enough
to handle it programmatically.

#### `cause`

A previous error that cause this error. This usually has more detail about
what happened.

#### `stack`

The error stack of the incident. Contains the standard stack frames, and the
stack of the cause if there is any.

### Constructor

```typescript
new Incident<Name, Data, Cause>([cause,] [name,] [data,] [message]);
```

You can pass almost any combination of parameters you want as long as it is in the
right order (see table below for the details). If you want to explicitly define the
generic parameters, you don't have to define the generic parameter for a function parameter
you do not use. Instanciating a new Incident instance will perform a lazy capture
of the current call stack (only resolved when reading `.stack` or throwing the error).

- **cause**
  - Type: `Cause`
  - Type constraint: If you provide a `cause`, `Cause extends Error` else `Cause` is `undefined`.
  - Default type: `undefined`
  - Default value: `undefined`
  - Description: A previous error that caused this Incident.

- **name**
  - Type: `Name`
  - Type constraint: `Name extends string`
  - Default type: `"Incident"`
  - Default value: `"Incident"`
  - Description: A name allowing to discriminate the error data and cause.

- **data**
  - Type: `Data`
  - Type constraint: `Data extends {}`
  - Default type: `{}`
  - Default value: `{}`
  - Description: A data object completely describing the error.

- **message**
  - Type: `string | ((data?: typeof data) => string)`
  - Default value: `""`
  - Description: A debug message for developers. If the message is a formatter function,
    it will be lazily evaluated (only once) when:
    - the `message` property is accessed
    - the `stack` property is accessed
    - the error is thrown


`new` operator signatures table

|cause|name |data |message| Comment                                                            |
|:---:|:---:|:---:|:-----:|:-------------------------------------------------------------------|
|     |     |     |       |`new(): Incident<"Incident", {}, undefined>`                        |
|     |     |     |   ✔   |`new(...): Incident<"Incident", {}, undefined>`                     |
|     |     |  ✔  |       |`new<Data>(...): Incident<"Incident", Data, undefined>`             |
|     |     |  ✔  |   ✔   |`new<Data>(...): Incident<"Incident", Data, undefined>`             |
|     |  ✘  |     |       |**Not possible**, use `new Incident(name, "")`                      |
|     |  ✔  |     |   ✔   |`new<Name>(...): Incident<Name, {}, undefined>`                     |
|     |  ✔  |  ✔  |       |`new<Name, Data>(...): Incident<Name, Data, undefined>`             |
|     |  ✔  |  ✔  |   ✔   |`new<Name, Data>(...): Incident<Name, Data, undefined>`             |
|  ✘  |     |     |       |**Not possible**, use `new Incident(cause, "")` or `Incident(cause)`|
|  ✔  |     |     |   ✔   |`new<Cause>(...): Incident<"Incident", {}, Cause>`                  |
|  ✔  |     |  ✔  |       |`new<Data, Cause>(...): Incident<"Incident", Data, Cause>`          |
|  ✔  |     |  ✔  |   ✔   |`new<Data, Cause>(...): Incident<"Incident", Data, Cause>`          |
|  ✘  |  ✘  |     |       |**Not possible**, use `new Incident(cause, name, "")`               |
|  ✔  |  ✔  |     |   ✔   |`new<Name, Cause>(...): Incident<Name, {}, Cause>`                  |
|  ✔  |  ✔  |  ✔  |       |`new<Name, Data, Cause>(...): Incident<Name, Data, Cause>`          |
|  ✔  |  ✔  |  ✔  |   ✔   |`new<Name, Data, Cause>(...): Incident<Name, Data, Cause>`          |

### Call

You can call `Incident` as a simple function. It has the same signature as
the `new` operator but **does not capture the stack**. You may want to use
it for higher order errors, but I recommend to capture the stack for root causes.

The simple call also supports the additional signature `(cause: Error)`.
This will perform a conversion from any error to an instance of the currently called
Incident. You can use it normalize simple errors to Incident or mitigate module
duplication if you rely on `instanceof`. The resulting incident will have the
same name, message, stack and data. If the input error was an Incident with
a lazy message or stack, it will remain non-evaluated.
If the argument is already an instance of the current `Incident`, a copy will be
created. If you added extra properties, they will be lost.

|cause|name |data |message| Comment                                                 |
|:---:|:---:|:---:|:-----:|:--------------------------------------------------------|
|     |     |     |       |`(): Incident<"Incident", {}, undefined>`                |
|     |     |     |   ✔   |`(...): Incident<"Incident", {}, undefined>`             |
|     |     |  ✔  |       |`<Data>(...): Incident<"Incident", Data, undefined>`     |
|     |     |  ✔  |   ✔   |`<Data>(...): Incident<"Incident", Data, undefined>`     |
|     |  ✘  |     |       |**Not possible**, use `Incident(name, "")`               |
|     |  ✔  |     |   ✔   |`<Name>(...): Incident<Name, {}, undefined>`             |
|     |  ✔  |  ✔  |       |`new<Name, Data>(...): Incident<Name, Data, undefined>`  |
|     |  ✔  |  ✔  |   ✔   |`<Name, Data>(...): Incident<Name, Data, undefined>`     |
|  ✔  |     |     |       |**Convert to an instance of this `Incident` constructor**|
|  ✔  |     |     |   ✔   |`<Cause>(...): Incident<"Incident", {}, Cause>`          |
|  ✔  |     |  ✔  |       |`<Data, Cause>(...): Incident<"Incident", Data, Cause>`  |
|  ✔  |     |  ✔  |   ✔   |`<Data, Cause>(...): Incident<"Incident", Data, Cause>`  |
|  ✘  |  ✘  |     |       |**Not possible**, use `Incident(cause, name, "")`        |
|  ✔  |  ✔  |     |   ✔   |`<Name, Cause>(...): Incident<Name, {}, Cause>`          |
|  ✔  |  ✔  |  ✔  |       |`<Name, Data, Cause>(...): Incident<Name, Data, Cause>`  |
|  ✔  |  ✔  |  ✔  |   ✔   |`<Name, Data, Cause>(...): Incident<Name, Data, Cause>`  |

## License

[MIT License](./LICENSE.md)
