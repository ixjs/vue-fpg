import { getPageComponent, getPageGroupRouter } from '@/router';

const routes = IX.map([
	{ name: 'cdt', path: '/cdt/:key', component: getPageComponent('cdt') },
	{ name: 'cdi', path: '/cdi/:key', component: getPageComponent('cdi') },
	{ name: 'sys', children: ['org', 'setting'] },
	'entry'
], function (item) {
	return (!IX.isStaticType(item) && 'component' in item) ? item : getPageGroupRouter(item);
});

export default routes;

var nsRoute = IXW.ns('Route');
nsRoute.ifRequireAuth = (pageName) => {
	return pageName != 'entry';
};
// 判断是否独立页面：即需要打开新页并独立渲染；
nsRoute.ifUniquePage = () => { // (modName) => {
	return false;
};
