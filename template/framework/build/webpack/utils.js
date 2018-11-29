var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var nsWebpack = IX.ns('FPG.webpack');

function assetsPath(_path) {
	return path.posix.join(nsWebpack.assetsSubDirectory, _path);
}

exports.assetsConfig = {
	images: assetsPath('img/[name].[hash:7].[ext]'),
	fonts: assetsPath('fonts/[name].[hash:7].[ext]'),
	css: assetsPath('css/[name].[contenthash].css'),
	js: assetsPath('js/[name].[chunkhash].js'),
	jsChunk: assetsPath('js/[id].[chunkhash].js')
};

function cssLoaders(options) {
	options = options || {};

	var cssLoader = {
		loader: 'css-loader',
		options: {
			minimize: nsWebpack.isProduction,
			sourceMap: options.sourceMap
		}
	};

	// generate loader string to be used with extract text plugin
	function generateLoaders(loader, loaderOptions) {
		var loaders = [cssLoader];
		if (loader) {
			loaders.push({
				loader: loader + '-loader',
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap
				})
			});
		}

		// Extract CSS when that option is specified
		// (which is the case during production build)
		return options.extract ? ExtractTextPlugin.extract({
			use: loaders,
			fallback: 'vue-style-loader'
		}) : ['vue-style-loader'].concat(loaders);
	}

	// http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		less: generateLoaders('less'),
		sass: generateLoaders('sass', { indentedSyntax: true }),
		scss: generateLoaders('sass'),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus')
	};
}
exports.cssLoaders = cssLoaders;

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
	var output = [];
	var loaders = cssLoaders(options);
	for (var extension in loaders) {
		var loader = loaders[extension];
		output.push({
			test: new RegExp('\\.' + extension + '$'),
			use: loader
		});
	}
	return output;
};

exports.vueLoaderConfig = {
	loaders: cssLoaders({
		sourceMap: nsWebpack.cssSourceMap,
		extract: nsWebpack.isProduction
	}),
	postcss: [autoprefixer({ browsers: ['last 2 versions'] })]
};