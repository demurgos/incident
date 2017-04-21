import {assert} from "chai";
import {Incident} from "../lib/incident";

interface IncidentLike<N extends string, D extends {}, C extends (Error | undefined)> {
  message: string;
  name: N;
  data: D;
  cause?: C;
  stack?: string;
}

function assertEqualErrors<N extends string, D extends {}, C extends (Error | undefined)>(
  actual: Incident<N, D, C>,
  expected: IncidentLike<N, D, C>
): void | never {
  for (const key in expected) {
    const actualProperty: any = (<any> actual)[key];
    const expectedProperty: any = (<any> expected)[key];
    assert.deepEqual(
      actualProperty,
      expectedProperty,
      `Expected \`${actualProperty}\` to be \`${expectedProperty}\` for ${key}`
    );
  }
}

describe("Incident", function () {
  it("should inherit from the native Error", function () {
    const incident: Incident<"Incident", {}, undefined> = new Incident();
    assert.instanceOf(incident, Error);
  });
});

describe("Incident constructors", function () {
  it("new Incident()", function () {
    const incident: Incident<"Incident", {}, undefined> = new Incident();
    assertEqualErrors(incident, {
      name: Incident.name,
      data: {},
      message: ""
    });
  });

  it("new Incident(message)", function () {
    const incident: Incident<"Incident", {}, undefined> = new Incident("Unable to fire the reactor!");
    assertEqualErrors(incident, {
      name: Incident.name,
      data: {},
      message: "Unable to fire the reactor!"
    });
  });

  it("new Incident(lazyMessage)", function () {
    const incident: Incident<"Incident", {}, undefined> = new Incident(() => "Unable to fire the reactor!");
    assertEqualErrors(incident, {
      name: Incident.name,
      data: {},
      message: "Unable to fire the reactor!"
    });
  });

  it("new Incident(name, message)", function () {
    const incident: Incident<"paradoxError", {}, undefined> = new Incident("paradoxError", "This is not an error");
    assertEqualErrors(incident, {
      name: "paradoxError",
      data: {},
      message: "This is not an error"
    });
  });

  it("new Incident(name, lazyMessage)", function () {
    type ParadoxError = Incident<"paradoxError", {}, undefined>;
    const incident: ParadoxError = new Incident("paradoxError", () => "This is not an error");
    assertEqualErrors(incident, {
      name: "paradoxError",
      data: {},
      message: "This is not an error"
    });
  });

  it("new Incident(name, data, message)", function () {
    const htmlRegex: RegExp = /<html>/;
    const incident: Incident<"regexError", {regex: RegExp}, undefined> = new Incident(
      "regexError",
      {regex: htmlRegex},
      "Now you have two errors"
    );
    assertEqualErrors(incident, {
      name: "regexError",
      data: {regex: htmlRegex},
      message: "Now you have two errors"
    });
  });

  it("new Incident(name, data, lazyMessage)", function () {
    const htmlRegex: RegExp = /<html>/;
    const incident: Incident<"regexError", {regex: RegExp}, undefined> = new Incident(
      "regexError",
      {regex: htmlRegex},
      () => "Now you have two errors"
    );
    assertEqualErrors(incident, {
      name: "regexError",
      data: {regex: htmlRegex},
      message: "Now you have two errors"
    });
  });

  it("new Incident(cause, message)", function () {
    type Cause = Incident<"quantumError", {}, undefined>;
    const cause: Cause = new Incident("quantumError", "Causality not found");
    const incident: Incident<"Incident", {}, Cause> = new Incident(cause, "Unable to predict particle");
    assertEqualErrors(incident, {
      cause: cause,
      name: "Incident", // do not inherit name of cause
      data: {},
      message: "Unable to predict particle"
    });
  });

  it("new Incident(cause, lazyMessage)", function () {
    type Cause = Incident<"quantumError", {}, undefined>;
    const cause: Cause = new Incident("quantumError", "Causality not found");
    const incident: Incident<"Incident", {}, Cause> = new Incident(cause, () => "Unable to predict particle");
    assertEqualErrors(incident, {
      cause: cause,
      name: "Incident", // do not inherit name of cause
      data: {},
      message: "Unable to predict particle"
    });
  });

  it("new Incident(cause, name, message)", function () {
    type Cause = Incident<"hardwareError", {}, undefined>;
    const cause: Cause = new Incident("hardwareError", "This is a hardware issue");
    type LightBultError = Incident<"lightBulbError", {}, Cause>;
    const incident: LightBultError = new Incident(cause, "lightBulbError", "Unable to change light bulb");
    assertEqualErrors(incident, {
      cause: cause,
      name: "lightBulbError",
      data: {},
      message: "Unable to change light bulb"
    });
  });

  it("new Incident(cause, name, lazyMessage)", function () {
    type Cause = Incident<"hardwareError", {}, undefined>;
    const cause: Cause = new Incident("hardwareError", "This is a hardware issue");
    const incident: Incident<"lightBulbError", {}, Cause> = new Incident(
      cause,
      "lightBulbError",
      () => "Unable to change light bulb"
    );
    assertEqualErrors(incident, {
      cause: cause,
      name: "lightBulbError",
      data: {},
      message: "Unable to change light bulb"
    });
  });

  it("new Incident(cause, name, data, message)", function () {
    type Cause = Incident<"lostConnectionError", {}, undefined>;
    const cause: Cause = new Incident("lostConnectionError", "Lost connection");
    const incident: Incident<"netError", {uri: string}, Cause> = new Incident(
      cause,
      "netError",
      {uri: "example.com"},
      "Unable to connect"
    );
    assertEqualErrors(incident, {
      cause: cause,
      name: "netError",
      data: {uri: "example.com"},
      message: "Unable to connect"
    });
  });

  it("new Incident(cause, name, data, lazyMessage)", function () {
    type Cause = Incident<"lostConnectionError", {}, undefined>;
    const cause: Cause = new Incident("lostConnectionError", "Lost connection");
    const incident: Incident<"netError", {uri: string}, Cause> = new Incident(
      cause,
      "netError",
      {uri: "example.com"},
      () => "Unable to connect"
    );
    assertEqualErrors(incident, {
      cause: cause,
      name: "netError",
      data: {uri: "example.com"},
      message: "Unable to connect"
    });
  });

  it("new Incident(data, message)", function () {
    const incident: Incident<"Incident", {foo: string}, undefined> = new Incident({foo: "bar"}, "Foo/Bar");
    assertEqualErrors(incident, {
      name: Incident.name,
      data: {foo: "bar"},
      message: "Foo/Bar"
    });
  });

  it("new Incident(data, lazyMessage)", function () {
    const incident: Incident<"Incident", {foo: string}, undefined> = new Incident({foo: "bar"}, () => "Foo/Bar");
    assertEqualErrors(incident, {
      name: Incident.name,
      data: {foo: "bar"},
      message: "Foo/Bar"
    });
  });
});

describe("Lazy message", function () {
  it("should call the formatter lazily on first read", function () {
    const callOrder: string[] = [];

    function exec() {
      callOrder.push("start-of-exec");
      const incident: Incident<"Incident", {}, undefined> = new Incident((): string => {
        callOrder.push("message-evaluation");
        return "Lazy error";
      });
      callOrder.push("created-incident");
      callOrder.push("before-read");
      assert.isString(incident.message);
      callOrder.push("after-read");
      callOrder.push("before-read2");
      assert.isString(incident.message);
      callOrder.push("after-read2");
      callOrder.push("end-of-exec");
    }

    exec();
    assert.deepEqual(callOrder, [
      "start-of-exec",
      "created-incident",
      "before-read",
      "message-evaluation",
      "after-read",
      "before-read2",
      "after-read2",
      "end-of-exec"
    ]);
  });

  it("should call the formatter lazily on throw", function () {
    const callOrder: string[] = [];

    function exec() {
      callOrder.push("start-of-exec");
      const incident: Incident<"Incident", {}, undefined> = new Incident((): string => {
        callOrder.push("message-evaluation");
        return "Lazy error";
      });
      callOrder.push("created-incident");
      callOrder.push("before-throw");
      assert.throws(() => {
        throw incident;
      });
      callOrder.push("after-throw");
      callOrder.push("before-throw2");
      assert.throws(() => {
        throw incident;
      });
      callOrder.push("after-throw2");
      callOrder.push("end-of-exec");
    }

    exec();
    assert.deepEqual(callOrder, [
      "start-of-exec",
      "created-incident",
      "before-throw",
      "message-evaluation",
      "after-throw",
      "before-throw2",
      "after-throw2",
      "end-of-exec"
    ]);
  });
});

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
        }
      }
    }
  });
});
