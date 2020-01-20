import VueRouter from 'vue-router';

var nsRoute = IXW.ns('Route');
var SessionFactory = IXW.ns('SessionFactory');

var Vue = null;
var router = null;
var isInitialized = false;
var modRouters = [];
var AllPageRouters = {};

function parseRouters(routes, isMod) {
	IX.iterate(routes, function (r) {
		var name = r.name;
		AllPageRouters[name] = r;
		if (isMod) 
			modRouters.push(r);
		parseRouters(r.children || [], false);
	});
}

function getRouterPath(name, params) {
	var r = router.resolve({ name: name, params: IX.inherit({ key: '~' }, params) });
	return r.route.fullPath;
}
// check if page can be visited by current user!
function checkIfValid(name) {
	var toName = name;
	if (name.substring(0, 1) == '/') {
		if (name == '/')
			return true;
		var r = router.match(name);
		toName = r.name;
	}
	if (!toName)
		return false;
	if (!nsRoute.ifRequireAuth(toName)) // check if it is public page 
		return true;
	var session = SessionFactory.getInstance();
	return session.checkIfRsrcValid(toName);
}

// 判断是否需要新打开弹窗
function checkIfOpenUniquePage(path) {
	var r = router.match(path);
	var nextModName = r.matched[0].name;
	var currentModName = router.currentRoute.matched[0].name;
	return (nsRoute.ifUniquePage(nextModName) && currentModName != nextModName);
}
function getFirstValidSubRoute(subRoutes) {
	for (var i = 0; i < subRoutes.length; i += 1)
		if (checkIfValid(subRoutes[i].name))
			return subRoutes[i];
	return null;
}
function redirectRoute(r) {
	var children = (r.name == null) ? modRouters : $XP(AllPageRouters, r.name + '.children', []);
	var subR = getFirstValidSubRoute(children || []);
	return subR == null ? null : getRouterPath(subR.name, r.params);
}

nsRoute.init = function (vue, pageRouters) {
	if (isInitialized)
		return;

	isInitialized = true;
	Vue = vue;
	Vue.use(VueRouter);
	router = new VueRouter({ routes: pageRouters });

	parseRouters(pageRouters, true);
	router.beforeEach(function (to, from, next) {
		var toName = to.name || to.fullPath;
		if (!checkIfValid(toName)) {
			console.error("Can't visit page becuase of priviledge :", toName);
			return next({ path: '/' });
		}
		var path = redirectRoute(to);
		if (path == null) next();
		else next({ path: path });
	});
};
nsRoute.getInstance = function () { return router; };
nsRoute.getRouterPath = getRouterPath;
nsRoute.jumpTo = function (name, params) {
	var path = name;
	if (name.substring(0, 1) != '/') 
		path = getRouterPath(name, params);

	if (!checkIfValid(path)) {
		console.error("Can't visit path becuase of priviledge :", path);
		return;
	}
	// 判断是否需要新打开弹窗
	if (path !== '/' && checkIfOpenUniquePage(path))
		window.open('#' + path, '_blank');
	else
		router.push(path);
};
