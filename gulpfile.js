var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});


var imageop = require('gulp-image-optimization');

gulp.task('images', function(cb) {
    gulp.src(['_src/images/**/*.png','_src/images/**/*.jpg','_src/images/**/*.gif','_src/images/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('images')).on('end', cb).on('error', cb);
});