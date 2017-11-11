import { assert } from "chai";
import { Incident } from "../lib/index";

describe("Prototype chain", function () {
  it("`Incident()` should return an instance of Error and Incident", function () {
    const incident: Incident<"Incident", {}, undefined> = Incident("Incident");
    assert.instanceOf(incident, Error);
    assert.instanceOf(incident, Incident);
  });

  it("`new Incident()` should return an instance of Error and Incident", function () {
    const incident: Incident<"Incident", {}, undefined> = new Incident("Incident");
    assert.instanceOf(incident, Error);
    assert.instanceOf(incident, Incident);
  });

  it("`new IncidentSubClass()` should return an instance of Error, Incident and IncidentSubClass", function () {
    class IncidentSubClass extends Incident<"Incident"> {
      constructor() {
        super("Incident");
      }
    }

    const incident: Incident<"Incident", {}, undefined> = new IncidentSubClass();
    assert.instanceOf(incident, Error);
    assert.instanceOf(incident, Incident);
    assert.instanceOf(incident, IncidentSubClass);
  });
});
