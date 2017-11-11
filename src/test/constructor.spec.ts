import { Incident } from "../lib/index";
import { assertEqualErrors } from "./helpers";

describe("new Incident(...)", function () {
  it("new Incident(cause, name,       message  )", function () {
    type Cause = Incident<"Hardware", {}, undefined>;
    const cause: Cause = new Incident("Hardware", "This is a hardware issue");
    const incident: Incident<"LightBulb", {}, Cause> = new Incident(cause, "LightBulb", "Unable to change light bulb");
    assertEqualErrors(incident, {
      cause,
      name: "LightBulb",
      data: {},
      message: "Unable to change light bulb",
    });
  });

  it("new Incident(cause, name,       formatter)", function () {
    type Cause = Incident<"CauseNotFound", {}, undefined>;
    const cause: Cause = new Incident("CauseNotFound", "Unable to find a cause to test with");
    const incident: Incident<"CauseFound", {}, Cause> = new Incident(
      cause,
      "CauseFound",
      () => "Found a cause",
    );
    assertEqualErrors(incident, {
      cause,
      name: "CauseFound",
      data: {},
      message: "Found a cause",
    });
  });

  it("new Incident(       name,       message  )", function () {
    const incident: Incident<"paradoxError", {}, undefined> = new Incident("paradoxError", "This is not an error");
    assertEqualErrors(incident, {
      name: "paradoxError",
      data: {},
      message: "This is not an error",
    });
  });

  it("new Incident(       name,       formatter)", function () {
    type ParadoxError = Incident<"paradoxError", {}, undefined>;
    const incident: ParadoxError = new Incident("paradoxError", () => "This is not an error");
    assertEqualErrors(incident, {
      name: "paradoxError",
      data: {},
      message: "This is not an error",
    });
  });

  it("new Incident(cause, name, data,          )", function () {
    type Cause = Incident<"WrapMe", {}, undefined>;
    const cause: Cause = new Incident("WrapMe", "This error justs draws attention to itself");
    const incident: Incident<"SimpleWrapper", {simple: true}, Cause> = new Incident(
      cause,
      "SimpleWrapper",
      {simple: true as true},
    );
    assertEqualErrors(incident, {
      cause,
      name: "SimpleWrapper",
      data: {simple: true},
      message: "",
    });
  });

  it("new Incident(cause, name, data, message  )", function () {
    // Trivia: `example.com` is a special domain reserved by the IANA, anyone can use it for illustrative purposes
    type Cause = Incident<"ConnectionLost", {}, undefined>;
    const cause: Cause = new Incident("ConnectionLost", "Lost connection");
    const incident: Incident<"Network", {uri: string}, Cause> = new Incident(
      cause,
      "Network",
      {uri: "example.com"},
      "Unable to connect",
    );
    assertEqualErrors(incident, {
      cause,
      name: "Network",
      data: {uri: "example.com"},
      message: "Unable to connect",
    });
  });

  it("new Incident(cause, name, data, formatter)", function () {
    type Cause = Incident<"MinLength", {minLength: number}, undefined>;
    const cause: Cause = new Incident("MinLength", {minLength: 59}, "Value must have `.length` ≥ 59");
    const incident: Incident<"InvalidCityName", {value: string}, Cause> = new Incident(
      cause,
      "InvalidCityName",
      {value: "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch"},
      (data: {value: string}): string => `The value ${JSON.stringify(data.value)} is an invalid city name`,
    );
    assertEqualErrors(incident, {
      cause,
      name: "InvalidCityName",
      data: {value: "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch"},
      message: "The value \"Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch\" is an invalid city name",
    });
  });

  it("new Incident(       name, data           )", function () {
    const incident: Incident<"AintNobodyGotTimeForMessages", {timeForMessages: number}, undefined> = new Incident(
      "AintNobodyGotTimeForMessages",
      {timeForMessages: 0},
    );
    assertEqualErrors(incident, {
      name: "AintNobodyGotTimeForMessages",
      data: {timeForMessages: 0},
      message: "",
    });
  });

  it("new Incident(       name, data, message  )", function () {
    const htmlRegExp: RegExp = /<html>/;
    const incident: Incident<"RegExp", {regExp: RegExp}, undefined> = new Incident(
      "RegExp",
      {regExp: htmlRegExp},
      "Now you have two errors",
    );
    assertEqualErrors(incident, {
      name: "RegExp",
      data: {regExp: htmlRegExp},
      message: "Now you have two errors",
    });
  });

  it("new Incident(       name, data, formatter)", function () {
    const antiRegExp: RegExp = /[^]/;
    const incident: Incident<"RegExp", {regex: RegExp}, undefined> = new Incident(
      "RegExp",
      {regex: antiRegExp},
      (data: {regex: RegExp}) => `The RegExp for ${JSON.stringify(data.regex.source)} does not want to cooperate`,
    );
    assertEqualErrors(incident, {
      name: "RegExp",
      data: {regex: antiRegExp},
      message: "The RegExp for \"[^]\" does not want to cooperate",
    });
  });
});
