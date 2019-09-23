var cfg = require('../origin/sideNavs');
var sideNavsParser = require('../../lib/parsers/sideNavs');

module.exports = () => {
	return sideNavsParser(cfg.sideNavs);
};
