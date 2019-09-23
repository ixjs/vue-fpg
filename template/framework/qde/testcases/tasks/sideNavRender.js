var cfg = require('../parsed/sideNavsParser');
var sideNavRender = require('../../lib/renders/sideNav');

module.exports = (prjDir) => {
	sideNavRender(prjDir, cfg.sideNavs);
};