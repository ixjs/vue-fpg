var cfg = require('../origin/pages');
var pagesParser = require('../../lib/parsers/pages');

module.exports = () => {
	return pagesParser(cfg.pages, cfg.configurations, cfg.navs);
};
