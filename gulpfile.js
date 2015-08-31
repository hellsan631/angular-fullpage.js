// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------

var gulp        = require('gulp');
var concat      = require('gulp-concat');
var plumber     = require('gulp-plumber');
var uglify      = require('gulp-uglify');
var webserver   = require('gulp-webserver');

// --------------------------------------------------------------------
// Settings{ base: 'src' }
// --------------------------------------------------------------------

var src = {
  build: [
    'angular-fullPage.js'
  ]
};

var output = {
  build: '/',
  build_js: 'angular-fullPage.min.js'
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
    return gulp.src(src.build)
      .pipe(plumber({
          errorHandler: onError
      }))
      .pipe(uglify())
      .pipe(concat(output.build_js))
      .pipe(gulp.dest(output.build));
});

// --------------------------------------------------------------------
// Task: serve
// --------------------------------------------------------------------

gulp.task('serve', ['serve-watch'], function() {

  //watch .scss files
	gulp.watch('angular-fullPage.js', ['serve-watch']);

  return gulp.src('sample')
    .pipe(webserver({
      livereload: true,
      open: true
    }));

});

gulp.task('serve-watch', function(){
  return gulp.src(src.build)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(uglify())
    .pipe(concat(output.build_js))
    .pipe(gulp.dest('sample/app/directives/'+output.build));
});
