var path = require('path');
var tplFactory = require('./tplFactory');

const DataStoreFilePath = 'src/dataStore/index.js';

module.exports = (prjDir, tplData) => {
	var tplRender = tplFactory.get(DataStoreFilePath);
	IX.safeWriteFileSync(path.join(prjDir, DataStoreFilePath), tplRender(tplData));
};