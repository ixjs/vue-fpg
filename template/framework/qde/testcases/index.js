var path = require('path');
var util = require('util');
var utils = require('../../lib/node/utils');
var formatter = require('../../lib/node/dataFormatter');

var Testcases4Parser = [
	'dataStoreParser'
	,'pagesParser'
	,'sideNavsParser'
	,'staticParser'
];
var Testcases4Render = [
	'staticRender'
	,'frameworkRender'
	,'sideNavRender'
	,'dataStoreRender'
	,'selectRender'
	,'engineRender'
	,'pageRender'
	,'bizCmpRender'
];

var tmpDir = utils.$resolve('qde/tmp');
console.log('tmpDir:', tmpDir);

IX.iterate(Testcases4Parser, (name) => {
	var parserCase = require('./tasks/' + name + '.js');
	var result = parserCase();
	console.log('Parse:', name, utils.inspect(result)); //JSON.stringify(result));
	var content = 'module.exports = ' + utils.inspect(result) +';'; //formatter.format(result, 0, false) + ';' ;
	IX.safeWriteFileSync(path.join(tmpDir, 'parsed', name + '.js'), content);
});
IX.iterate(Testcases4Render, (name) => {
	var renderCase = require('./tasks/' + name + '.js');
	renderCase(tmpDir);
});
