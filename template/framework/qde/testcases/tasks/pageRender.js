var cfg = require('../parsed/pagesParser');
var pageRender = require('../../lib/renders/page');

module.exports = (prjDir) => {
	pageRender(prjDir, cfg.pages);
};