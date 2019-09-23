var cfg = require('../parsed/dataStoreParser');
var selectRender = require('../../lib/renders/select');

module.exports = (prjDir) => {
	selectRender(prjDir, cfg.dataStore.cmps);
};