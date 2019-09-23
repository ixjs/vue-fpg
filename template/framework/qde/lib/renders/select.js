var path = require('path');
var tplFactory = require('./tplFactory');

const cmpHT = {
	'cmp': 'src/components/select',
	'formCmp': 'src/components/form'
};
module.exports = (prjDir, cmps) => {
	IX.iterate(['cmp', 'formCmp'], (typeName) => {
		var tplName = cmpHT[typeName];
		var tplRender = tplFactory.get(tplName, '.vue');
		IX.iterate(cmps, (cmpItem) => {
			var targetName = cmpItem[typeName + 'Name'] + '.vue';	
			IX.safeWriteFileSync(path.join(prjDir, tplName, targetName), tplRender(cmpItem));
		});
	});
};
