var gulp = require('gulp');
var sass = require('gulp-sass');
var build = require('./build');

/**
 * run and watch file changes
 */
gulp.task('watch', function () {

	console.log('==================> Watching file changes...');

	//gulp.watch([build.config.path.src + '/**/*.hbs'], ['build-html']);
    // watch `.hbs` changes and compile new pages
    gulp.watch([build.config.path.src + '/**/*.hbs'], ['build-html'])
    .on('change', function(event) {
      console.log('==================> ' + event.path.replace(/^.*[\\\/]/, '') + ' (' + event.type + ')...');
    });
	
	//gulp.watch([build.config.path.src + '/scss/**/*.scss', build.config.path.src + '/**/*.js'], ['build-bundle']);
    // watch `.js` changes & avoiding `.min.js`
    gulp.watch([build.config.path.src + '/js/**/*.js', build.config.path.src + '/**/*.scss'], ['build-bundle'])
    .on('change', function(event) {
      console.log('==================> ' + event.path.replace(/^.*[\\\/]/, '') + ' (' + event.type + ')...');
    });

});

