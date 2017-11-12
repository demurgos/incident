import { assert } from "chai";
import { Incident } from "../lib/index";
import { assertEqualErrors } from "./helpers";

describe("Incident(error)", function () {
  it("Incident(error: Error)", function () {
    const base: Error = new Error("Simple error");
    const incident: Incident<object, string, undefined> = Incident(base);
    assertEqualErrors(incident, {
      name: "Error",
      data: {},
      message: "Simple error",
    });
    assert.instanceOf(incident, Incident);
  });

  it("Incident(error: Incident<D, N, C>)", function () {
    const cause: Error = new Error("Please move along, this is just a dummy cause");
    const base: Incident<{rating: number}, "UdpJoke", Error> = Incident(
      cause,
      "UdpJoke",
      {rating: Infinity},
      "I'd tell you a UDP joke, but you might not get it.",
    );
    const incident: Incident<{rating: number}, "UdpJoke", Error> = Incident(base);
    assertEqualErrors(incident, {
      name: "UdpJoke",
      data: {rating: Infinity},
      message: "I'd tell you a UDP joke, but you might not get it.",
      cause,
    });
    assert.instanceOf(incident, Incident);
    assert.notEqual(incident, base);
  });
});
