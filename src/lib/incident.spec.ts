/* tslint:disable:no-angle-bracket-type-assertion */

import {assert} from "chai";
import {Incident} from "./incident";

interface IncidentLike<D extends {}> {
  cause: Error | null;
  name: string;
  data: D;
  message: string;
}

function assertEqualErrors<D>(subject: Incident<D>, reference: IncidentLike<D>): void {
  for (const key in reference) {
    assert.deepEqual((<any> subject)[key], (<any> reference)[key]);
  }
}

describe("Incident", function () {
  it("should inherit from the native Error", function () {
    const incident: Incident<{}> = new Incident();
    assert.instanceOf(incident, Error);
  });
});

describe("Incident constructors", function () {

  it("new Incident()", function () {
    const incident: Incident<{}> = new Incident();
    assertEqualErrors(incident, {
      cause: null,
      name: Incident.name,
      data: {},
      message: ""
    });
  });

  it("new Incident(message)", function () {
    const incident: Incident<{}> = new Incident("Unable to fire the reactor!");
    assertEqualErrors(incident, {
      cause: null,
      name: Incident.name,
      data: {},
      message: "Unable to fire the reactor!"
    });
  });

  it("new Incident(name, message)", function () {
    const incident: Incident<{}> = new Incident("paradoxError", "This is not an error");
    assertEqualErrors(incident, {
      cause: null,
      name: "paradoxError",
      data: {},
      message: "This is not an error"
    });
  });

  it("new Incident(name, data, message)", function () {
    const htmlRegex: RegExp = /<html>/;
    const incident: Incident<{regex: RegExp}> = new Incident(
      "regexError",
      {regex: htmlRegex},
      "Now you have two errors"
    );
    assertEqualErrors(incident, {
      cause: null,
      name: "regexError",
      data: {regex: htmlRegex},
      message: "Now you have two errors"
    });
  });

  it("new Incident(cause, message)", function () {
    const cause: Incident<{}> = new Incident("quantumError", "Causality not found");
    const incident: Incident<{}> = new Incident(cause, "Unable to predict particle");
    assertEqualErrors(incident, {
      cause: cause,
      name: "Incident", // do not inherit name of cause
      data: {},
      message: "Unable to predict particle"
    });
  });

  it("new Incident(cause, name, message)", function () {
    const cause: Incident<{}> = new Incident("hardwareError", "This is a hardware issue");
    const incident: Incident<{}> = new Incident(cause, "lightBulbError", "Unable to change light bulb");
    assertEqualErrors(incident, {
      cause: cause,
      name: "lightBulbError",
      data: {},
      message: "Unable to change light bulb"
    });
  });

  it("new Incident(cause, name, data, message)", function () {
    const cause: Incident<{}> = new Incident("lostConnectionError", "Lost connection");
    const incident: Incident<{uri: string}> = new Incident(
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

  it("new Incident(data, message)", function () {
    const incident: Incident<{foo: string}> = new Incident({foo: "bar"}, "Foo/Bar");
    assertEqualErrors(incident, {
      cause: null,
      name: Incident.name,
      data: {foo: "bar"},
      message: "Foo/Bar"
    });
  });
});