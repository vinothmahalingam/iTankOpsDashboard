/*"use strict";

var gulp = require("gulp");
var nav = require('./../navigation');
var build = require('./build');
var func = require('./compile');
var map = require('map-stream');
var menu = func.fillProperties({
	groups: nav.lists,
	seedOnly: build.config.compile.seedOnly
}); 

var data;

gulp.task("build-lang", function (done) {
   return gulp.src("./navigation.json")
     .pipe(map(function(file, done) {
       var json = JSON.parse(file.contents.toString());
       var transformedJson = {
         "nav": json,
       };
       file.contents = new Buffer(JSON.stringify(transformedJson));
       done(null, file);
     }))
     .pipe(gulp.dest("./_temp/"));


});

// push nav objects
gulp.task("build-lang", function (done) {
	console.log('==================> Generating test...');
	//newjsonfiletemplate(menu);
	console.log(newjsonfiletemplate(menu));
	done();
}); 


var newjsonfiletemplate = function(data){

	data = menu.groups;


	//data.name

	return data;
};*/