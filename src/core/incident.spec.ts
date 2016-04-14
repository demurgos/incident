import {Incident} from "./incident";
import * as chai from "chai";

describe("Incident", function () {
  it("should inherit from the native Error", function () {
    let incident = new Incident();
    chai.assert.instanceOf(incident, Error);
  });
});
