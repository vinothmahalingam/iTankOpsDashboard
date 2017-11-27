var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    config = require('../config');

gulp.task('compile-app-core-plugins', function(){
    return gulp.src([
      config.paths.path_bower + 'jquery-slimscroll/jquery.slimscroll.js',    
      config.paths.path_bower + 'nextgen-navigation/jquery.nextgen-navigation.js', 
      config.paths.path_bower + 'jquery-lazy/jquery.lazy.js ',  
      config.paths.path_bower + 'legitripple/js/ripple.js ',
      config.paths.path_bower + 'jquery-throttle-debounce/jquery.ba-throttle-debounce.js ',
      config.paths.path_custom + 'plugins/jquery-snippets/jquery-snippets.js'
    ])
    /* compile source maps */
    .pipe(sourcemaps.init())
    /* concatinate all required vendor and app core files */
    .pipe(concat('app.core.plugins.js'))
    /* write to dist */
    .pipe(gulp.dest(config.paths.js_path_build))
    /* copy and rename file */
    .pipe(rename('app.core.plugins.min.js'))
    /* minify concatinated file reducing filesize */
    .pipe(uglify())
    /* comple source maps */
    .pipe(sourcemaps.write('./'))
    /* write to dist */
    .pipe(gulp.dest(config.paths.js_path_dist))
    /* reload server once complete */
    .pipe(connect.reload())
});