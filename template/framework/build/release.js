require('./check-versions')();

process.env.NODE_ENV = 'production';

var ora = require('ora');
var rm = require('rimraf');
var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');

var utils = require('../lib/node/utils');

var projectFolder = process.argv[2];
var config = utils.getProjectConfig(projectFolder);
if (!config)
	return;
var buildConfig = config.build, releaseConfig = config.release;
if (!buildConfig || !buildConfig)
	return console.log('In ' + projectFolder 
			+ '/config/index.js, there is no config for build and release');

// webpackConfig loading MUST after config initialized!
var webpackConfig = require('./webpack/webpack.prod.conf');

var spinner = ora('building for production...');
spinner.start();

rm(path.join(buildConfig.assetsRoot, buildConfig.assetsSubDirectory), (_err) => {
	if (_err) throw _err;
	webpack(webpackConfig, function (err, stats) {
		spinner.stop();
		if (err) throw err;
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n\n');

		console.log(chalk.cyan('  Build complete and start to release.\n'));

		var release = require('./release/index');
		release(releaseConfig, function () {
			console.log(chalk.cyan(' Release complete.\n'));
		});
	});
});
