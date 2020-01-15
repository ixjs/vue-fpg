var path = require('path');
var tplFactory = require('./tplFactory');

const engineFiles = [
	'static/services/services.js',
	'testman/sim/entityFactory.js',
	'testman/sim/api.js',
	'testman/sim/session.js'
];
module.exports = (prjDir, engineData) => {
	IX.iterate(engineFiles, (fname) => {
		var tplRender = tplFactory.get(fname);
		IX.safeWriteFileSync(path.join(prjDir, fname), tplRender(engineData));
	});
};
