const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {
	let watch = false;
	let devtool = false;

	let plugins = [
		new webpack.optimize.CommonsChunkPlugin('libs')
	];

	if ( 'dev' === env ){
		// DEV
		watch = true;
		devtool = 'inline-source-map';
		plugins.push(new webpack.NamedModulesPlugin());

	} else {
		// PROD
		plugins.push(new UglifyJSPlugin());

		plugins.push(
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production')
				}
			})
		);
	}

	return {
		entry: {
			app: './src/js/app',
			libs: ['react', 'react-dom', 'redux', 'react-redux', 'react-router', 'react-router-dom', 'uuid']
		},
		output: {
			path: path.resolve(__dirname, 'dist/js'),
			filename: '[name].js'
		},
		watch: watch,
		devtool: devtool,
		module: {
			rules: [
				{
					test: /\.[jt]sx?$/,
					loaders: ['babel-loader','ts-loader'],
					include: path.resolve('./src/js')
				},
				{
					test: /\.tsx?$/,
					enforce: 'pre',
					loader: 'tslint-loader'
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'eslint-loader'
				}
			]
		},
		plugins: plugins,
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
			modules: [
				path.resolve('./src/js'),
				path.resolve('./node_modules')
			]
		}
	};
};
