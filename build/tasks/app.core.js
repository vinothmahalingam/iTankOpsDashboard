var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    config = require('../config');

gulp.task('compile-app-core', function(){
    return gulp.src([
      /* app core modules */
      config.paths.js_path_src_config + 'app.config.js',
      //config.paths.js_path_src_module + 'app.ngmenu.js',
      config.paths.js_path_src_module + 'app.init.js', 
      config.paths.js_path_src_module + 'app.resize.trigger.js', 
      config.paths.js_path_src_module + 'app.scroll.trigger.js',
      config.paths.js_path_src_module + 'app.domReady.js',
      config.paths.js_path_src_module + 'app.orientationchange.js',
      config.paths.js_path_src_module + 'app.window.load.js'
    ])
    /* compile source maps */
    .pipe(sourcemaps.init())
    /* concatinate all crequired vendor and app core files */
    .pipe(concat('app.core.js'))
    /* write to dist */
    .pipe(gulp.dest(config.paths.js_path_build))
    /* copy and rename file */
    .pipe(rename('app.core.min.js'))
    /* minify concatinated file reducing filesize */
    .pipe(uglify())
    /* comple source maps */
    .pipe(sourcemaps.write('./'))
    /* write to dist */
    .pipe(gulp.dest(config.paths.js_path_dist))
    /* reload server once complete */
    .pipe(connect.reload())
});