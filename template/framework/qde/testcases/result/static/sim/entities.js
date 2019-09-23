(function(){
var dataHT = {}, parentHT = IX.IListManager(), // child: parent
	treeTypes = {}, groupHT = IX.I1ToNManager(), // parent: [childs]
	typedGroup = IX.I1ToNManager();

function parseStoreItem(type, storeId, name, val) {
	if (name == 'parentId'){
		treeTypes[type] = true;
		parentHT.register(storeId, type + '-' + val);
		groupHT.put(type + '-' + val, storeId);
		return;
	}
	var key = type + '.' + name;
	// 不是实体类型
	if (!(key in TypedHT)) // || !(TypedHT[key] in treeTypes）
		return;
	var ptype = TypedHT[key];
	var parentId = ptype + '-' + val;
	groupHT.put(parentId, storeId);

	if (ptype in treeTypes && treeTypes[ptype])
		parentHT.register(storeId, parentId);
}

function parseEntity(type, entity, isEdit) {
	var storeId = type + '-' + entity.id;
	if (!isEdit) {
		dataHT[storeId] = entity;
		typedGroup.put(type, storeId);
	}
	IX.each(entity, {}, function(acc, val, name) {
		parseStoreItem(type, storeId, name, val);
		return acc;
	});
}
function deparseStoreItem(type, storeId, name, val) {
	if (name == 'parentId'){
		var pId = type + '-' + val;
		parentHT.remove(storeId, pId);
		groupHT.remove(pId, storeId);
		return;
	}
	var key = type + '.' + name;
	// 不是实体类型
	if (!(key in TypedHT)) 
		return;
	var ptype = TypedHT[key];
	var parentId = ptype + '-' + val;
	groupHT.remove(parentId, storeId);

	if (ptype in treeTypes && treeTypes[ptype])
		parentHT.unregister(storeId, parentId);
}
function _removeEntity(type, id, isEdit) {
	var itemId = type + '-' + id;
	var entity = dataHT[itemId];

	if (!isEdit) {
		delete dataHT[itemId];
		typedGroup.remove(type, itemId);
	}

	IX.each(entity, {}, function(acc, val, name) {
		deparseStoreItem(type, itemId, name, val);
		return acc;
	});
	if (!isEdit) { // is Real Remove
		IX.iterate(groupHT.get(itemId), function(childId) {
			var idx = childId.indexOf('-');
			_removeEntity(childId.substring(0, idx), childId.substring(idx + 1));
		});
		groupHT.unregister(itemId);
	}
	return {};
}

function getEntityByItemId(itemId) {
	return dataHT[itemId] || null;
}
function getConvertedEntity(itemId) {
	var arr = itemId.split('-');
	var itemType = arr[0];
	return itemId in dataHT ? IX.each(dataHT[itemId], {}, function(acc, val, name) {
		var ptype = itemType + '.' + name;
		if (ptype in TypedHT) {
			var pItem = dataHT[TypedHT[ptype] + '-' + val];
			acc[name] = pItem ? { id: pItem.id, name: pItem.name } : null;
		} else
			acc[name] = val;
		return acc;
	}) : null;
}

function getEntityTree(type, nodeFn) {
	var nodeHT = {};
	var rootItemIds = [];

	function getParentEntity(itemId) {
		var node = null;
		// 无此节点 
		if (!(itemId in dataHT))
			return null;

		if (!(itemId in nodeHT))
			nodeHT[itemId] = nodeFn(itemId);
		node = nodeHT[itemId];

		var pnode = getParentEntity(parentHT.get(itemId));
		if (pnode == null)
			rootItemIds.push(itemId);
		else {
			if (!IX.Array.isFound(node, pnode.children, 
					function(a, b) { return a.id == b.id && a.nodeType == b.nodeType; }))
				pnode.children.push(node);
		}

		return node;
	}

	IX.iterate(typedGroup.get(type), getParentEntity);

	return IX.map(IX.Array.toSet(rootItemIds), function(itemId) {
		return nodeHT[itemId];
	});
}

function getEntityTree4Select(type) {
	return getEntityTree(type, function (itemId) {
		var item = dataHT[itemId];
		var arr = itemId.split('-');
		var itemType = arr[0];
		return { id: item.id, name: item.name, nodeType: itemType, children: [] };
	});
}

function queryEntities(type, params) {
	var itemIds = typedGroup.get(type);
	if (treeTypes[type])
		return getEntityTree(type, function (itemId) {
			return IX.inherit(getConvertedEntity(itemId), { children: [] });
		});

	if ('pageSize' in params) {
		var pageSize = params.pageSize || 5,
			pageNo = $XP(params, 'pageNo', 1) - 1;
		pageNo = Math.max(0, Math.min(Math.ceil(itemIds.length / pageSize) - 1, pageNo));

		var stx = pageNo * pageSize; endx = Math.min(stx + pageSize, itemIds.length);
		return  {
			total: itemIds.length,
			pageNo: pageNo + 1,
			pageSize: pageSize,
			list: IX.partLoop(itemIds, stx, endx, [], function(acc, itemId) {
				acc.push(getConvertedEntity(itemId));
				return acc;
			})
		};
	}
	return IX.map(itemIds, getConvertedEntity);
}
function getEntity(type, params) {
	return getEntityByItemId(type + '-' + params.id);
}

function addEntity(type, params) {
	var entity = IX.inherit(params, { id: IX.id() });
	parseEntity(type, entity);

	return getConvertedEntity(type + '-' + entity.id);
}
function editEntity(type, params) {
	var itemId = type + '-' + params.id;
	dataHT[itemId] = IX.inherit(dataHT[itemId], params);

	_removeEntity(type, params.id, 'edit');
	parseEntity(type, dataHT[itemId], 'edit');

	return getConvertedEntity(itemId);
}
function removeEntity(type, params) {
	_removeEntity(type, params.id);
	return {};
}
function removeEntities(type, params) {
	IX.iterate(params.ids, function (id) {
		_removeEntity(type, id);
	});
	return {};
}

var Test = IX.ns('Test');

var TypedHT = {
	'Org.parentId': 'Org',
	'User.org': 'Org',
	'CDType.org': 'Org',
	'CDType.owner': 'User',
	'CDItem.cdType': 'CDType'
};
var SimData = [ { name: 'Org',
	items: 
	 [ { id: 1, parentId: 0, name: '总行', type: 1, addr: '北京市中心', desc: '总行位于北京市' },
	   { id: 11, parentId: 1, name: '渠道管理部', type: 2, addr: '北京市复兴门', desc: '分行位于金融街' },
	   { id: 12, parentId: 1, name: '风险管理部', type: 2, addr: '上海市东方明珠', desc: '分行位于东方明珠' },
	   { id: 13, parentId: 1, name: '科技信息部', type: 2, addr: '北京市北四环高斯大厦', desc: '科技部位于高斯大厦' },
	   { id: 21, parentId: 13, name: '架构中心', type: 3, addr: '北京市北四环高斯大厦四层', desc: '科技部位于高斯大厦' },
	   { id: 22, parentId: 13, name: '需求中心', type: 3, addr: '北京市北四环高斯大厦五层', desc: '科技部位于高斯大厦' } ] },
  { name: 'User',
	items: 
	 [ { id: 21, org: 13, name: '李部', gender: 'male', desc: '科技信息部部长' },
	   { id: 22, org: 21, name: '谭总', gender: 'male', desc: '架构中心总经理' },
	   { id: 23, org: 21, name: '张三', gender: 'male', desc: '架构中心成员' },
	   { id: 24, org: 22, name: '王总', gender: 'male', desc: '需求中心总经理' },
	   { id: 25, org: 22, name: '李四', gender: 'female', desc: '需求中心成员' } ] },
  { name: 'CDType',
	items: 
	 [ { id: 21, name: '基础类', org: 1, owner: 23, desc: '基础类XX' },
	   { id: 22, name: '媒介类', org: 11, owner: 23, desc: '媒介类YY' },
	   { id: 23, name: '区域数据', org: 11, owner: 23, desc: '区域数据ZZ' },
	   { id: 24, name: '资产评估', org: 12, owner: 23, desc: '资产评估WWW' },
	   { id: 25, name: '信用评估', org: 12, owner: 23, desc: '信用评估UUUU' } ] },
  { name: 'CDItem',
	items: 
	 [ { id: 21, name: '姓名', cdType: 21, valueType: 1, desc: '客户姓名X' },
	   { id: 22, name: '性别', cdType: 21, valueType: 1, desc: '客户性别X' },
	   { id: 23, name: '手机号', cdType: 21, valueType: 2, desc: '客户手机号X' },
	   { id: 24, name: '手机型号', cdType: 22, valueType: 2, desc: '手机型号XX' },
	   { id: 25, name: '地区', cdType: 23, valueType: 3, desc: '客户手机号X' },
	   { id: 26, name: '民族', cdType: 23, valueType: 3, desc: '手机型号XX' } ] } ];

IX.iterate(SimData, function(typedData) {
	var type = typedData.name;
	IX.iterate(typedData.items, function(entity) {
		parseEntity(type, entity);
	});
});

Test.getOrgs4Select = function(params) { return getEntityTree4Select('Org', params); };
Test.getUsers4Select = function(params) { return getEntityTree4Select('User', params); };
Test.getCDTypes4Select = function(params) { return getEntityTree4Select('CDType', params); };
Test.queryOrgs = function(params) { return queryEntities('Org', params); };
Test.getOrg = function(params) { return getEntity('Org', params); };
Test.addOrg = function(params) { return addEntity('Org', params); };
Test.editOrg = function(params) { return editEntity('Org', params); };
Test.removeOrg = function(params) { return removeEntity('Org', params); };
Test.removeAllOrgs = function(params) { return removeEntities('Org', params); };
Test.queryUsers = function(params) { return queryEntities('User', params); };
Test.getUser = function(params) { return getEntity('User', params); };
Test.addUser = function(params) { return addEntity('User', params); };
Test.editUser = function(params) { return editEntity('User', params); };
Test.removeUser = function(params) { return removeEntity('User', params); };
Test.removeAllUsers = function(params) { return removeEntities('User', params); };
Test.queryCDTypes = function(params) { return queryEntities('CDType', params); };
Test.getCDType = function(params) { return getEntity('CDType', params); };
Test.addCDType = function(params) { return addEntity('CDType', params); };
Test.editCDType = function(params) { return editEntity('CDType', params); };
Test.removeCDType = function(params) { return removeEntity('CDType', params); };
Test.removeAllCDTypes = function(params) { return removeEntities('CDType', params); };
Test.queryCDItems = function(params) { return queryEntities('CDItem', params); };
Test.getCDItem = function(params) { return getEntity('CDItem', params); };
Test.addCDItem = function(params) { return addEntity('CDItem', params); };
Test.editCDItem = function(params) { return editEntity('CDItem', params); };
Test.removeCDItem = function(params) { return removeEntity('CDItem', params); };
Test.removeAllCDItems = function(params) { return removeEntities('CDItem', params); };
Test.setFuncActived = function(params) {
	return {};
};
Test.getFuncActived = function(params) {
	return { actived: 'actived' };
};

})();