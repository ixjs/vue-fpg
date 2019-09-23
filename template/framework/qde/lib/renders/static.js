var path = require('path');
var tplFactory = require('./tplFactory');

const engineFiles = [
	'static/services/pseudoServices.js',
	'static/services/services.js',
	'static/sim/entities.js',
	'static/sim/session.js',
];
module.exports = (prjDir, engineData) => {
	IX.iterate(engineFiles, (fname) => {
		var tplRender = tplFactory.get(fname);
		IX.safeWriteFileSync(path.join(prjDir, fname), tplRender(engineData));
	});
};
