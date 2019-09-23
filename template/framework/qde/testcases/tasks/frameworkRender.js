var cfg = require('../parsed/framework');
var frameworkRender = require('../../lib/renders/framework');

module.exports = (prjDir) => {
	console.log("render: ", cfg);
	frameworkRender(prjDir, cfg);
};