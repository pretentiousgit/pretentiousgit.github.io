// gulpfile.js
'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var addsrc = require('gulp-add-src');
var stripDebug = require('gulp-strip-debug');
var newer = require('gulp-newer');

var del = require('del');

var transform = require('vinyl-transform');

gulp.task('scripts', function () {
    return gulp.src([
        '/js/vendor/*.js'
        // ,'/js/scripts/*.js'
    ])
    .pipe(filter('*.js'))
    .pipe(uglify())
    .pipe(concat('build.js')).on('error', errorHandler)
    .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
    return gulp.src([
        '/css/*.css'
    ])
    .pipe(concat('build.css')).on('error', errorHandler)
    .pipe(gulp.dest('dist/css'));
});

gulp.task('images', function() {
    var imgDest = 'dist/images/min';
    return gulp.src('/images/*')
      .pipe(newer(imgDest)).on('error', errorHandler)
      .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })).on('error', errorHandler)
      .pipe(gulp.dest(imgDest));
});


gulp.task('clean', function(cb) {
    del(['dist/css/', 'dist/js/'], cb);
});

gulp.task('default', ['clean'], function() {
    gulp.start('css', 'images', 'scripts').on('error', errorHandler);
});

// Handle the error
function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
}