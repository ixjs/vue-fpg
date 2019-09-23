import pageSession from '@/session';
import privDefs from './privs';

var DefaultPrivs = privDefs.DefaultPrivs;
var ParentPrivs = privDefs.ParentPrivs;

function getNavItem(privInfo) {
	if (privInfo.type == 'nav')
		return privInfo.name;
	var ppname = ParentPrivs[privInfo.name];
	return ppname ? getNavItem(DefaultPrivs[ppname]) : null;
}

var sessionFactory = IXW.ns('SessionFactory');
sessionFactory.getPageInfo = (pageName) => {
	var pageInfo = DefaultPrivs[pageName];
	return pageInfo ? {
		name: pageName,
		title: pageInfo.title,
		navItem: getNavItem(pageInfo)
	} : null;
};

function getPrivsData(privNames) {
	var items = {};
	var privs = [];
	function pushPriv(privName) {
		var parentName = ParentPrivs[privName];
		if (parentName && !(parentName in items)) {
			// DefaultPrivs[parentName].name = privName;
			pushPriv(parentName);
		}
		items[privName] = true;
		privs.push(DefaultPrivs[privName]);
	}

	IX.iterate(privNames, pushPriv);
	// console.log('PrivData:', privs);
	return privs;
}

function MySession(data) {
	return new pageSession.SessionClass(data ? IX.inherit(data, {
		privs: getPrivsData(data.privs)
	}) : null);
}

export default {
	SessionClass: MySession
};
