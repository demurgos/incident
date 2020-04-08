# Incident

[![npm](https://img.shields.io/npm/v/incident.svg?maxAge=2592000)](https://www.npmjs.com/package/incident)
[![GitHub repository](https://img.shields.io/badge/Github-demurgos%2Fincident-blue.svg)](https://github.com/demurgos/incident)
[![Build status](https://img.shields.io/travis/demurgos/incident/master.svg?maxAge=2592000)](https://travis-ci.org/demurgos/incident)
[![Codecov](https://codecov.io/gh/demurgos/incident/branch/master/graph/badge.svg)](https://codecov.io/gh/demurgos/incident)

Errors with superpowers.

## Installation

```shell
npm install --save incident
```

## Features

- Node and browser support.
- Supports `instanceof Error` tests.
- Built-in error causality tracking.
- **Compatible with Typescript discriminated unions**. If you type the name, you can then use it
  as a discriminant property to resolve the type of the data and cause.
  See the example  below.
- Compatible with prototypal inheritance and ES6 class inheritance
- Distributed with type definitions for Typescript
- Lazy stack capture and support for lazy message formatter: never called if not needed
- Minimal dependencies: has a single dependency on [object-inspect](https://github.com/substack/object-inspect)
- Tiny: 3kB minized, 1kB gziped

## Migration from version 2

Ensure that each of you always provide a `name`. You should mainly look for `new Incident(message)` and
`new Incident(cause, message)` which would be interpreted as `new Incident(name)` and `new Incident(cause, name)`
in version 3.
Also note that the order of the generic parameters changed from `<Name, Data, Cause>` to `<Data, Name, Cause>`.

## Why

My goal with this library was to simplify the automatic handling of errors and
provide better error messages. Javascript errors are not very helpful because extending
them and then extracting data is tedious because you need a declaration statement,
multiple assignations, and then match on the name that is usually the generic `"Error"`
or rely on a brittle `instance of`.

To achieve automatic error handling, the information describing the error should
be easily accessible programmatically. That's why you can directly pass a data object
to the `Incident` constructor. Being able to pass data on the fly means that you do not need a
declaration statement for the error separate property assignations. A key identifying the error
is the second requirement for automatic error handling, `Incident` simply uses the name.
As explained in the features, it allows to unambiguously identify the error (I'd recommend to
always use a name). Using a name (as a string enum variant) is also more reliable than using
`instance of` (prototype chain lookup) to check for the type of custom errors. The two main
advantages are that it's easier to serialize / deserialize and is not affected by the module
duplication of the Node module resolution algorithm.

To provide better error messages, especially for asynchronous operations, I made the cause
of the error a first-class information. It allows to deal with deferred or wrapped errors
more pleasant: the stack trace at each step is preserved.

The library is already pretty verbose (I am waiting for generic defaults in TS 2.3) so
I'd like to keep the usage simple. For example, I have experimented with a arrays of causes (when
an error has multiple simultaneous causes).
The displayed messages were pretty good but it made the code to handle the errors automatically
pretty complex because the type for the cause was `Error | Error[] | undefined`.
This feature did not even make it to the version 1. If you need it, but your multiple reasons
in the `data` object.

Finally, performance is also a goal. That's why the library performs late / lazy stack capture
and allows for message formatters that are called only when needed.

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
interface Incident<
  Data extends object,
  Name extends string = string,
  Cause extends (Error | undefined) = (Error | undefined)
> extends Error {
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
If you provide `data` but no `message`, the message will be generate from the data using
[object-inspect](https://github.com/substack/object-inspect) with default options.

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
new Incident<Data, Name, Cause>([cause,] name, [data,] [message]);
```

You can pass almost any combination of parameters you want as long as it is in the
right order (see table below for the details) and a name is specified. If you want
to explicitly define the generic parameters, you don't have to define the generic
parameter for a function parameter you do not use. Instanciating a new Incident
instance will perform a lazy capture of the current call stack (only resolved when
reading `.stack` or throwing the error).

- **cause**
  - Type: `Cause`
  - Type constraint: If you provide a `cause`, `Cause extends Error` else `Cause` is `undefined`.
  - Default type: `undefined`
  - Default value: `undefined`
  - Description: A previous error that caused this Incident.

- **name**
  - Type: `Name`
  - Type constraint: `Name extends string`
  - Default type: `string`
  - **Required**
  - Description: A name allowing to discriminate the error data and cause.

- **data**
  - Type: `Data`
  - Type constraint: `Data extends object`
  - Default type: `object`
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

|cause|name |data |message| Comment                                                  |
|:---:|:---:|:---:|:-----:|:---------------------------------------------------------|
|     |  ✔  |     |       |`new<Name>(...): Incident<Name, object, undefined>`       |
|     |  ✔  |     |   ✔   |`new<Name>(...): Incident<Name, object, undefined>`       |
|     |  ✔  |  ✔  |       |`new<Data, Name>(...): Incident<Name, Data, undefined>`   |
|     |  ✔  |  ✔  |   ✔   |`new<Data, Name>(...): Incident<Name, Data, undefined>`   |
|  ✔  |  ✔  |     |       |`new<Name, Cause>(...): Incident<Name, object, Cause>`    |
|  ✔  |  ✔  |     |   ✔   |`new<Name, Cause>(...): Incident<Name, object, Cause>`    |
|  ✔  |  ✔  |  ✔  |       |`new<Data, Name, Cause>(...): Incident<Name, Data, Cause>`|
|  ✔  |  ✔  |  ✔  |   ✔   |`new<Data, Name, Cause>(...): Incident<Name, Data, Cause>`|

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

|cause|name |data |message| Comment                                                  |
|:---:|:---:|:---:|:-----:|:---------------------------------------------------------|
|  ✔  |     |     |       |**Converts to an instance of this `Incident` constructor**|
|     |  ✔  |     |       |`<Name>(...): Incident<Name, object, undefined>`          |
|     |  ✔  |     |   ✔   |`<Name>(...): Incident<Name, object, undefined>`          |
|     |  ✔  |  ✔  |       |`<Data, Name>(...): Incident<Name, Data, undefined>`      |
|     |  ✔  |  ✔  |   ✔   |`<Data, Name>(...): Incident<Name, Data, undefined>`      |
|  ✔  |  ✔  |     |       |`<Name, Cause>(...): Incident<Name, object, Cause>`       |
|  ✔  |  ✔  |     |   ✔   |`<Name, Cause>(...): Incident<Name, object, Cause>`       |
|  ✔  |  ✔  |  ✔  |       |`<Data, Name, Cause>(...): Incident<Name, Data, Cause>`   |
|  ✔  |  ✔  |  ✔  |   ✔   |`<Data, Name, Cause>(...): Incident<Name, Data, Cause>`   |

## Discriminated union

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

## License

[MIT License](./LICENSE.md)
