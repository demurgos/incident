import { Incident } from "../lib/index";
import { assertEqualErrors } from "./helpers";

describe("Incident(...)", function () {
  it("Incident(cause, name,       message  )", function () {
    type Cause = Incident<{}, "QuantumEffect", undefined>;
    const cause: Cause = Incident("QuantumEffect", "What is even a cause?");
    const incident: Incident<{}, "Quantum", Cause> = Incident(cause, "Quantum", "Quantum stuff is rad but weird");
    assertEqualErrors(incident, {
      cause,
      name: "Quantum",
      data: {},
      message: "Quantum stuff is rad but weird",
    });
  });

  it("Incident(cause, name,       formatter)", function () {
    // These stunts are performed by trained professionals, don't try this at home
    type Cause = Incident<{value: number}, "NotANumber", undefined>;
    const numberBox: {value: number} = {value: NaN};
    const cause: Cause = Incident("NotANumber", numberBox, "The number box contains NaN");
    const incident: Incident<{}, "NotABox", Cause> = Incident(
      cause,
      "NotABox",
      () => `Error with the number box containing ${numberBox.value}`,
    );
    // Seriously, if you use a formatter with a lazy message, avoid to rely on mutable data reference you don't control
    numberBox.value = 0;
    assertEqualErrors(incident, {
      cause,
      name: "NotABox",
      data: {},
      message: "Error with the number box containing 0",
    });
  });

  it("Incident(       name,       message  )", function () {
    const incident: Incident<{}, "MajorAlert", undefined> = Incident("MajorAlert", "Unable to fire the reactor!");
    assertEqualErrors(incident, {
      name: "MajorAlert",
      data: {},
      message: "Unable to fire the reactor!",
    });
  });

  it("Incident(       name,       formatter)", function () {
    const incident: Incident<{}, "MinorAlert", undefined> = Incident("MinorAlert", () => "The reactor is on fire!");
    assertEqualErrors(incident, {
      name: "MinorAlert",
      data: {},
      message: "The reactor is on fire!",
    });
  });

  it("Incident(cause, name, data,          )", function () {
    type Cause = Incident<{}, "NeedForEasyErrorManagement", undefined>;
    const cause: Cause = Incident("NeedForEasyErrorManagement", "");
    const incident: Incident<{homepage: string; author: string}, "Incident", Cause> = Incident(
      cause,
      "Incident",
      {homepage: "https://github.com/demurgos/incident", author: "Demurgos"},
    );
    assertEqualErrors(incident, {
      cause,
      name: "Incident",
      data: {homepage: "https://github.com/demurgos/incident", author: "Demurgos"},
      message: "{ homepage: 'https://github.com/demurgos/incident', author: 'Demurgos' }",
    });
  });

  it("Incident(cause, name, data, message  )", function () {
    type Cause = Incident<{status: number}, "Http", undefined>;
    const cause: Cause = Incident("Http", {status: 200}, "200 - OK");
    const now: Date = new Date();
    const incident: Incident<{time: Date}, "Surprise", Cause> = Incident(
      cause,
      "Surprise",
      {time: now},
      "Surprise error",
    );
    assertEqualErrors(incident, {
      cause,
      name: "Surprise",
      data: {time: now},
      message: "Surprise error",
    });
  });

  it("Incident(cause, name, data, formatter)", function () {
    enum Unit {Kelvin, Celsius, Farenheit}

    type Cause = Incident<{temperature: number; unit: Unit}, "Temperature", undefined>;
    // Sorry if you use imperial units
    const cause: Cause = Incident("Temperature", {temperature: -273.15, unit: Unit.Celsius}, "It's 0K");
    const incident: Incident<{endOfTheWorld: boolean}, "AbstractErrorFactoryProvider", Cause> = Incident(
      cause,
      "AbstractErrorFactoryProvider",
      {endOfTheWorld: true},
      (data: {endOfTheWorld: boolean}) => data.endOfTheWorld ? "Seems pretty serious" : "Could be worse",
    );
    assertEqualErrors(incident, {
      cause,
      name: "AbstractErrorFactoryProvider",
      data: {endOfTheWorld: true},
      message: "Seems pretty serious",
    });
  });

  it("Incident(       name, data           )", function () {
    const incident: Incident<{port: number}, "MysteriousPort", undefined> = Incident("MysteriousPort", {port: 50313});
    assertEqualErrors(incident, {
      name: "MysteriousPort",
      data: {port: 50313},
      message: "{ port: 50313 }",
    });
  });

  it("Incident(       name, data, message  )", function () {
    // You know you're getting tired of coming up with errors when you resort to foo & bar...
    const incident: Incident<{foo: string}, "Unimaginative", undefined> = Incident(
      "Unimaginative",
      {foo: "bar"},
      "Foo/Bar",
    );
    assertEqualErrors(incident, {
      name: "Unimaginative",
      data: {foo: "bar"},
      message: "Foo/Bar",
    });
  });

  it("Incident(       name, data, formatter)", function () {
    const incident: Incident<{bar: string}, "UnimaginativeAndLazy", undefined> = Incident(
      "UnimaginativeAndLazy",
      {bar: "foo"},
      () => "Bar/Foo",
    );
    assertEqualErrors(incident, {
      name: "UnimaginativeAndLazy",
      data: {bar: "foo"},
      message: "Bar/Foo",
    });
  });
});
