import {Incident} from "./incident";
import {assert} from "chai";

interface IncidentLike {
  cause: Error;
  name: string;
  data: {[key: string]: any};
  message: string;
}

function matchError (subject: Incident, reference: IncidentLike) {
  for (let key in reference) {
    assert.deepEqual((<any> subject)[key], (<any> reference)[key]);
  }
}

describe("Incident", function () {
  it("should inherit from the native Error", function () {
    let incident = new Incident();
    assert.instanceOf(incident, Error);
  });
});

describe("Incident constructors", function () {

  it("new Incident()", function() {
    let incident = new Incident();
    matchError(incident, {
      cause: null,
      name: (<any> Incident).name,
      data: {},
      message: ""
    });
  });

  it("new Incident(message)", function() {
    let incident = new Incident("Unable to fire the reactor!");
    matchError(incident, {
      cause: null,
      name: (<any> Incident).name,
      data: {},
      message: "Unable to fire the reactor!"
    });
  });

  it("new Incident(name, message)", function() {
    let incident = new Incident("paradoxError", "This is not an error");
    matchError(incident, {
      cause: null,
      name: "paradoxError",
      data: {},
      message: "This is not an error"
    });
  });

  it("new Incident(name, data, message)", function() {
    let htmlRegex = /<html>/;
    let incident = new Incident("regexError", {regex: htmlRegex}, "Now you have two errors");
    matchError(incident, {
      cause: null,
      name: "regexError",
      data: {regex: htmlRegex},
      message: "Now you have two errors"
    });
  });

  it("new Incident(cause, message)", function(){
    let cause = new Incident("quantumError", "Causality not found");
    let incident = new Incident(cause, "Unable to predict particle");
    matchError(incident, {
      cause: cause,
      name: "Incident", // do not inherit name of cause
      data: {},
      message: "Unable to predict particle"
    });
  });

  it("new Incident(cause, name, message)", function(){
    let cause = new Incident("hardwareError", "This is a hardware issue");
    let incident = new Incident(cause, "lightBulbError", "Unable to change light bulb");
    matchError(incident, {
      cause: cause,
      name: "lightBulbError",
      data: {},
      message: "Unable to change light bulb"
    });
  });

  it("new Incident(cause, name, data, message)", function(){
    let cause = new Incident("lostConnectionError", "Lost connection");
    let incident = new Incident(cause, "netError", {url: "thegame.com"}, "Unable to connect");
    matchError(incident, {
      cause: cause,
      name: "netError",
      data: {url: "thegame.com"},
      message: "Unable to connect"
    });
  });

  it("new Incident(data, message)", function(){
    let incident = new Incident({foo: "bar"}, "Foo/Bar");
    matchError(incident, {
      cause: null,
      name: (<any> Incident).name,
      data: {foo: "bar"},
      message: "Foo/Bar"
    });
  });
});
