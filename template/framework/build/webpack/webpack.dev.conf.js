var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

var utils = require('./utils');
var baseWebpackConfig = require('./webpack.base.conf');

var nsWebpack = IX.ns('FPG.webpack');
var devConfig = nsWebpack.originConfig.dev;

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
	baseWebpackConfig.entry[name] = [nsWebpack.resolve('build/dev-client')]
			.concat(baseWebpackConfig.entry[name]);
});
// console.log("baseWebpackConfig", require('util').inspect(baseWebpackConfig));

module.exports = merge(baseWebpackConfig, {
	module: {
		rules: utils.styleLoaders({ sourceMap: devConfig.cssSourceMap })
	},
	// cheap-module-eval-source-map is faster for development
	devtool: '#cheap-module-eval-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': devConfig.env
		}),
		// https://github.com/glenjamin/webpack-hot-middleware#installation--usage
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		// https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: nsWebpack.prjResolve('index.html'),
			inject: true
		}),
		new FriendlyErrorsPlugin()
	]
});
