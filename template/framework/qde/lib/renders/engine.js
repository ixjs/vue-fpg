var path = require('path');
var tplFactory = require('./tplFactory');

const engineFiles = [
	'src/router/index.js',
	'src/session/privs.js'
];
module.exports = (prjDir, engineData) => {
	IX.iterate(engineFiles, (fname) => {
		var tplRender = tplFactory.get(fname);
		IX.safeWriteFileSync(path.join(prjDir, fname), tplRender(engineData));
	});
};
