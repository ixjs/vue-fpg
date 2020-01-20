import pageSession from './index';

var privHT = {};
var privTree = {};

function getNavItem(privInfo) {
	if (privInfo.type == 'nav')
		return privInfo.name;
	var ppname = privTree[privInfo.name];
	return ppname ? getNavItem(privHT[ppname]) : null;
}

function resetPrivData(ht, tree) {
	privHT = ht;
	privTree = tree;
}

var sessionFactory = IXW.ns('SessionFactory');
sessionFactory.getPageInfo = (pageName) => {
	var pageInfo = privHT[pageName];
	return pageInfo ? {
		name: pageName,
		title: pageInfo.title,
		navItem: getNavItem(pageInfo)
	} : null;
};
sessionFactory.resetPrivData = resetPrivData;

function getPrivsData(privNames) {
	var items = {};
	var privs = [];
	function pushPriv(privName) {
		var parentName = privTree[privName];
		if (parentName && !(parentName in items)) 
			pushPriv(parentName);
		items[privName] = true;
		privs.push(privHT[privName]);
	}

	IX.iterate(privNames, pushPriv);
	// console.log('PrivData:', privs);
	return privs;
}

function parsePrivsData(privs) {
	var itemHT = {};
	var nameHT = {};
	var privIds = [];

	resetPrivData({}, {});
	IX.iterate(privs, (priv) => {
		itemHT[priv.id] = priv;
		if (priv.parentId == 0) {
			privHT[priv.name] = priv;
			nameHT[priv.id] = priv.name;
		} else
			privIds.push(priv.id);
	});

	while (privIds.length > 0) {
		var privId = privIds.shift();
		var priv = itemHT[privId];
		var pprivId = priv.parentId;
		var pprivName = nameHT[pprivId];

		if (!pprivName) { // 父级权限还未生成
			if (!itemHT[pprivId]) {
				console.error('Can\'t find parent Priv for id=' + privId, privs);
				return;
			}
			privIds.push(privId);
			continue;
		}
		var fullPrivName = pprivName + '-' + priv.name;
		privTree[fullPrivName] = pprivName;
		privHT[fullPrivName] = priv;
		nameHT[privId] = fullPrivName;
	}

	// console.log('PrivData:', privHT, privTree);
}

export default {
	/*  权限结构存在前端，后端只提供角色拥有的权限清单
		data.privs: ['np', 'p1', 'p2-sub1', 'p2-sub2']
	*/
	FrontendSession(data) {
		return new pageSession.SessionClass(data ? IX.inherit(data, {
			privs: getPrivsData(data.privs)
		}) : null);
	},
	/*  权限结构存在后端，后端只提供角色拥有的权限结构和清单
		data.privs: [{id,parentId,name,title,type,idx}]
 	*/
	BackendSession(data) {
		parsePrivsData($XP(data, 'privs', []));
		return new pageSession.SessionClass(data);
	}
};
