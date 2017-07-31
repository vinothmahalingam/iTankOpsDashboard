var gulp = require('gulp'),
    rename = require('gulp-rename'),
    config = require('../config');

gulp.task('copy-lang', function() {
    gulp.src(config.paths.path_custom + '/lang/*.json')
   .pipe(rename({dirname: ''}))
   .pipe(gulp.dest(config.paths.lang_path_dist));
});