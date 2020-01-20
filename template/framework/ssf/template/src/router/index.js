import { getPageComponent } from '@/router';

const routes = [{
	path: '/ssf/:key',
	name: 'ssf',
	component: getPageComponent('ssf')
}];

export default routes;

var nsRoute = IXW.ns('Route');
nsRoute.ifRequireAuth = () => { // (pageName) => {
	return false;
};
// 判断是否独立页面：即需要打开新页并独立渲染；
nsRoute.ifUniquePage = (modName) => {
	// console.log('check if unique page: ', modName);
	return modName == 'ssf';
};