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

const pathSrc = './src';
const pathDist = './dist';

const paths = {
	styles: {
		src: `${pathSrc}/styles/app.less`,
		files: `${pathSrc}/styles/**/*.less`,
		dist: `${pathDist}/styles`
	},
	scripts: {
		src: `${pathSrc}/scripts/index.tsx`,
		files: `${pathSrc}/scripts/**/*.tsx?`,
		dist: `${pathDist}/scripts`
	},
	fonts: {
		src: `${pathSrc}/`,
		files: `${pathSrc}/fonts/**/*`,
		dist: `${pathDist}/fonts`
	},
	templates: {
		src: `${pathSrc}/templates/index.html`,
		files: `${pathSrc}/templates/**/*.html`,
		dist: pathDist
	}
};

let env = 'prod';

// set watch mode
gulp.task('set-watch', () => env = 'dev');

// clear "dist" folder
gulp.task('clear', () => del(pathDist));

// lint LESS files
gulp.task('stylelint', () => {
	return gulp.src(paths.styles.files)
		.pipe(stylelint({
			reporters: [
				{ formatter: 'string', console: true }
			]
		}));
});

// build CSS
gulp.task('styles', ['stylelint'], () => {
	return gulp.src(paths.styles.src)
		.pipe(less())
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 2 versions']
			}),
			cssnano({
				discardComments: { removeAll: true }
			})
		]))
		.pipe(gulp.dest(paths.styles.dist));
});

// copy font files
gulp.task('fonts', () => {
	return gulp.src(paths.fonts.files)
		.pipe(gulp.dest(paths.fonts.dist));
});

// copy index.html
gulp.task('index', () => {
	return gulp.src(paths.templates.files)
		.pipe(gulp.dest(paths.templates.dist));
});

// build JS
gulp.task('scripts', () => {
	let conf = webpackConfig(env);

	return gulp.src(paths.scripts.src)
		.pipe(webpack(conf))
		.pipe(gulp.dest(paths.scripts.dist));
});

// watch files and perform given tasks
gulp.task('watch', () => {
	gulp.watch(paths.templates.files, ['index']);
	gulp.watch(paths.styles.files, ['styles']);
	gulp.watch(paths.fonts.files, ['fonts']);
});

// build app
gulp.task('build', cb => {
	runSequence('clear', ['index', 'fonts', 'styles', 'scripts'], cb);
});

// develop app
gulp.task('dev', cb => {
	// set watch before build, because "watch mode" in Webpack
	runSequence('set-watch', 'watch', 'build', cb);
});
