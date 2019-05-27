var gulp = require('gulp');
var path = require('path');
var build = require('./build');

/**
 * run and watch file changes
 */
gulp.task('watch', function (done) {
	console.log('==================> Watching file changes...');

	// watch `.hbs` changes and compile new pages
	gulp.watch([build.config.path.src + '/**/*.hbs'], gulp.series('build-html'))
		.on('change', function (event) {
			var file = path.parse(event);
			console.log('==================> File changed: ' + file.name + ' (' + file.ext + ')...');
		});

	// watch `.js` changes & avoiding `.min.js`
	gulp.watch([build.config.path.src + '/**/*.js', build.config.path.src + '/**/*.scss'], gulp.series('build-bundle'))
		.on('change', function (event) {
			var file = path.parse(event);
			console.log('==================> File changed: ' + file.name + ' (' + file.ext + ')...');
		});

	// watch `navigation.json` changes and compile new nav
	/*gulp.watch(['navigation.json'], gulp.series('build-nav'))
		.on('change', function (event) {
			var file = path.parse(event);
			console.log('==================> File changed: ' + file.name + ' (' + file.ext + ')...');
		});	*/

	done();
})