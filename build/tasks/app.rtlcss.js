var gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    rtlcss = require('gulp-rtlcss'),
    rename = require('gulp-rename'),
    config = require('../config');

    cssnanoOptions = {
      zindex: false,
      colormin: false
    };

gulp.task('rtlcss', function () {
  return gulp.src([config.paths.scss_path_build + '/*.css', '!' + config.paths.scss_path_build + '/*.min.css'])
    /* rename with '.min' suffix */
    .pipe(rename({suffix: '-rtl'}))
    /* minify CSS with options */
    .pipe(cssnano(cssnanoOptions))
    /* write minified CSS */
    .pipe(gulp.dest(config.paths.scss_path_build))
});