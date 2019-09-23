var formatter = require('../../../lib/node/dataFormatter');

function getSelectCmpItem(type, item) {
	var name = item.name;
	var lowerCaseName = name.toLowerCase();
	var selectCmp = item.selectCmp;
	var isStr = IX.isString(selectCmp);

	var cmpTag = [type, lowerCaseName, 'select'].join('-');
	var cmpItem = {
		type: type,
		name: name, 
		base: type == 'ct' ? 'ct' : (isStr ? selectCmp : $XP(selectCmp, 'base', 'tree')),
		cmpName: cmpTag.camelize(),
		cmpTag: cmpTag,
		formCmpKey: type.toUpperCase() + ':' + name,
		formCmpName: lowerCaseName + 'Select'
	};

	if (type == 'ent')
		cmpItem.apiNames = {
			selectLoader: (isStr ? null : $XP(selectCmp, 'apiName')) || ('get' + name + 's4Select')
		};
	return cmpItem;
}

module.exports = (ctCfg, entCfg, extCfg) => {
	var cmps = [];
	var ctNames = [], entNames = [], typedRef = [];
	var ctHT = {}, entHT = {};

	function parseItemCmp(type, item) {
		var cmpItem = getSelectCmpItem(type, item);
		cmps.push(cmpItem);
		if (type == 'ent') {
			delete item.selectCmp;
			item.enableSelect = true;
		}
		return cmpItem;
	}
	function parseItemApis(item) {
		var reqStrs = [], rspStrs = [];
		IX.iterate(item.columns, (col) => {
			var colName = $XP(col, 'name');
			var colTypes = $XP(col, 'type', 'string').split(':');
			if (colTypes.length == 2 && colTypes[0] == 'ENT') {
				reqStrs.push(colName);
				rspStrs.push(colName + '.id,' + colName + '.name');
				typedRef.push(item.name + '.' + colName + ':' + colTypes[1]);
			} else {
				reqStrs.push(colName);
				rspStrs.push(colName);
			}
		});
		return {
			reqStrs: reqStrs.join(','),
			rspStrs: rspStrs.join(',')
		};
	}

	IX.iterate(ctCfg, (item) => {
		var name = item.name;
		ctNames.push(name);
		ctHT[name] = parseItemCmp('ct', item);
	});
	IX.iterate(entCfg, (item) => {
		var name = item.name, cmpItem = null;
		var isTreeEnt = false;
		entNames.push(name);

		if ('selectCmp' in item)
			cmpItem = parseItemCmp('ent', item);
		if ('treeAttr' in item) {
			typedRef.push(name + '.' + item.treeAttr + ':' + name);
			isTreeEnt = true;
			delete item.treeAttr;
		}

		if ($XP(extCfg, name + '.enableSelect')) 
			item.enableSelect = true;

		entHT[name] = IX.inherit(parseItemApis(item), {
			type: 'ent',
			name: name,
			isTreeEnt: isTreeEnt,
			apiNames: IX.inherit(cmpItem ? cmpItem.apiNames : null, {
				gridLoader: 'query' + name + 's',
				get: 'get' + name,
				add: 'add' + name,
				edit: 'edit' + name,
				remove: 'remove' + name,
				removeAll: 'removeAll' + name + 's'
			})
		});
	});

	return {
		ctNames, entNames, typedRef, ctHT, entHT,
		dataStore: {
			cmps: cmps,
			ctItems: formatter.formatArr(ctCfg),
			entItems: formatter.formatArr(entCfg)
		}
	};
};