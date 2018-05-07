import chai from "chai";
import { Incident } from "../lib/index";

describe("Prototype chain", function () {
  it("`Incident()` should return an instance of Error and Incident", function () {
    const incident: Incident<object, "Incident", undefined> = Incident("Incident");
    chai.assert.instanceOf(incident, Error);
    chai.assert.instanceOf(incident, Incident);
  });

  it("`new Incident()` should return an instance of Error and Incident", function () {
    const incident: Incident<object, "Incident", undefined> = new Incident("Incident");
    chai.assert.instanceOf(incident, Error);
    chai.assert.instanceOf(incident, Incident);
  });

  it("`new IncidentSubClass()` should return an instance of Error, Incident and IncidentSubClass", function () {
    class IncidentSubClass extends Incident<"Incident"> {
      constructor() {
        super("Incident");
      }
    }

    const incident: Incident<object, "Incident", undefined> = new IncidentSubClass();
    chai.assert.instanceOf(incident, Error);
    chai.assert.instanceOf(incident, Incident);
    chai.assert.instanceOf(incident, IncidentSubClass);
  });
});
