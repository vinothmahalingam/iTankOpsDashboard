var gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
    config = require('../config');

gulp.task('img-min', function () {
  return gulp
    .src(config.paths.img_path_src + '/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest(config.paths.img_path_dist))
});