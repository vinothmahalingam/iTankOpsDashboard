var gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    flatten = require('gulp-flatten'),
    gulpFilter = require('gulp-filter'),
    mainBowerFiles = require('main-bower-files'),
    config = require('../config');

gulp.task('copy-bower-files', function() {
  var jsFilter = gulpFilter(['*.js', '!*.min.js', '!index.js', '!test.js'], {restore: true}),
      cssFilter = gulpFilter(['*.css', '!*.min.css'], {restore: true}),
      fontFilter = gulpFilter(['*.otf, *.eot', '*.woff', '*.woff2', '*.svg', '*.ttf'], {restore: true});

  return gulp.src(mainBowerFiles())
    // grab vendor js files from bower_components, minify and push in /public
    .pipe(jsFilter)
    .pipe(gulp.dest(config.paths.path_vendor + '/js/'))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(config.paths.path_vendor + '/js/'))
    .pipe(jsFilter.restore)
    // grab vendor css files from bower_components, minify and push in /public
    .pipe(cssFilter)
    .pipe(gulp.dest(config.paths.path_vendor + '/css/'))
    .pipe(cssnano())
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest(config.paths.path_vendor + '/css/'))
    .pipe(cssFilter.restore)
    // grab vendor font files from bower_components and push in /public
    .pipe(fontFilter)
    .pipe(flatten())
    .pipe(gulp.dest(config.paths.fonts_path_dist));
});