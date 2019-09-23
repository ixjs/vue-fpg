var formatter = require('../../../lib/node/dataFormatter');

module.exports = (cfg) => {
	var apiNames = [], entityAttrs = [];
	var cmps = IX.map(cfg, (item) => {
		var cmp = {
			isReferTo: false,
			name: item.name,
			target: item.target || 'null',
			type: item.base || 'tree'
		};

		if ('items' in item) {
			cmp.dataItems = formatter.formatArr(item.items);
			return cmp;
		}
		cmp.isReferTo = true;
		cmp.entity = 'unknown';
		var referEntity = $XP(item, 'refer');
		if (referEntity && referEntity.substring(0, 4) == 'ENT:') {
			cmp.entity = referEntity.substring(4);
			cmp.target = 'Entity.name';
			cmp.apiName = 'Entity.apiNames.selectLoader';
		}
		if ('apiName' in item) {
			apiNames.push(item.apiName);
			cmp.apiName = "'" + item.apiName + "'";
		}
		if (cmp.apiName == 'Entity.apiNames.selectLoader')
			entityAttrs[cmp.entity] = { enableSelect: true };
		return cmp;
	});
	// console.log(" sideNav parsed: ", apiNames, entityAttrs, 
	//		typeof(entityAttrs), JSON.stringify(entityAttrs));
	return {
		sideNavs: cmps,
		apiNames: apiNames,
		entityAttrs: IX.inherit(entityAttrs, {})
	};
};