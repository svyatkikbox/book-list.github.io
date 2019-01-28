
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	browserSync = require('browser-sync'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify');

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: './'
		},
		notify: false,
	})
});

gulp.task('scripts', function () {
	return gulp.src(['main.js'])
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('code', function () {
	return gulp.src('index.html')
		.pipe(browserSync.reload({
			stream: true
		}))
});


gulp.task('watch', function () {
	gulp.watch(['main.js'], gulp.parallel('scripts'));
	gulp.watch('index.html', gulp.parallel('code'))
});

gulp.task('default', gulp.parallel('watch', 'browser-sync'));