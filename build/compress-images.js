var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var build = require('./build');

gulp.task('compress-images', function () {

	console.log('==================> Compressing all images');

	gulp.src(build.config.path.src+'/img/**/*')
		.pipe(imagemin())
	    .pipe(gulp.dest(build.config.dist.theme.path+'/img/'));
});