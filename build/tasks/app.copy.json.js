var gulp = require('gulp'),
    rename = require('gulp-rename'),
    config = require('../config');

gulp.task('copy-json', function() {
    gulp.src(config.paths.path_custom + '/webfonts/**/*.json')
   .pipe(rename({dirname: ''}))
   .pipe(gulp.dest(config.paths.path_dist));
});