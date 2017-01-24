var gulp = require('gulp'),
    rename = require('gulp-rename'),
    config = require('../config');

gulp.task('copy-favicon', function() {
    gulp.src(config.paths.path_src + '*.ico')
   .pipe(rename({dirname: ''}))
   .pipe(gulp.dest(config.paths.path_dist));
});