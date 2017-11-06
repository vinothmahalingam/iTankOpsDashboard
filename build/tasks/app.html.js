var gulp = require('gulp'),
    hb = require('gulp-hb'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    prettify = require('gulp-prettify'),
    config = require('../config');

gulp.task('compile-html', function () {
  return gulp
    /* handlebar page src */
    .src(config.paths.template.content_)
    .pipe(hb({
        partials: config.paths.template.partials_,
        helpers: config.paths.template.helpers_,
        data: config.paths.template.data_
    }))
    /* compile handlebars to html pages */
    .pipe(rename({
        extname: '.html'
    }))
    /* clear directory names*/
    .pipe(rename({dirname: ''}))
    /* write html files */
    .pipe(prettify({
        indent_inner_html: false,
        preserve_newlines: true,
        end_with_newline: true,
        extra_liners: ['head', 'body']
    }))
    .pipe(gulp.dest(config.paths.path_dist))
    /* refresh server once complete */
    .pipe(connect.reload());
});