import chai from "chai";
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
    chai.assert.instanceOf(incident, Incident);
  });

  it("Incident(error: Error) with custom data", function () {
    interface Data {
      foo: number;
    }

    const base: Error & {data: Data} = Object.assign(new Error("Not so simple error"), {data: {foo: 1}});
    chai.assert.instanceOf(base, Error);
    const incident: Incident<Data, string, undefined> = Incident(base);
    assertEqualErrors(incident, {
      name: "Error",
      data: {foo: 1},
      message: "Not so simple error",
    });
    chai.assert.instanceOf(incident, Incident);
  });

  it("Incident(error: Error) with custom cause", function () {
    const cause: Error = new Error("Base cause");
    const base: Error & {cause: Error} = Object.assign(new Error("Error with cause"), {cause});
    chai.assert.instanceOf(base, Error);
    const incident: Incident<object, string, Error> = Incident(base);
    assertEqualErrors(incident, {
      name: "Error",
      data: {},
      cause,
      message: "Error with cause",
    });
    chai.assert.instanceOf(incident, Incident);
  });

  it("Incident(error: Error) with custom cause and data", function () {
    interface Data {
      foo: number;
    }

    const cause: Error = new Error("Base cause");
    const base: Error & {data: Data; cause: Error} = Object.assign(
      new Error("Advanced error"),
      {data: {foo: 1}, cause},
    );
    chai.assert.instanceOf(base, Error);
    const incident: Incident<Data, string, Error> = Incident(base);
    assertEqualErrors(incident, {
      name: "Error",
      data: {foo: 1},
      cause,
      message: "Advanced error",
    });
    chai.assert.instanceOf(incident, Incident);
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
    chai.assert.instanceOf(incident, Incident);
    chai.assert.notEqual(incident, base);
  });
});
