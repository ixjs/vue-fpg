var fs = require('fs');
var utils = require('../lib/node/utils');

var prjName = process.argv[2];

var anchorStr = '"new-project-alias"';
var destStr = [
	'"preless:newprj": "node framework/build/preless.js newprj"',
	// '"map:newprj": "node framework/build/map.js newprj"',
	'"dev:newprj": "node framework/build/dev-server.js newprj"',
	'"release:newprj": "node framework/build/release.js newprj"',
	'"lint:newprj": "eslint -c newprj/.eslintrc.js --ext .js,.vue newprj/src"',
	'"lintext:newprj": "eslint -c newprj/.eslintrc.js --ext .js newprj/static"'
].join(',\n\t\t') + ',\n\n\t\t' + anchorStr;

var pkgFile = utils.$resolve('env/package.json');
fs.writeFileSync(pkgFile, 
		fs.readFileSync(pkgFile, 'utf8').replace(anchorStr, destStr.replace(/newprj/g, prjName)));