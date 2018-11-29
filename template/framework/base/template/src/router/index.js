var routerUtil = require('@/router');

module.exports = [
{
	path: '/p1',
	name: 'p1',
	component: routerUtil.getPageComponent('p1')
}
// ,{
// 	path: '/entry',
// 	name: 'entry',
// 	component: getPageComponent( 'entry' ),
// 	beforeEnter: (to, from, next) => {
// 		document.body.setAttribute('class', 'entry');
// 		next();
// 	}
// }
].concat([
	// 'p1',	// sample page 1
	['p2',	['sub1', 'sub2']], // sample page 2 and sub page 1/2
	'np'
].map(function (item) {
	return routerUtil.getPageGroupRouter(item);
}));

var nsRoute = IXW.ns('Route');
nsRoute.ifRequireAuth = () => { // function (pageName) {
	return false;
};
// 判断是否独立页面：即需要打开新页并独立渲染；
nsRoute.ifUniquePage = function (modName) {
	return modName == 'np';
};
