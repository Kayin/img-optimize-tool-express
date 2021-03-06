var gulp       = require('gulp'),
    nodemon    = require('gulp-nodemon'),
    plumber    = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    sass       = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  gulp.src('./sass/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./public/css/'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./sass/*.scss', ['sass']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js nunjucks coffee md css',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'sass',
  'develop',
  'watch'
]);
