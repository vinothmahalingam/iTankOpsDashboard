"use strict";

var gulp = require('gulp'); 
var requireDir = require('require-dir');
var connect = require('gulp-connect');
var config = require('./build/config');

/**
 * load all tasks from the tasks dir
 */
requireDir('./build/tasks/');

/**
 * run and watch file changes
 */
gulp.task('watch', function() {
    // watch `.scss` changes
    gulp.watch(['./src/**/*.scss'], ['compile-sass','cssnano'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    // watch `.js` changes & avoiding `.min.js`
    gulp.watch(['./src/js/**/*.js', '!./src/js/**/*.min.js', '!./src/js/build/myapp.core.js'], ['compile-app-core', 'compile-app-core-plugins'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    // watch `.hbs` changes and compile new pages
    gulp.watch([config.paths.path_src + '**/*.hbs'], ['compile-html'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

// 
/**
 * task registery
 */
gulp.task('default', ['compile-sass', 'cssnano', 'compile-app-core', 'connect', 'watch']);
gulp.task('build-sass', ['compile-sass', 'cssnano', 'connect', 'compile-html', 'watch']);
gulp.task('build', ['compile-sass', 'cssnano', 'compile-app-jquery-bundle', 'compile-bootstrap-bundle', 'compile-app-core-plugins', 'compile-app-core', 'connect', 'compile-html', 'img-min', 'copy-cust-fonts', 'copy-cust-plugins', 'copy-bower-files', 'copy-favicon', 'copy-video', 'copy-lang', 'watch']);