var fs = require('fs');
var ejs = require('ejs');
var utils = require('../../../lib/node/utils');

var tplHT = {};

exports.get = (name, filePostfix) => {
	if (name in tplHT)
		return tplHT[name];
	var tplFilepath = utils.$resolve('qde/template/' + name + (filePostfix || ''));
	var tplTxt = fs.readFileSync(tplFilepath, 'utf8');
	var tpl = ejs.compile(tplTxt, { debug: false });
	tplHT[name] = tpl;
	return tpl;	
};
