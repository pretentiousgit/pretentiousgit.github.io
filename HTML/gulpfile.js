// gulpfile.js

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    // notify = require('gulp-notify'),
    fileinclude = require('gulp-file-include');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('buildHTML', function(){
    gulp.src(['index.html', 'about.html', 'contact.html', 'doctor.html', 'appointments.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./build'));
});

 // Watch files for changes
gulp.task('watch', function() {
    gulp.watch('./', ['buildHTML']);
});