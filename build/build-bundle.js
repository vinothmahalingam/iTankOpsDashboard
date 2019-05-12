var gulp = require('gulp');
var gutil = require('gulp-util');
var sequence = require('run-sequence');
var build = require('./build');
var func = require('./compile');


// merge with default parameters
var args = Object.assign({'prod': false}, gutil.env);

if (args['prod'] !== false) {
	// force disable debug for production
	build.config.debug = false;
}

// task to bundle js/css
gulp.task('build-bundle', function (cb) {

	console.log('==================> Generating bundles...');

	func.objectBuildTree(build.build, function (val, key) {
		if (typeof val.src !== 'undefined') {
			if (typeof val.bundle !== 'undefined') {
				func.bundle(val);
			}
			if (typeof val.output !== 'undefined') {
				func.output(val);
			}
		}
	});
	cb();
});

// entry point
gulp.task('build', function (cb) {
	var tasks = ['build-bundle', 'build-html', 'watch', 'connect'];
	// clean first and then start bundling
	return sequence.apply(cb, tasks);
});

// entry point express
gulp.task('start', function (cb) {
	var tasks = ['watch', 'connect'];
	// clean first and then start bundling
	return sequence.apply(cb, tasks);
});