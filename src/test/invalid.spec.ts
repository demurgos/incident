import { assert } from "chai";
import { Incident } from "../lib/index";
import { assertEqualErrors } from "./helpers";

describe("Invalid calls", function () {
  it("new Incident()", function () {
    assert.throws(() => new (<any> Incident)());
  });
  it("Incident()", function () {
    assert.throws(() => (<any> Incident)());
  });
});

describe("Interop", function () {
  it("new Incident(cause, name,       message  )", function () {
    const cause: Error = new Error("Simple error");
    const incident: Incident<{}, "LightBulb", Error> = new Incident(cause, "LightBulb", "Unable to change light bulb");
    assertEqualErrors(incident, {
      cause,
      name: "LightBulb",
      data: {},
      message: "Unable to change light bulb",
    });
  });
});
