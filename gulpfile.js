'use strict';

var path = require('path');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var typescript = require('typescript');
var buildTools = require('via-build-tools');

var locations = new buildTools.config.Locations({
  root: path.resolve(__dirname)
});

buildTools.tasks.build(gulp, locations, {tsc: {typescript: typescript}});
buildTools.tasks.install(gulp, locations);
buildTools.tasks.project(gulp, locations);

gulp.task('test.node', ['build.node'], function(){
  return gulp
    .src([locations.getBuildNodeDir()+'/**/*.spec.js'], { base: locations.getBuildNodeDir()})
    .pipe(mocha({
      reporter: 'spec'
    }));
});
