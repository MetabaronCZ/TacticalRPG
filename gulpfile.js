const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const webpack = require('webpack');
const cssnano = require('cssnano');
const svgmin = require('gulp-svgmin');
const changed = require('gulp-changed');
const postcss = require('gulp-postcss');
const stylelint = require('gulp-stylelint');
const autoprefixer = require('autoprefixer');

const webpackConfig = require('./webpack.config.js');
const cssnanoConfig = { discardComments: { removeAll: true } };
const stylelintConfig = { reporters: [{ formatter: 'string', console: true }] };

const pathSrc = './src';
const pathDist = './dist';

const paths = {
	styles: {
		src: `${pathSrc}/styles/app.scss`,
		files: `${pathSrc}/styles/**/*.scss`,
		dist: `${pathDist}/styles`
	},
	scripts: {
		src: `${pathSrc}/scripts/index.tsx`,
		files: `${pathSrc}/scripts/**/*.(ts|tsx)`,
		dist: `${pathDist}/scripts`
	},
	fonts: {
		src: `${pathSrc}/fonts`,
		files: `${pathSrc}/fonts/**/*`,
		dist: `${pathDist}/fonts`
	},
	images: {
		src: `${pathSrc}/images`,
		files: {
			all: `${pathSrc}/images/**/*`,
			img: `${pathSrc}/images/**/*.{jpg, png, gif}`,
			ico: `${pathSrc}/images/**/*.svg`
		},
		dist: `${pathDist}/images`
	},
	templates: {
		src: `${pathSrc}/templates/index.html`,
		files: `${pathSrc}/templates/**/*.html`,
		dist: pathDist
	}
};

let env = 'prod';

// clear "dist" folder
const taskClear = () => del(pathDist);

// lint SASS files
const taskStylelint = () => {
	return gulp.src(paths.styles.files)
		.pipe(changed(paths.styles.dist))
		.pipe(stylelint(stylelintConfig));
};

// build CSS
const taskStyles = () => {
	return gulp.src(paths.styles.src)
		.pipe(changed(paths.styles.dist))
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			autoprefixer(),
			cssnano(cssnanoConfig)
		]))
		.pipe(gulp.dest(paths.styles.dist));
};

// copy font files
const taskFonts = () => {
	return gulp.src(paths.fonts.files)
		.pipe(changed(paths.fonts.dist))
		.pipe(gulp.dest(paths.fonts.dist));
};

// copy images
const taskImages = () => {
	return gulp.src(paths.images.files.img)
		.pipe(changed(paths.images.dist))
		.pipe(gulp.dest(paths.images.dist));
};

// copy / optimize icos
const taskIcos = () => {
	return gulp.src(paths.images.files.ico)
		.pipe(changed(paths.images.dist))
		.pipe(svgmin())
		.pipe(gulp.dest(paths.images.dist));
};

// copy index.html
const taskIndex = () => {
	return gulp.src(paths.templates.files)
		.pipe(changed(paths.templates.dist))
		.pipe(gulp.dest(paths.templates.dist));
};

// build JS
const taskScripts = cb => {
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
};

// watch files and perform given tasks
const taskWatch = cb => {
	env = 'dev';
	gulp.watch(paths.templates.files, taskIndex);
	gulp.watch(paths.styles.files, gulp.series(taskStylelint, taskStyles));
	gulp.watch(paths.fonts.files, taskFonts);
	gulp.watch(paths.images.files.ico, taskIcos);
	gulp.watch(paths.images.files.img, taskImages);
	cb();
};

// build app
const build = gulp.series(taskClear, taskIndex, taskFonts, taskImages, taskIcos, taskStylelint, taskStyles, taskScripts);

// develop app (set watch before build, because "watch mode" in Webpack)
const dev = gulp.series(taskWatch, build);

module.exports = { build, dev };
