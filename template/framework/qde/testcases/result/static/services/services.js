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
var apiServices = [
	['getOrgs4Select', ServerBase + 'getOrgs4Select', 'post'],
	['getUsers4Select', ServerBase + 'getUsers4Select', 'post'],
	['getCDTypes4Select', ServerBase + 'getCDTypes4Select', 'post'],
	['queryOrgs', ServerBase + 'queryOrgs', 'post'],
	['getOrg', ServerBase + 'getOrg', 'post'],
	['addOrg', ServerBase + 'addOrg', 'post'],
	['editOrg', ServerBase + 'editOrg', 'post'],
	['removeOrg', ServerBase + 'removeOrg', 'post'],
	['removeAllOrgs', ServerBase + 'removeAllOrgs', 'post'],
	['queryUsers', ServerBase + 'queryUsers', 'post'],
	['getUser', ServerBase + 'getUser', 'post'],
	['addUser', ServerBase + 'addUser', 'post'],
	['editUser', ServerBase + 'editUser', 'post'],
	['removeUser', ServerBase + 'removeUser', 'post'],
	['removeAllUsers', ServerBase + 'removeAllUsers', 'post'],
	['queryCDTypes', ServerBase + 'queryCDTypes', 'post'],
	['getCDType', ServerBase + 'getCDType', 'post'],
	['addCDType', ServerBase + 'addCDType', 'post'],
	['editCDType', ServerBase + 'editCDType', 'post'],
	['removeCDType', ServerBase + 'removeCDType', 'post'],
	['removeAllCDTypes', ServerBase + 'removeAllCDTypes', 'post'],
	['queryCDItems', ServerBase + 'queryCDItems', 'post'],
	['getCDItem', ServerBase + 'getCDItem', 'post'],
	['addCDItem', ServerBase + 'addCDItem', 'post'],
	['editCDItem', ServerBase + 'editCDItem', 'post'],
	['removeCDItem', ServerBase + 'removeCDItem', 'post'],
	['removeAllCDItems', ServerBase + 'removeAllCDItems', 'post'],
	['setFuncActived', ServerBase + 'setFuncActived', 'post'],
	['getFuncActived', ServerBase + 'getFuncActived', 'post']
];

IX.ns('IXW.Service');
IXW.Service.SeriveToken = 'x-token';
IXW.Service.entries = [
	['loginService', loginServices],
	['apiService', apiServices]
];
