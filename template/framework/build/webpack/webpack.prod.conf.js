var webpack = require('webpack');
var merge = require('webpack-merge');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

var utils = require('./utils');
var baseWebpackConfig = require('./webpack.base.conf');

var assetsConfig = utils.assetsConfig;

var nsWebpack = IX.ns('FPG.webpack');
var buildConfig = nsWebpack.originConfig.build;
var ifSourceMap = buildConfig.productionSourceMap;
var resolve = nsWebpack.resolve;
var prjResolve = nsWebpack.prjResolve;

var webpackConfig = merge(baseWebpackConfig, {
	module: {
		rules: utils.styleLoaders({
			sourceMap: ifSourceMap,
			extract: true
		})
	},
	devtool: ifSourceMap ? '#source-map' : false,
	output: {
		path: buildConfig.assetsRoot,
		filename: assetsConfig.js,
		chunkFilename: assetsConfig.jsChunk
	},
	plugins: [
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin({ 'process.env': buildConfig.env }),
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false },
			sourceMap: true
		}),
		// extract css into its own file
		new ExtractTextPlugin({ filename: assetsConfig.css }),
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		new OptimizeCSSPlugin(),
		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: buildConfig.index,
			template: prjResolve('index.html'),
			inject: true,
			minify: {
				removeComments: true,
				// collapseWhitespace: true,
				removeAttributeQuotes: true
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
			chunksSortMode: 'dependency'
		}),
		// split vendor js into its own file
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module) {
				// any required modules inside node_modules are extracted to vendor
				return (
					module.resource &&
					/\.js$/.test(module.resource) &&
					module.resource.indexOf(resolve('../node_modules')) === 0
				);
			}
		}),
		// extract webpack runtime and module manifest to its own file in order to
		// prevent vendor hash from being updated whenever app bundle is updated
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: ['vendor']
		}),
		// copy custom static assets
		new CopyWebpackPlugin([{
			from: prjResolve('static'),
			to: buildConfig.assetsSubDirectory,
			ignore: ['.*']
		}])
	]
});

if (buildConfig.productionGzip) {
	var CompressionWebpackPlugin = require('compression-webpack-plugin');

	webpackConfig.plugins.push(new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				buildConfig.productionGzipExtensions.join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
	}));
}

if (buildConfig.bundleAnalyzerReport) {
	var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

	webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
