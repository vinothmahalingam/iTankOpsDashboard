var gulp = require('gulp'),
    directoryMap = require("gulp-directory-map"),
    config = require('../config');
  
gulp.task('makedir', function () {
  return gulp
    .src('./src/**/*.*')
	.pipe(directoryMap({
		filename: 'dirmap.json'
	})).pipe(gulp.dest(config.paths.path_dist));
});  