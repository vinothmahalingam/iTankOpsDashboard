var gulp = require('gulp'),
    handlebars = require('gulp-compile-handlebars'),
    layouts = require('handlebars-layouts'),
    hb = require('gulp-hb'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    prettify = require('gulp-html-prettify'),
    config = require('../config');

gulp.task('compile-html', function () {
  return gulp
    /* handlebar page src */
    .src(config.paths.path_src + 'pages/**/*.hbs')
    .pipe(hb({
        partials: config.paths.path_src + 'partials/**/*.hbs',
        helpers: config.paths.path_src + 'partials/_helpers/*.js',
        data: [config.paths.path_src + 'partials/_data/*.{js,json}']
    }))
    /* compile handlebars to html pages */
    .pipe(rename({
        extname: '.html'
    }))
    /* clear directory names*/
    .pipe(rename({dirname: ''}))
    /* write html files */
    //.pipe(prettify())
    .pipe(gulp.dest(config.paths.path_dist))
    /* refresh server once complete */
    .pipe(connect.reload());
});