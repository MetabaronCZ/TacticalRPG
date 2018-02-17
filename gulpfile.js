const del = require('del');
const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const stylelint = require('gulp-stylelint');

const webpack = require('webpack-stream');
const runSequence = require('run-sequence');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const webpackConfig = require('./webpack.config.js');

const paths = {
	src: './src',
	dist: './dist'
};

let env = 'prod';

// set watch mode
gulp.task('set-watch', () => env = 'dev');

// clear "dist" folder
gulp.task('clear', () => del(paths.dist));

// lint LESS files
gulp.task('stylelint', () => {
	return gulp.src(`${paths.src}/css/**/*.less`)
		.pipe(stylelint({
			reporters: [
				{ formatter: 'string', console: true }
			]
		}));
});

// build CSS
gulp.task('less', ['stylelint'], () => {
	return gulp.src(`${paths.src}/css/app.less`)
		.pipe(less())
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 2 versions']
			}),
			cssnano({
				discardComments: { removeAll: true }
			})
		]))
		.pipe(gulp.dest(`${paths.dist}/css`));
});

// copy font files
gulp.task('fonts', () => {
	return gulp.src(`${paths.src}/fonts/**/*`)
		.pipe(gulp.dest(`${paths.dist}/fonts`));
});

// copy index.html
gulp.task('index', () => {
	return gulp.src(`${paths.src}/templates/index.html`)
		.pipe(gulp.dest(paths.dist));
});

// build JS
gulp.task('js', () => {
	let conf = webpackConfig(env);

	return gulp.src(`${paths.src}/app.js`)
		.pipe(webpack(conf))
		.pipe(gulp.dest(`${paths.dist}/js`));
});

// watch files and perform given tasks
gulp.task('watch', () => {
	gulp.watch(`${paths.src}/css/**/*.less`, ['less']);
	gulp.watch(`${paths.src}/fonts/**/*`, ['fonts']);
	gulp.watch(`${paths.src}/templates/**/*`, ['index']);
});

// build app
gulp.task('build', cb => {
	runSequence('clear', ['index', 'fonts', 'less', 'js'], cb);
});

// develop app
gulp.task('dev', cb => {
	// set watch before build, because "watch mode" in Webpack
	runSequence('set-watch', 'watch', 'build', cb);
});
