// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------

var gulp        = require('gulp');
var concat      = require('gulp-concat');
var plumber     = require('gulp-plumber');
var uglify      = require('gulp-uglify');
var webserver   = require('gulp-webserver');

// --------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------

var src = 'angular-fullPage.js';

var output = {
  build: 'angular-fullPage.min.js'
};

// --------------------------------------------------------------------
// Error Handler
// --------------------------------------------------------------------

var onError = function(err) {
    console.log(err);
    this.emit('end');
};

// --------------------------------------------------------------------
// Task: build
// --------------------------------------------------------------------

gulp.task('build', function() {
    return gulp.src(src)
      .pipe(plumber({
          errorHandler: onError
      }))
      .pipe(uglify())
      .pipe(concat(output.build))
      .pipe(gulp.dest(''));
});

// --------------------------------------------------------------------
// Task: serve
// --------------------------------------------------------------------

gulp.task('serve', ['serve-watch'], function() {

  //watch .scss files
	gulp.watch(src, ['serve-watch']);

  return gulp.src('sample')
    .pipe(webserver({
      livereload: true,
      open: true
    }));

});

gulp.task('serve-watch', function(){
  return gulp.src(src)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(concat(output.build))
    .pipe(gulp.dest('sample/app/directives/'));
});
