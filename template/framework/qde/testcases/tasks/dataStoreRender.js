var cfg = require('../parsed/dataStoreParser');
var dataStoreRender = require('../../lib/renders/dataStore');

module.exports = (prjDir) => {
	dataStoreRender(prjDir, cfg.dataStore);
};