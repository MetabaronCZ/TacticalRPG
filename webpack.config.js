const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const pathSrc = './src/scripts';
const pathDist = path.resolve(__dirname, './dist/scripts');
const pathPublic = './scripts/';
const pathModules = './node_modules';
const pathCache = 'node_modules/.cache';

module.exports = env => {
	let mode = 'production';
	let watch = false;
	let devtool = false;

	if ( 'dev' === env ){
		mode = 'development';
		watch = true;
		devtool = 'inline-source-map';
	}

	return {
		entry: {
			app: `${pathSrc}/index`
		},
		output: {
			path: pathDist,
			publicPath: pathPublic,
			filename: '[name].js'
		},
		target: 'web',
		mode,
		watch,
		devtool,
		module: {
			rules: [
				{
					test: /\.[jt]sx?$/,
					use: [
						{
							loader: 'awesome-typescript-loader',
							options: {
								useBabel: true,
								useCache: true,
								babelCore: '@babel/core',
								cacheDirectory: `${pathCache}/awesome-typescript-loader`
							}
						}
					],
					include: path.resolve(pathSrc),
					exclude: /node_modules/
				},
				{
					test: /\.[jt]sx?$/,
					enforce: 'pre',
					use: ['eslint-loader'],
					exclude: /node_modules/
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js'],
			modules: [
				path.resolve(pathSrc),
				path.resolve(pathModules)
			]
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					libs: {
						// node modules imported non-dynamically
						name: 'libs',
						chunks: 'initial',
						test: /node_modules/
					}
				}
			},
			minimizer: [
				new UglifyJsPlugin({
					cache: true,
					parallel: true
				})
			]
		},
		performance: {
			hints: false
		}
	};
};
