var path = require('path');
var tplFactory = require('./tplFactory');

const BaseDir = 'src/pages';
const cmpHT = {
	'page': BaseDir + '/page.vue',
	'route': BaseDir + '/route.vue'
};
module.exports = (prjDir, pages) => {
	IX.iterate(pages, (page) => {
		var tplRender = tplFactory.get(cmpHT[page.type]);
		IX.safeWriteFileSync(path.join(prjDir, BaseDir, page.path + '.vue'), tplRender(page.cfg));
	});
};
