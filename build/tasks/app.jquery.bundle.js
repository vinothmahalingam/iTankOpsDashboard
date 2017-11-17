var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    config = require('../config');

gulp.task('compile-app-core-jquery-bundle', function(){
    return gulp.src([
      config.paths.path_bower + '/jquery/dist/jquery.js',  
      config.paths.path_custom + '/plugins/jquery-ui-cust/jquery-ui-cust.js'
    ])
    /* compile source maps */
    .pipe(sourcemaps.init())
    /* concatinate all crequired vendor and app core files */
    .pipe(concat('app.core-jquery-jqueryui-bundle.js'))
    /* write to dist */
    .pipe(gulp.dest(config.paths.js_path_build))
    /* copy and rename file */
    .pipe(rename('app.core-jquery-jqueryui-bundle.js.min.js'))
    /* minify concatinated file reducing filesize */
    .pipe(uglify())
    /* comple source maps */
    .pipe(sourcemaps.write('./'))
    /* write to dist */
    .pipe(gulp.dest(config.paths.js_path_dist))
    /* reload server once complete */
    .pipe(connect.reload())
});