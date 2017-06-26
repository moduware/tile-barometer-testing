var gulp = require('gulp');
var zip = require('gulp-zip');
const fs = require('fs');
const rimraf = require('rimraf');

const package = JSON.parse(fs.readFileSync('./package.json'));

gulp.task('build', function() {
	if(package.buildFiles == null) {
		console.error('Build files not declared in package.json');
		return;
	}
	// Removing build folder first
	rimraf('build', function () { 
		gulp.src(package.buildFiles, {base: '.'})
			.pipe(gulp.dest('build/'));					
	});
});

gulp.task('zip', function () {
    return gulp.src(['build/**'])
        .pipe(zip('tile.zip'))
        .pipe(gulp.dest('./'));
});
