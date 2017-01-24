var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    bytediff = require('gulp-bytediff'),
    connect = require('gulp-connect'),
    config = require('../config');

    cssnanoOptions = {
      zindex: false,
      colormin: false
    },

    cleanCSSOptions = {
      advanced: false
    };

gulp.task('cssnano', ['compile-sass'], function () {
  return gulp.src([config.paths.scss_path_build + '/*.css', '!' + config.paths.scss_path_build + '/*.min.css'])
    /* rename with '.min' suffix */
    .pipe(rename({suffix: '.min'}))
    /* start byte size calculation*/
    .pipe(bytediff.start())
    /* minify CSS with options */
    .pipe(cssnano(cssnanoOptions))
    /* stop byte size calculation and log result */
    .pipe(bytediff.stop())
    /* write sourcemaps */
    .pipe(sourcemaps.write('./'))
    /* write minified CSS */
    .pipe(gulp.dest(config.paths.scss_path_build))
    /* reload server once complete */
    .pipe(connect.reload());
});