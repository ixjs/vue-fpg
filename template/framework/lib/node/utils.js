var fs = require('fs');
var path = require('path');
var util = require('util');
var childProcess = require('child_process');
require('./ix');

exports.inspect = (data) => {
	return util.inspect(data, { depth: null, breakLength: 100 });
};
exports.dup = (obj) => {
	return JSON.parse(JSON.stringify(obj));
};

exports.execCmd = (cmd) => {
	// console.log("EXEC: ", cmd);
	childProcess.execSync(cmd);
};

function resolve(dir) {
	return path.join(__dirname, '../..', dir);
}
// console.log("resolve: ", resolve('share'));

// resolve in whole group, framework's parent folder;
exports.resolve = function (dir) { return resolve('../' + dir); };
// resolve in framework;
exports.$resolve = function (dir) { return resolve(dir); };
// get resolve for specified project;
exports.getProjectResolve = function (prjName) {
	return function (dir) { return resolve('../' + prjName + '/' + dir); };
};

exports.getProjectConfig = function (prjName, npmItem) {
	if (IX.isEmpty(prjName)) {
		console.log('Please assign the project\'s foldname to preless.');
		return null;
	}
	var prjPath = resolve('../' + prjName);
	var file = fs.statSync(prjPath);
	if (!file.isDirectory()) {
		console.log('Please confirm "' + prjName + '" is a valid project\'s fold name.');
		return null;
	}

	var config = require(resolve('../' + prjName + '/config'));
	if (!config) {
		console.log('Please confirm the file "' + prjPath + '/config/index.js" existed and valid.');
		return null;
	}

	if (!process.env.NODE_ENV)
		process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);

	var nsWebpack = IX.ns('FPG.webpack');
	var isProduction = process.env.NODE_ENV === 'production';
	var runtimeConfig = config[nsWebpack.isProduction ? 'build' : 'dev'];

	nsWebpack.originConfig = config;
	nsWebpack.isProduction = isProduction;
	nsWebpack.rtConfig = runtimeConfig;

	nsWebpack.assetsPublicPath = runtimeConfig.assetsPublicPath;
	nsWebpack.assetsSubDirectory = runtimeConfig.assetsSubDirectory;
	nsWebpack.cssSourceMap = isProduction 
			? config.build.productionSourceMap 
			: config.dev.cssSourceMap;

	nsWebpack.prjName = prjName;
	nsWebpack.resolve = resolve;
	nsWebpack.prjResolve = function (dir) { return resolve('../' + prjName + '/' + dir); };

	if (npmItem) {
		var npmConfig = config[npmItem];
		if (!npmConfig) {
			console.log('In ' + prjName + 'config/index.js, there is no config for ' + npmItem);
			return null;
		}
		return npmConfig;
	}

	return config;
};