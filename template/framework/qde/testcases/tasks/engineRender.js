var cfg = require('../parsed/pagesParser');
var engineRender = require('../../lib/renders/engine');

module.exports = (prjDir) => {
	engineRender(prjDir, cfg.engines);
};