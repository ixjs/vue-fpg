var cfg = require('../parsed/staticParser');
var staticRender = require('../../lib/renders/static');

module.exports = (prjDir) => {
	staticRender(prjDir, cfg);
};