var cfg = require('../origin/dataStore');
var info = require('../parsed/sideNavsParser');
var dataStoreParser = require('../../lib/parsers/dataStore');

module.exports = () => {
	return dataStoreParser(cfg.codeTables, cfg.entities, info.entityAttrs);
};
