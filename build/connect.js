var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: 'dist/',
    livereload: true,
    port: 4000,
    fallback: 'dist/intel_analytics_dashboard.html'
  });
})