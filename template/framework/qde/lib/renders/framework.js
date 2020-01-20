var path = require('path');
var tplFactory = require('./tplFactory');

const frameFiles = [
	'index.html',
	'src/main.js'
];

module.exports = (prjDir, tplData) => {
	IX.iterate(frameFiles, (fname) => {
		var tplRender = tplFactory.get(fname);
		IX.safeWriteFileSync(path.join(prjDir, fname), tplRender(tplData));
	});
};