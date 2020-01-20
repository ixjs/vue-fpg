require('./check-versions')();

var opn = require('opn');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var proxyMiddleware = require('http-proxy-middleware');

var utils = require('../lib/node/utils');
var testman = require('./testman');

var projectFolder = process.argv[2];
var devConfig = utils.getProjectConfig(projectFolder, 'dev');
if (!devConfig)
	return;

var prjResolve = utils.getProjectResolve(projectFolder);
var webpackConfig = require('./webpack/webpack.dev.conf');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || devConfig.port;
// automatically open browser, if not set will be false
var autoOpenBrowser = !!devConfig.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = devConfig.proxyTable;

var app = express();
var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	quiet: false
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
	log: () => {}
});
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
		hotMiddleware.publish({ action: 'reload' });
		cb();
	});
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
	var options = proxyTable[context];
	if (typeof options === 'string') {
		options = { target: options };
	}
	app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
var assetsPublicPath = devConfig.assetsPublicPath;
var envPath = path.posix.join(assetsPublicPath, 'env');
app.use(envPath, express.static(utils.$resolve('lib/dom')));

function useAssets(subDir) {
	var assetsPath = path.posix.join(assetsPublicPath, subDir);
	app.use(assetsPath, express.static(prjResolve(subDir)));
}
useAssets(devConfig.assetsSubDirectory);
useAssets(devConfig.assetsDemoDirectory);
useAssets('rel');

testman(app, prjResolve, devConfig.testman || {});

var uri = 'http://localhost:' + port;

devMiddleware.waitUntilValid(function () {
	console.log('> Listening at ' + uri + '\n');
});

module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err);
		return;
	}

	// when env is testing, don't need open it
	if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
		opn(uri);
	}
});
