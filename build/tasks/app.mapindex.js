var gulp = require('gulp'),
    folderIndex = require("gulp-folder-index"),
    config = require('../config');
  
gulp.task('mapindex', function () {
  return gulp
    .src('./src/**/*.*')
	.pipe(folderIndex({
		extension: '.json',       // default 
		filename: 'index.json',   // default 
		prefix: ''                // default 
	})).pipe(gulp.dest(config.paths.path_dist));
});  