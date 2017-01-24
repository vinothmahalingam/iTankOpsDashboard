var gulp = require('gulp'),
    rename = require('gulp-rename'),
    config = require('../config');

gulp.task('copy-video', function() {
    gulp.src(config.paths.path_custom + '/video/*.{mp4,webm}')
   .pipe(rename({dirname: ''}))
   .pipe(gulp.dest(config.paths.video_path_dist));
});