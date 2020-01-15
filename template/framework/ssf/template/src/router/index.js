var routerUtil = require('@/router');

module.exports = [{
	path: '/ssf/:key',
	name: 'ssf',
	component: routerUtil.getPageComponent('ssf')
}];

var nsRoute = IXW.ns('Route');
nsRoute.ifRequireAuth = () => { // function (pageName) {
	return false;
};
// 判断是否独立页面：即需要打开新页并独立渲染；
nsRoute.ifUniquePage = function (modName) {
	console.log('check if unique page: ', modName);
	return modName == 'ssf';
};
