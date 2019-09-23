var ServerBase = 'http://localhost:8087/api/';

/* Define for each service request;
	1. ['name', 'url', 'type', preDataHandler, errorhandler]
		// default ['name', 'urlPattern', 'GET'(POST,DELETE,PUT,JS), IX.selfFn, null]
	2. {name, url, type, preDataHandler:function(jsonObj), errorhandler: function(err)}

 */ 
var loginServices = [
	['session', ServerBase + 'session.do', 'POST'],
	['login', ServerBase + 'login.do', 'POST'],
	['logout', ServerBase + 'logout.do', 'POST']
];
var apiServices = [<% for (var i=0; i<apis.length; i++) { %>
	['<%- apis[i].name %>', ServerBase + '<%- apis[i].name %>', 'post']<% if (i < apis.length - 1) { %>,<%}%><%} %>
];

IX.ns('IXW.Service');
IXW.Service.SeriveToken = 'x-token';
IXW.Service.entries = [
	['loginService', loginServices],
	['apiService', apiServices]
];
