var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    config = require('../config');

gulp.task('compile-vendor-script-bundle', function(){
    return gulp.src([
      config.paths.path_node_modules + '/pace/pace.js',  
      config.paths.path_node_modules + '/jquery/dist/jquery.js',  
      config.paths.path_custom + '/plugins/jquery-ui-cust/jquery-ui-cust.js',
      config.paths.path_node_modules + '/popper.js/dist/umd/popper.js',  
      config.paths.path_node_modules + '/bootstrap/dist/js/bootstrap.js',
      config.paths.path_node_modules + 'jquery-slimscroll/jquery.slimscroll.js',    
      config.paths.path_node_modules + 'jquery-lazy/jquery.lazy.js ',  
      config.paths.path_node_modules + 'legit-ripple/js/ripple.js ',
      config.paths.path_node_modules + 'jquery-throttle-debounce/jquery.ba-throttle-debounce.js ',
      config.paths.path_custom + 'plugins/smartpanels/smartpanels.js',
      //config.paths.path_custom + 'plugins/material-forms/material-forms.js',
      config.paths.path_node_modules + 'jquery-snippets.js/js/jquery-snippets.js'
    ])
    /* compile source maps */
    .pipe(sourcemaps.init())
    /* concatinate all required vendor and app core files */
    .pipe(concat('app.vendor.bundle.js'))
    /* write to dist */
    .pipe(gulp.dest(config.paths.js_path_build))
    /* copy and rename file */
    .pipe(rename('app.vendor.bundle.min.js'))
    /* minify concatinated file reducing filesize */
    .pipe(uglify())
    /* comple source maps */
    .pipe(sourcemaps.write('./'))
    /* write to dist */
    .pipe(gulp.dest(config.paths.js_path_dist))
    /* reload server once complete */
    .pipe(connect.reload())
});