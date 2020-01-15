/** Comments for CommonJS file
	......
 */
var ServerBase = '/api/';
/* Define for each service request;
	1. ['name', 'url', 'type', preDataHandler, errorhandler]
		// default ['name', 'urlPattern', 'GET'(POST,DELETE,PUT,JS), IX.selfFn, null]
	2. {name, url, type, preDataHandler:function(jsonObj), errorhandler: function(err)}

 */
var loginServices = [
	// reqParams: {}
	// rspDara: {id,name,privs*}
	['session', '/session'],
	// reqParams: {account,password}
	// rspDara: {id,name,token,privs*}
	['login', '/session/login', 'POST'],
	// reqParams: {}
	// rspDara: {}
	['logout', '/session/logout']
];
var apiServices = [<% for (var i=0; i<apis.length; i++) { %>
	// reqParams: <%-apis[i].reqStrs %>
	// rspData: <%-apis[i].rspStrs %>
	['<%- apis[i].name %>', ServerBase + '<%- apis[i].name %>', 'post']<% if (i < apis.length - 1) { %>,<%}%><%} %>
];

IX.ns('IXW.Service');
IXW.Service.SeriveToken = 'x-token';
IXW.Service.entries = [
	['loginService', loginServices],
	['apiService', apiServices]
];
