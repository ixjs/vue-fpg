var fs = require('fs');
var path = require('path');

var utils = require('../lib/node/utils');

var projectFolder = process.argv[2];
var prelessConfig = utils.getProjectConfig(projectFolder, 'preless');
if (!prelessConfig)
	return;

var DefSetttings = {
	'background': { clz: 'bg', merge: require('./preless/bgConvertor.js') },
	'picmap': { clz: 'pic', merge: require('./preless/picConvertor.js') }
};

var tplDir = utils.$resolve('build/preless/tpl');
var srcPath = prelessConfig.src;
var imgDestPath = prelessConfig.imgDest;
var lessDestPath = prelessConfig.lessDest;
var demoDest = prelessConfig.demoDest || null;
// console.log('tpldir', tplDir, srcPath, imgDestPath, lessDestPath, demoDest);

function renderTplToFile(tplfile, lessData, destPath) {
	var _tpl = fs.readFileSync(tplDir + '/' + tplfile, { encoding: 'utf8' }).toString();
	var tpl = new IX.ITemplate({ tpl: _tpl });
	var renderStr = tpl.renderData('', lessData);
	IX.safeWriteFileSync(destPath, renderStr);
	// return renderStr;
}

function writeLessFile(lessData) {
	var suffix = lessData.suffix;
	var lessFilePath = '/less/ixwpre' + suffix + '.less';

	console.log('write less file to : ' + lessDestPath + lessFilePath);// , JSON.stringify(lessData));
	renderTplToFile('tpl.less', lessData, lessDestPath + lessFilePath);
	renderTplToFile('tpl.less', lessData, imgDestPath + lessFilePath);

	if (!demoDest)
		return;
	renderTplToFile('demo-tpl.less', lessData, demoDest + lessFilePath);
	renderTplToFile('preview.htm', lessData, demoDest + '/preview' + suffix + '.htm');
	renderTplToFile('demo.less', lessData, demoDest + '/less/demo' + suffix + '.less');

	utils.execCmd(['cp', utils.$resolve('lib/dom/less.min.js'), 
			path.join(demoDest, 'less.min.js')].join(' '));
}

var allLessData = {};
function processFn(finishFn, suffix) {
	var lessData = {
		bg: [],
		pic: [],
		suffix: suffix
	};

	function execTask(name, taskType, taskDef, fn) {
		var settings = DefSetttings[taskType];
		var defClz = settings.clz;
		if (name in allLessData) {
			// console.log('reuse: '+ name + ' for ' + suffix);
			lessData[defClz].push(allLessData[name]);
			return fn();
		}

		// console.log('exec: '+ name + ' for ' + suffix);
		settings.merge(IX.inherit({
			classPrefix: defClz,
		}, taskDef), function (lessInfo) {
			console.log('after exec! ' + name);
			allLessData[name] = lessInfo;
			lessData[defClz].push(lessInfo);
			fn();
		});
	}
	function createTask(taskType, defCfg, task) {
		var taskPath = $XP(task, 'path', taskType);
		var _path = srcPath + '/' + taskPath;
		if (fs.existsSync(_path + suffix))
			_path += suffix;
		return [taskType + ':' + taskPath, function (name, fn) {
			execTask(name, taskType, IX.inherit({
				src: _path,
				dest: imgDestPath
			}, defCfg, task, { path: taskPath }), fn);
		}];
	}
	function createTasks(taskType, defCfg) {
		return IX.map($XP(prelessConfig, taskType, []), function (task) {
			return createTask(taskType, defCfg, task);
		});
	}

	var steps = [].concat(createTasks('background', {
	}), createTasks('picmap', {
		margin: 8,
		demoDest: demoDest
	}));

	IX.sequentialSteps(steps).exec(function () {
		writeLessFile(lessData);
		finishFn();
	});
}

var oemList = prelessConfig.oem;
oemList.unshift('');

IX.sequentialSteps(IX.map(oemList, function (oemName) {
	return [oemName, function (name, fn) {
		console.log('process ' + name);
		processFn(fn, name ? ('-' + name) : '');
	}];
})).exec(function () {
	console.log('Done!', arguments);
});
