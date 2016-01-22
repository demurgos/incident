import {Incident} from "./Incident";
import * as chai from "chai";

describe("Incident", function() {
    it("should inherit from the native Error", function () {
        var foo = new Incident();
        chai.assert.instanceOf(foo, Error);
    });
});
