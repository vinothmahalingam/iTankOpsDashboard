var gulp = require('gulp'),
    concat = require('gulp-concat'),
    csscomb = require('gulp-csscomb'),
    config = require('../config');



gulp.task('compile-vendor-style-bundle', ['compile-sass'], function () {
    return gulp.src([ 
      config.paths.scss_path_build + '/bootstrap.css',  
      config.paths.scss_path_build + '/fontawesome.css',  
      config.paths.scss_path_build + '/fa-light.css', 
      config.paths.scss_path_build + '/ng-icons.css',
      config.paths.scss_path_build + '/spinkit.css',
      config.paths.scss_path_build + '/ripple.css'
    ])
    /* concatinate all required vendor and app core files */
    .pipe(concat('app.vendor.bundle.css'))
    /* clean CSS files for readibility */
    .pipe(csscomb())
    /* write to dist */
    .pipe(gulp.dest(config.paths.scss_path_build))
});