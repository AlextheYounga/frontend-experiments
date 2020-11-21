const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const gulpSequence = require('gulp-sequence')
const livereload = require('gulp-livereload');

gulp.task('icons', () => {
	return gulp
		.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
		.pipe(gulp.dest('public/fonts/'))
});

gulp.task('styles', () => {
	return gulp
		.src('scss/app.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest('public/css/'));
});

gulp.task('watch', function () {
	livereload.listen();
	gulp.watch('scss/**/*.scss', ['icons', 'styles']);
});

gulp.task('clean', () => {
	return del([
		'public/css',
		'public/fonts'
	]);
});

gulp.task('default', gulpSequence('clean', 'icons', 'styles'));