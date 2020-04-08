# 3.2.1 (2020-04-08)

- **[Feature]** Add `default` export.
- **[Internal]** Update dependencies.

# 3.2.0 (2018-12-10)

- **[Feature]** Expose default formatter and increase its inspection depth.
- **[Internal]** Update Typescript 3.2
- **[Internal]** Update dependencies
- **[Internal]** Run tests on ESM

# 3.1.1 (2018-02-07)

- **[Internal]** Update dependencies

# 3.1.0 (2018-01-09)

- **[Feature]** Add support for ES Modules

# 3.0.1 (2018-01-02)

- **[Fix]** Keep original stack when converting native error to incident instance
- **[Internal]** Enable greenkeeper integration
- **[Internal]** Add code coverage support
- **[Internal]** Enable codecoverage integration
- **[Internal]** Complete code coverage

# 3.0.0 (2017-11-12)

- **[Breaking change]** Require error name.
- **[Breaking change]** Drop support for browser build (es5): use your own transpiler if you need it.
- **[Breaking change]** Change order of generic parameters to `<Data, Name, Cause>` (from `<Name, Data, Cause>`).
- **[Feature]** If present, use `data` to generate the default message.
- **[Feature]** Provide default values for interface parameters
- **[Fix]** Support strict variance of the formatter function.
- **[Internal]** Add a few tests to ensure that the prototype chain is preserved.
- **[Internal]** Update project tools and enable continuous deployment.
- **[Internal]** Add `yarn.lock`.

# 2.0.0 (2017-04-21)

- **[Breaking feature]** Use the Incident name as a discriminant property for the data and cause.
  This changes the signature from `Incident<Data>` to `Incident<Name, Data, Cause>`
- **[Breaking change]** Remove the setter methods: `setName`, `setMessage`, `setCause`, `setData`.
  Use a simple assignation instead (`incident.name = "foo"`).
- **[Breaking change]** A missing cause is now represented by `undefined` instead of `null`.
- **[Feature]** `Incident(error: Error)` can now convert to instances of the current
  `Incident` constructor.
- **[Feature]** A simple function call allows to create errors that do not capture the stack. `new Incident` captures the
  stack but not `new Incident`.
- **[Fix]** Define the public exports in a separate file (`src/lib/index.ts`)

# 1.2.1 (2017-04-20)

- **[Fix]** Fix library path in _package.json_
- **[Fix]** Print error name and message in the stack trace. (Regression in 1.2.0)

# 1.2.0 (2017-04-20)

- **[Feature]** Support lazy messages. You can now pass a formatter of type `(D) => string`
  instead of a `string` for the message. It will be called only if the error
  is actually thrown or you read the message.
- **[Internal]** Update the build-tools from `0.13.0-alpha.0` to `0.13.0-beta.5`
- **[Internal]** Drop dev-dependency on `typings`
- **[Internal]** Run the tests before each commit

# 1.1.1 (2016-12-16)

- **[Fix]** Declare entry point for type definitions in `package.json`.

# 1.1.0 (2016-12-15)

- **[Change]** When using Typescipt interfaces, require type parameters for the `data` property.
- **[Internal]** Update project structure and build tools
- **[Internal]** Add Travis support

# 1.0.7 (2016-12-15)

- **[Internal]** Create `CHANGELOG.md` file
