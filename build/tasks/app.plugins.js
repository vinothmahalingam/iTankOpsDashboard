var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    config = require('../config');

gulp.task('copy-cust-plugins', function() {
    gulp.src(config.paths.path_custom + '/plugins/**/*.js')
   .pipe(rename({dirname: ''}))
   .pipe(gulp.dest(config.paths.path_vendor + '/js/custom/plugins'))
   .pipe(uglify())
   .pipe(rename({suffix: '.min'}))
   .pipe(gulp.dest(config.paths.path_vendor + '/js/custom/plugins'));
});