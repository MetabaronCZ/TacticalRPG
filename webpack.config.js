const webpack = require('webpack');
const path = require('path');

const pathSrc = './src/scripts';
const pathDist = './dist/scripts';
const pathModules = './node_modules';

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
			path: path.resolve(__dirname, pathDist),
			filename: '[name].js'
		},
		mode,
		watch,
		devtool,
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: ['babel-loader','ts-loader'],
					include: path.resolve(pathSrc)
				},
				{
					test: /\.tsx?$/,
					enforce: 'pre',
					use: ['tslint-loader']
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
				name: 'libs',
				chunks: 'all'
			}
		},
		performance: {
			hints: false
		}
	};
};
