"use strict";

const gulp = require("gulp");
const typescript = require("typescript");
const buildTools = require("demurgos-web-build-tools");

const projectOptions = buildTools.config.DEFAULT_PROJECT_OPTIONS;
projectOptions.root = __dirname;
const libTarget = buildTools.config.LIB_TARGET;
const libTestTarget = buildTools.config.LIB_TEST_TARGET;

buildTools.projectTasks.registerAll(gulp, {
    project: projectOptions,
    tslintOptions: {},
    install: {}
});

buildTools.targetGenerators.node.generateTarget(
    gulp,
    "lib",
    {
        project: projectOptions,
        target: libTarget,
        tsOptions: {
            typescript: typescript
        }
    }
);

buildTools.targetGenerators.test.generateTarget(
    gulp,
    "lib-test",
    {
        project: projectOptions,
        target: libTestTarget,
        tsOptions: {
            typescript: typescript
        }
    }
);
