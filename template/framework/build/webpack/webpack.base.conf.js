var utils = require('./utils');
var resolver = require('./resolver');

var assetsConfig = utils.assetsConfig;
var vueLoaderConfig = utils.vueLoaderConfig;

var nsWebpack = IX.ns('FPG.webpack');
var buildConfig = nsWebpack.originConfig.build;
var resolve = nsWebpack.resolve;
var prjResolve = nsWebpack.prjResolve;

var shareDir = resolve('share');
var srcDir = prjResolve('src');

module.exports = {
	entry: {
		app: prjResolve('src/main.js')
	},
	output: {
		path: buildConfig.assetsRoot,
		filename: '[name].js',
		publicPath: nsWebpack.assetsPublicPath
	},
	resolve: resolver.srcResolve4Project(prjResolve),
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: vueLoaderConfig
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			include: [srcDir, shareDir]
		}, {
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url-loader',
			query: {
				limit: 10000,
				name: assetsConfig.images
			}
		}, {
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			query: {
				limit: 10000,
				name: assetsConfig.fonts
			}
		}]
	}
};
