var fs = require('fs');

var pkg = require('../env/package.json');
var utils = require('../lib/node/utils');

var tplDir = utils.$resolve('base/template');
var tplResolver = utils.getProjectResolve('framework/base/template');

var ns = pkg.namespace.toLowerCase();
var nsReg = /\{\{\s*ns\s*\}\}/g;
var nsUpperReg = /\{\{\s*NS\s*\}\}/g;

utils.execCmd(['mv', 
		tplResolver('src/components/nsSample.vue'),
		tplResolver('src/components/' + ns + 'Sample.vue')].join(' '));
utils.execCmd(['mv',
		tplResolver('src/biz-components/nsBizSample.vue'),
		tplResolver('src/biz-components/' + ns + 'BizSample.vue')].join(' '));

var indexFile = tplResolver('index.html');
fs.writeFileSync(indexFile, 
		fs.readFileSync(indexFile, 'utf8').replace(nsUpperReg, ns.toUpperCase()));

IX.iterDirSync(tplDir, '', function (_path, fileFullPath) {
	var content = fs.readFileSync(fileFullPath, 'utf8');
	if (!content.match(nsReg))
		return;
	console.log('Replaced:', fileFullPath);
	fs.writeFileSync(fileFullPath, content.replace(nsReg, ns));
});