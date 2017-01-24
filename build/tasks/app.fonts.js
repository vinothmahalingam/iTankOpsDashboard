var gulp = require('gulp'),
    rename = require('gulp-rename'),
    config = require('../config');

gulp.task('copy-cust-fonts', function() {
    gulp.src(config.paths.path_custom + '/fonts/**/*.{otf,ttf,woff,woff2,eot,svg}')
   .pipe(rename({dirname: ''}))
   .pipe(gulp.dest(config.paths.fonts_path_dist));
});