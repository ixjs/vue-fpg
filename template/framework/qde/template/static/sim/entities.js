/* eslint-disable */
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

var TypedHT = {<% for (var i=0; i<typedRef.length; i++) { %>
	<%- typedRef[i] %><% if (i < typedRef.length-1) {%>,<%}
%><%}%>
};
var SimData = <%- simData %>;

IX.iterate(SimData, function(typedData) {
	var type = typedData.name;
	IX.iterate(typedData.items, function(entity) {
		parseEntity(type, entity);
	});
});
<% for (var i=0; i<apis.length; i++) { %>
Test.<%- apis[i].name %> = function(params) {<% if (apis[i].methodName) { 
	%> return <%- apis[i].methodName %>('<%- apis[i].type %>', params); <% }  else {%>
	return <%- apis[i].result %>;
<% }%>};<%} %>

})();