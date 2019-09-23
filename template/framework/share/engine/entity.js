var nsConst = IXW.ns('Const');

var entityHT = new IX.IListManager();

function entityParse(item, defNodeType) {
	var nodeType = item.nodeType || defNodeType;

	var entModel = entityHT.get(nodeType);
	if (entModel)
		return entModel.parse(item);

	console.error('Can\'t parse item since no entity model defined.', 
			item, 'DefaultNodeType:' + nodeType); 
	return null;
}

function toArray(names) { return IX.isString(names) ? names.split(',') : names; }

var DefEntityOps = {
	'add': { label: '增加新' },  
	'removeAll': { label: '删除选中的', api: 's', usingCheckBox: true },
	'edit': { label: '编辑' },  
	'remove': { label: '删除' }
};

function createEntityButtons(entName, entLabel, btnNames, extBtns) {
	var btnHT = IX.IListManager(), apiNames = {};

	IX.iterate(toArray(btnNames), (btnName) => {
		var def = DefEntityOps[btnName];
		if (!def)
			return console.error('Can\'t find button "' + btnName + '" for Entity:', entName);
		
		var btn = { name: btnName, label: def.label + entLabel };
		if (def.usingCheckBox)
			btn.usingCheckBox = true;
		btnHT.register(btnName, btn);
		apiNames[btnName] = btnName + entName + (def.api || '');
	});
	IX.iterate(extBtns, (btn) => {
		var btnName = $XP(btn, 'name', null);
		if (!btnName) 
			return;
		btnHT.register(btnName, btn);
	});
	var strAllBtns = JSON.stringify(btnHT.getAll());

	function getButtons(names) {
		return IX.loop(names, [], (acc, btnName) => {
			var item = btnHT.get(btnName);
			if (item) acc.push(IXW.dup(item));
			return acc;
		});
	}
	return {
		apiNames,
		getButtons(names) { 
			return !IX.isEmpty(names) ? getButtons(toArray(names)) : JSON.parse(strAllBtns); 
		}
	};
}

function createEntityActions(entName, entLabel, actionNames, extActions, actionChecker) {
	var actionHT = IX.IListManager(), apiNames = {};

	IX.iterate(toArray(actionNames), (actName) => {
		var def = DefEntityOps[actName];
		if (!def)
			return console.error('Can\'t find action "' + actName + '" for Entity:' + entName);

		actionHT.register(actName, { name: actName, label: def.label });
		apiNames[actName] = actName + entName;
	});
	
	IX.iterate(extActions, (action) => {
		var actName = $XP(action, 'name', null);
		if (!actName) 
			return;
		actionHT.register(actName, action);
	});

	return {
		apiNames,
		numOfActions: actionHT.getSize(),
		getActions(item) {
			var _actions = [];
			actionHT.iterate((action) => {
				if (!(action.name in actionChecker) || actionChecker[action.name](item))
					_actions.push(IXW.dup(action));
			});
			return _actions;
		}
	};
}

function createColumnConvertor(colName, colType) {
	var specType = colType.split(':');

	if (specType[0] == 'CT')
		return (row) => { return nsConst[specType[1] + 'HT'][row[colName]]; };
	if (specType[0] == 'ENT')
		return (row) => { return $XP(row, colName + '.name', '-'); };
	return (row) => { return $XP(row, colName, '-'); };
}

function createEntityColumns(columns, extConvertor) {
	var colHT = {}, itemColumns = [];
	var columnConvertor = {};

	IX.iterate(columns, (col) => {
		var colName = col.name,
			colType = col.type || 'string';

		var colItem = {
			name: colName,
			label: col.label,
			type: colType
		};
		colHT[colName] = colItem;
		itemColumns.push(colItem);

		columnConvertor[colName] = (colName in extConvertor) 
				? extConvertor[colName] 
				: createColumnConvertor(colName, colType);
	});

	var strAllColumns = JSON.stringify(itemColumns);

	function getColumn(col) {
		if (!IX.isString(col))
			return col;
		var arr = col.split(':');
		if (!(arr[0] in colHT)) {
			console.error('Can\'t find Column "' + col + '"');
			return null;
		}
		return IX.inherit(colHT[col], 
			(arr.length > 1 && arr[1] == 'disabled') ? { disabled: true } : {});
	}

	return {
		convert(item) {
			return IX.loop(itemColumns, {}, (acc, col) => {
				var colName = col.name;
				acc[colName] = columnConvertor[colName](item);
				return acc;
			});
		},
		getColumns(colNames) {
			if (colNames == null || colNames == '') 
				return JSON.parse(strAllColumns);
			return IX.loop(toArray(colNames), [], (acc, col) => {
				var item = getColumn(col);
				if (item) acc.push(IXW.dup(item));
				return acc;
			});
		}
	};
}

/** 
entDef: {
	name,
	label, 
	primeKey: 'id'
	columns:[{name,label, type}], 
	buttons: 'add,removeAll', 
	actions:'edit,remove',
	enableSelect: true, default false
}
extDef: {
	columnsConvertor: {"colname": function(item){ return '-'; }},
	buttons: [{name, label, usingCheckBox}]
	actions: [{name, label}]
	activeActionChecker: {"actionname": function(item){return true;}}
}
return : {
	name, label, apiNames: {"typeName": "name" },
	numOfActions:2,
	getActions(item),
	getButtons(names),
	getColumns(names),
	parse(item){return {id, _item, _actions, children, "colname": "colValue"}}
}
 */
function registerEntity(entDef, extDef) {
	var entName = entDef.name, entLabel = entDef.label;
	var primeKey = entDef.primeKey || 'id';

	var entityModel = entityHT.get(entName);
	if (entityModel)
		return entityModel;

	extDef = extDef || {};
	var colModel = createEntityColumns(entDef.columns, extDef.columnsConvertor || {});
	var btnsModel = createEntityButtons(entName, entLabel, 
			entDef.buttons || 'add,removeAll', extDef.buttons || []);
	var actionsModel = createEntityActions(entName, entLabel, 
			entDef.actions || 'edit,remove', extDef.actions || [], 
			extDef.activeActionChecker || {});

	entityModel = {
		name: entName,
		label: entLabel,
		apiNames: IX.inherit(btnsModel.apiNames, actionsModel.apiNames, entDef.enableSelect ? {
			selectLoader: 'get' + entName + 's4Select'
		} : {}, {
			get: 'get' + entName,
			gridLoader: 'query' + entName + 's'
		}, extDef.apiNames),
		numOfActions: actionsModel.numOfActions,
		getActions: actionsModel.getActions,
		getButtons: btnsModel.getButtons,
		getColumns: colModel.getColumns
	};

	entityModel.parse = (item) => {
		const baseRow = IX.inherit({
			id: item[primeKey],
			_item: item,
			_actions: actionsModel.getActions(item)
		}, colModel.convert(item));

		if ('children' in item) 
			baseRow.children = IX.loop(item.children, [], (acc, child) => {
				var childItem = entityParse(child, entName);
				if (childItem)
					acc.push(childItem);
				return acc;
			});
		return baseRow;
	};
	entityHT.register(entName, entityModel);

	return entityModel;
}

export default {
	register: registerEntity,
	get: entityHT.get
};