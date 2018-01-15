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
    gulp.watch(['./src/**/*.scss'], ['cssnano'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    // watch `.js` changes & avoiding `.min.js`
    gulp.watch(['./src/js/**/*.js', '!./src/js/**/*.min.js'], ['compile-app-core'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    // watch `.hbs` changes and compile new pages
    gulp.watch([config.paths.path_src + '**/*.hbs'], ['compile-html'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

/**
 * task registery
 */
gulp.task('build', [ 'compile-sass', 
                     'compile-vendor-style-bundle',
                     'cssnano',
                     'compile-html', 
                     'compile-vendor-script-bundle', 
                     'compile-app-core', 
                     'img-min', 
                     'copy-json',
                     'copy-cust-fonts', 
                     'copy-cust-plugins', 
                     'copy-favicon', 
                     'copy-video', 
                     'copy-lang',
                     'connect', 
                     'watch']);