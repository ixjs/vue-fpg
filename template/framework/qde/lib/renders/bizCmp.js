var path = require('path');
var tplFactory = require('./tplFactory');

const BaseDir = 'src/biz-components';
const cmpHT = {
	'form': BaseDir + '/form.vue',
	'grid': BaseDir + '/grid.vue',
	'link': BaseDir + '/link.vue'
};
module.exports = (prjDir, cmps) => {
	IX.iterate(cmps, (cmp) => {
		var tplRender = tplFactory.get(cmpHT[cmp.type]);
		if (cmp.cfg)
			IX.safeWriteFileSync(path.join(prjDir, BaseDir, cmp.name + '.vue'), tplRender(cmp.cfg));
	});
};
