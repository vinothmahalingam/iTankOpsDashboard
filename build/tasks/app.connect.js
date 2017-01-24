var gulp = require('gulp'),
	connect = require('gulp-connect'),
	config = require('../config');

gulp.task('connect', function() {
  connect.server({
    port: config.port,
    livereload: true
  });
});