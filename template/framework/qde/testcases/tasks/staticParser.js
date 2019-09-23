var cfg = require('../origin/static');
var dsInfo = require('../parsed/dataStoreParser');
var pageInfo = require('../parsed/pagesParser');

var staticParser = require('../../lib/parsers/static');

module.exports = () => {
	return staticParser(cfg.simData, dsInfo,
			pageInfo.engines.privs, 
			pageInfo.apis,
			pageInfo.queryParams);
};
