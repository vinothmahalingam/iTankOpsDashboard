"use strict";

var gulp = require("gulp");
var nav = require('./../navigation');
var build = require('./build');
var func = require('./compile');
var menu = func.fillProperties({
	groups: nav.lists,
	seedOnly: build.config.compile.seedOnly
}); 

// push nav objects
gulp.task("build-nav", function (done) {
	console.log('==================> Generating navigation...');
	func.writeNavigation(menu, build.config.path.exportPath);
	func.formatOutput({
		inputPath: build.config.path.exportPath,
		outputPath: build.config.path.outputPath
	});
	done();
}); 