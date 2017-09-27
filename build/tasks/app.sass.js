var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    sourcemaps = require('gulp-sourcemaps'),
    //csscomb = require('gulp-csscomb'),
    rename = require('gulp-rename'),
	config = require('../config')

	sassOptions = {
      errLogToConsole: true,
      outputStyle: 'expanded'
    };

gulp.task('compile-sass', function () {
  return gulp.src(config.paths.scss_path_src)
    /* initialize sourcemaps */
    .pipe(sourcemaps.init())
    /* helper for importing mutiple files using astrix(*) */
    .pipe(sassGlob())
    /* compile SASS to CSS */
    .pipe(sass(sassOptions).on('error', sass.logError))
    /* remove any dir and paths */
    .pipe(rename({dirname: ''}))
    /* write sourcemaps*/
    .pipe(sourcemaps.write('./'))
    /* clean CSS files for readibility */
    //.pipe(csscomb()) //FYI...causes issues with sourcemaps
    /* write CSS to dist */
    .pipe(gulp.dest(config.paths.scss_path_build));
});
