import { getPageComponent, getPageGroupRouter } from '@/router';

const routes = [
{
	path: '/p1',
	name: 'p1',
	component: getPageComponent('p1')
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
	// 'p1',
	['p2',	['sub1', 'sub2']], // sample page 2 and sub page 1/2
	'np',
	'entry'
].map((item) => { // 不要简化，诡异！
	return getPageGroupRouter(item);
}));

export default routes;

var nsRoute = IXW.ns('Route');
nsRoute.ifRequireAuth = (pageName) => {
	return pageName != 'entry';
};
// 判断是否独立页面：即需要打开新页并独立渲染；
nsRoute.ifUniquePage = (modName) => {
	return modName == 'np';
};