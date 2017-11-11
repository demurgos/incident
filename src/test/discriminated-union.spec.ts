import { Incident } from "../lib/index";

describe("Discriminated union", function () {
  it("should compile an exemple with raw interfaces", function () {
    {
      interface SyntaxError {
        name: "SyntaxError";
        index: number;
      }

      interface TypeError {
        name: "TypeError";
        typeName: string;
      }

      type BaseError = SyntaxError | TypeError;

      function printError(error: BaseError): void {
        switch (error.name) {
          case "SyntaxError":
            const index: number = error.index;
            break;
          case "TypeError":
            const typename: string = error.typeName;
            break;
          default:
            throw new Incident("UnexpectedVariant", {value: error!.name});
        }
      }
    }
  });

  it("should compile an exemple with parametrized interfaces", function () {
    {
      interface ErrorInterface<N extends string, D extends {}> {
        name: N;
        data: D;
      }

      interface SyntaxError extends ErrorInterface<"SyntaxError", {index: number}> {
      }

      interface TypeError extends ErrorInterface<"TypeError", {typeName: string}> {
      }

      type BaseError = SyntaxError | TypeError;

      function printError(error: BaseError): void {
        switch (error.name) {
          case "SyntaxError":
            const index: number = error.data.index;
            break;
          case "TypeError":
            const typename: string = error.data.typeName;
            break;
          default:
            throw new Incident("UnexpectedVariant", {value: error!.name});
        }
      }
    }
  });

  it("should compile a discriminated Incident", function () {
    {
      type SyntaxError = Incident<"SyntaxError", {index: number}, undefined>;
      type TypeError = Incident<"TypeError", {typeName: string}, undefined>;
      type BaseError = SyntaxError | TypeError;

      function printError(error: BaseError): void {
        switch (error.name) {
          case "SyntaxError":
            const index: number = error.data.index;
            break;
          case "TypeError":
            const typename: string = error.data.typeName;
            break;
          default:
            throw new Incident("UnexpectedVariant", {value: error!.name});
        }
      }
    }
  });
});
