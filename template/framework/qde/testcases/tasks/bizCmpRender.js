var cfg = require('../parsed/pagesParser');
var bizCmpRender = require('../../lib/renders/bizCmp');

module.exports = (prjDir) => {
	bizCmpRender(prjDir, cfg.bizCmps);
};