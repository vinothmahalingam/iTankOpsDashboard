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
      /* pace.js */  
      config.paths.path_bower + '/pace/pace.js',  
      /* jquery bundle */
      config.paths.path_bower + '/jquery/dist/jquery.js',  
      config.paths.path_custom + '/plugins/jquery-ui-cust/jquery-ui-cust.js',
      /* bootstrap bundle */  
      config.paths.path_bower + '/popper.js/dist/umd/popper.js',  
      config.paths.path_bower + '/bootstrap/dist/js/bootstrap.js',
      /* app core */
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