function getPageComponent(pageName, subPageName) {
	// var filename = ;
	try {
		return require('pages/' + pageName.toLowerCase() 
			+ '/' + (subPageName ? subPageName.toLowerCase() : 'index') + '.vue');
	} catch (e) {
		console.error('fail to get page component:', 'pages/' + pageName.toLowerCase() 
			+ '/' + (subPageName ? subPageName.toLowerCase() : 'index') + '.vue', e);
		return null;
	}
}

function getPageRouter(pageName) {
	var subPageName = pageName.split('/').pop();
	return {
		path: subPageName.toLowerCase(),
		name: pageName.replace(/\//g, '-'),
		component: getPageComponent(pageName)
	};
}
function getSubPageRouter(pageName, subPageName) {
	return {
		path: subPageName.toLowerCase(),
		name: pageName.replace(/\//g, '-') + '-' + subPageName,
		component: getPageComponent(pageName, subPageName)
	};
}

/**
 *  @param pageItem :
 *  0.	'PageName'
 *  1.	['PageName', [children]]
 *  2.	{name: 'PageName', children: [pageItem], ...}
 *
 * 	@param actionFn : function(name, children, origItem)
 */
function _parsePageCfg(pageItem, actionFn) {
	if (IX.isString(pageItem))
		return actionFn(pageItem, []);

	/* eslint-disable vars-on-top */
	var isArray = IX.isArray(pageItem);
	var pageName = $XP(pageItem, isArray ? '0' : 'name');
	if (!pageName)
		return null;
	return actionFn(pageName,
		$XP(pageItem, isArray ? '1' : 'children', []),
		isArray ? null : pageItem
	);
}

/**
 *  @param subPageItem :
 *  // no children
 *  	subPageName
 *  	[subPageName]
 *  	{name: subPageName, ...}
 *  // with children
 *  	[subPageName, [subPageItem, ...]]
 *  	{name: subPageName, children: [subPageItem], ...}
 */
function getSubPageItem(pageName, subPageItem) {
	return _parsePageCfg(subPageItem, function (subPageName, children, item) {
		var router = (children && children.length > 0) ?
				getPageItem(pageName + '/' + subPageName, children) :
				getSubPageRouter(pageName, subPageItem);
		// if (isFirst)
		// 	router.alias = '';
		return IX.inherit(item, router);
	});
}

function getPageItem(pageName, children) {
	var router = getPageRouter(pageName);
	if (children && children.length > 0)
		router.children = IX.map(children, function (subPageItem, idx) {
			return getSubPageItem(pageName, subPageItem, idx === 0);
		});
	// console.log('router:', router);
	return router;
}
/*
 *  @param  pgcfg :
 *  0. 'pageName'
 * 	1. [pageName, [subPageItem]]
 * 	2. {
 * 		name: pageName,
 * 		...
 *		children: [ subPageItem ] //first subPageName Will be default!
 *	}
 */
function getPageGroupRouter(pgcfg, isHomeEntry) {
	return _parsePageCfg(pgcfg, function (pageName, children, item) {
		var router = getPageItem(pageName, children);
		router.path = '/' + (isHomeEntry ? '' : router.path);
		return IX.inherit(item, router);
	});
}

module.exports = {
	getPageComponent,
	getPageGroupRouter
};