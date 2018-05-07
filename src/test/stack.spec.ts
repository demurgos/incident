import chai from "chai";
import { Incident } from "../lib/index";

describe("Stack", function () {
  it("Reading the stack twice should return the same value", function () {
    const incident: Incident<{}> = new Incident("FullStack");
    const firstStack: string = incident.stack;
    chai.assert.isString(firstStack);
    chai.assert.isAbove(firstStack.length, 0);
    const secondStack: string = incident.stack;
    chai.assert.equal(secondStack, firstStack);
  });

  it("A stackless error without message should use its name as the stack", function () {
    const incident: Incident<{}> = Incident("StacklessNoMessage");
    const actual: string = incident.stack;
    chai.assert.equal(actual, "StacklessNoMessage");
  });

  it("A stackless error should use its name if there is no message", function () {
    const incident: Incident<{}> = Incident("StacklessWithMessage", "I have a message");
    const actual: string = incident.stack;
    chai.assert.equal(actual, "StacklessWithMessage: I have a message");
  });

  it("The stack message should contain causality chain", function () {
    const cause: Incident<{}> = Incident("StacklessCause", "I'm a cause");
    const incident: Incident<{}> = Incident(cause, "StacklessWithCause", "I have a cause");
    const actual: string = incident.stack;
    chai.assert.equal(actual, "StacklessWithCause: I have a cause\n  caused by StacklessCause: I'm a cause");
  });

  it("A converted incident should keep its lazy stack", function () {
    const baseIncident: Error = new Incident("I have a lazy stack");
    const convertedIncident: Incident<{}> = Incident(baseIncident);
    chai.assert.equal(convertedIncident.stack, baseIncident.stack);
  });

  it("A converted incident should keep its eagerly evaluated stack", function () {
    const baseIncident: Error = new Incident("I have a lazy stack");
    chai.assert.isString(baseIncident.stack);
    const convertedIncident: Incident<{}> = Incident(baseIncident);
    chai.assert.equal(convertedIncident.stack, baseIncident.stack);
  });

  it("A converted error should keep the original stack", function () {
    const native: Error = new Error("I have a stack");
    chai.assert.isString(native.stack);
    const nativeStack: string = native.stack!;
    const incident: Incident<{}> = Incident(native);
    const convertedStack: string = incident.stack;
    chai.assert.equal(convertedStack, nativeStack);
  });

  it("Eager stack is mutable", function () {
    const incident: Incident<{}> = new Incident("MyStackWillMutate");
    const oldStack: string = incident.stack;
    chai.assert.isString(oldStack);
    incident.stack = "This is a new stack";
    const newStack: string = incident.stack;
    chai.assert.equal(newStack, "This is a new stack");
    chai.assert.notEqual(newStack, oldStack);
  });

  it("Lazy stack is mutable", function () {
    const incident: Incident<{}> = new Incident("MyStackWillMutate");
    incident.stack = "This is a new stack";
    const newStack: string = incident.stack;
    chai.assert.equal(newStack, "This is a new stack");
  });

  it("Mutated eager stack is passed as-is during conversion", function () {
    const err: Error = new Error();
    chai.assert.isString(err.stack);
    const base: Incident<{}> = new Incident("Base");
    base.stack = "Overriding the stack";
    const converted: Incident<{}> = Incident(base);
    converted.stack = err.stack!;
    chai.assert.equal(converted.stack, err.stack!);
  });
});
