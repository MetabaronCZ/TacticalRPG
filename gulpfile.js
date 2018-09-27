const del = require('del');
const gulp = require('gulp');
const less = require('gulp-less');
const webpack = require('webpack');
const cssnano = require('cssnano');
const changed = require('gulp-changed');
const postcss = require('gulp-postcss');
const stylelint = require('gulp-stylelint');
const runSequence = require('run-sequence');
const autoprefixer = require('autoprefixer');

const webpackConfig = require('./webpack.config.js');
const cssnanoConfig = { discardComments: { removeAll: true } };
const stylelintConfig = { reporters: [{ formatter: 'string', console: true }] };

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
		files: `${pathSrc}/scripts/**/*.(ts|tsx)`,
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
		.pipe(changed(paths.styles.dist))
		.pipe(stylelint(stylelintConfig));
});

// build CSS
gulp.task('styles', ['stylelint'], () => {
	return gulp.src(paths.styles.src)
		.pipe(changed(paths.styles.dist))
		.pipe(less())
		.pipe(postcss([
			autoprefixer(),
			cssnano(cssnanoConfig)
		]))
		.pipe(gulp.dest(paths.styles.dist));
});

// copy font files
gulp.task('fonts', () => {
	return gulp.src(paths.fonts.files)
		.pipe(changed(paths.fonts.dist))
		.pipe(gulp.dest(paths.fonts.dist));
});

// copy index.html
gulp.task('index', () => {
	return gulp.src(paths.templates.files)
		.pipe(changed(paths.templates.dist))
		.pipe(gulp.dest(paths.templates.dist));
});

// build JS
gulp.task('scripts', cb => {
	const conf = webpackConfig(env);
	let isFirstRun = true;

	webpack(conf, (err, stats) => {
		if (err) {
			console.error(err.stack || err);

			if (err.details) {
				console.error(err.details);
			}
			return (isFirstRun ? cb() : undefined);
		}
		console.log(
			stats.toString({
				colors: true,
				hash: false,
				modules: false
			})
		);
		console.log('-----------------------------------');
		console.log('✓  Build finished\n');

		if (isFirstRun) {
			isFirstRun = false;
			cb();
		}
	});
});

// watch files and perform given tasks
gulp.task('watch', () => {
	gulp.watch(paths.templates.files, ['index']);
	gulp.watch(paths.styles.files, ['styles']);
	gulp.watch(paths.fonts.files, ['fonts']);
});

// build app
gulp.task('build', cb => {
	runSequence('clear', 'index', 'fonts', 'styles', 'scripts', cb);
});

// develop app
gulp.task('dev', cb => {
	// set watch before build, because "watch mode" in Webpack
	runSequence('set-watch', 'watch', 'build', cb);
});
