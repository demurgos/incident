# Next

- Patch: Print error name and message in the stack traced. (Regression in 1.2.0)

# 1.2.0

- Minor: Support lazy messages. You can now pass a formatter of type `(D) => string`
  instead of a `string` for the message. It will be called only if the error
  is actually thrown or you read the message.
- Internal: Update the build-tools from `0.13.0-alpha.0` to `0.13.0-beta.5`
- Internal: Drop dev-dependency on `typings`
- Internal: Run the tests before each commit

# 1.1.1

- Declare entry point for type definitions in `package.json`.

# 1.1.0

- When using Typescipt interfaces, require type parameters for the `data` property.
- Update project structure and build tools
- Add Travis support

# 1.0.7

- Create `CHANGELOG.md` file
