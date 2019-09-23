var path = require('path');
var tplFactory = require('./tplFactory');

const TplName = 'src/components/sideNav';

module.exports = (prjDir, navs) => {
	var tplRender = tplFactory.get(TplName, '.vue');
	IX.iterate(navs, (item) => {
		IX.safeWriteFileSync(path.join(prjDir, TplName, item.name + '.vue'), tplRender(item));
	});
};
