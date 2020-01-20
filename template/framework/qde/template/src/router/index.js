import { getPageComponent, getPageGroupRouter } from '@/router';

const routes = IX.map([<% for (var i=0; i< routers.length; i++) { 
	if (routers[i].hasRouterKey) {%>
	{ name: '<%- routers[i].name %>', path: '/<%- routers[i].name 
%>/:key', component: getPageComponent('<%- routers[i].name %>')<% 
		if (routers[i].children.length> 0) { %>, children: [<%- routers[i].children %>]<%}%> },<%
	} else if (routers[i].children.length> 0){ %>
	{ name: '<%- routers[i].name %>', children: [<%- routers[i].children %>] },<%
	} else { %>
	'<%- routers[i].name %>',<% } }%>
	'entry'
], function (item) {
	return (!IX.isStaticType(item) && 'component' in item) ? item : getPageGroupRouter(item);
});

export default routes;

var nsRoute = IXW.ns('Route');
nsRoute.ifRequireAuth = (pageName) => {
	return pageName != 'entry'<% for (var i=0; i<unauth.length; i++) { 
		%> && pageName != '<%- unauth[i] %>' <% } %>;
};
// 判断是否独立页面：即需要打开新页并独立渲染；
nsRoute.ifUniquePage = <% if (uniquePages.length == 0) { %>() => { // <%}%>(modName) => {
	return false<% for (var i=0; i<uniquePages.length; i++) { 
		%> || modName == '<%- uniquePages[i] %>' <% } %>;
};