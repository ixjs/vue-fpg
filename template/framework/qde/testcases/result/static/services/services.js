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
var apiServices = [
	// reqParams: {}
	// rspData: [{id,name,nodeType,children*}]
	['getOrgs4Select', ServerBase + 'getOrgs4Select', 'post'],
	// reqParams: {}
	// rspData: [{id,name,nodeType,children*}]
	['getUsers4Select', ServerBase + 'getUsers4Select', 'post'],
	// reqParams: {}
	// rspData: [{id,name,nodeType,children*}]
	['getCDTypes4Select', ServerBase + 'getCDTypes4Select', 'post'],
	// reqParams: {}
	// rspData: [{id,name,type,addr,desc,children*}]
	['queryOrgs', ServerBase + 'queryOrgs', 'post'],
	// reqParams: {id}
	// rspData: {id,name,type,addr,desc}
	['getOrg', ServerBase + 'getOrg', 'post'],
	// reqParams: {name,type,addr,desc}
	// rspData: {id,name,type,addr,desc}
	['addOrg', ServerBase + 'addOrg', 'post'],
	// reqParams: {id,name,type,addr,desc}
	// rspData: {id,name,type,addr,desc}
	['editOrg', ServerBase + 'editOrg', 'post'],
	// reqParams: {id}
	// rspData: {}
	['removeOrg', ServerBase + 'removeOrg', 'post'],
	// reqParams: {ids}
	// rspData: {}
	['removeAllOrgs', ServerBase + 'removeAllOrgs', 'post'],
	// reqParams: {orgId,pageNo,pageSize}
	// rspData: {total,pageNo,pageSize,list:[{id,name,gender,org.id,org.name,desc}]}
	['queryUsers', ServerBase + 'queryUsers', 'post'],
	// reqParams: {id}
	// rspData: {id,name,gender,org,desc}
	['getUser', ServerBase + 'getUser', 'post'],
	// reqParams: {name,gender,org,desc}
	// rspData: {id,name,gender,org.id,org.name,desc}
	['addUser', ServerBase + 'addUser', 'post'],
	// reqParams: {id,name,gender,org,desc}
	// rspData: {id,name,gender,org.id,org.name,desc}
	['editUser', ServerBase + 'editUser', 'post'],
	// reqParams: {id}
	// rspData: {}
	['removeUser', ServerBase + 'removeUser', 'post'],
	// reqParams: {ids}
	// rspData: {}
	['removeAllUsers', ServerBase + 'removeAllUsers', 'post'],
	// reqParams: {orgId,key,owner}
	// rspData: [{id,name,org.id,org.name,owner.id,owner.name,desc}]
	['queryCDTypes', ServerBase + 'queryCDTypes', 'post'],
	// reqParams: {id}
	// rspData: {id,name,org,owner,desc}
	['getCDType', ServerBase + 'getCDType', 'post'],
	// reqParams: {name,org,owner,desc}
	// rspData: {id,name,org.id,org.name,owner.id,owner.name,desc}
	['addCDType', ServerBase + 'addCDType', 'post'],
	// reqParams: {id,name,org,owner,desc}
	// rspData: {id,name,org.id,org.name,owner.id,owner.name,desc}
	['editCDType', ServerBase + 'editCDType', 'post'],
	// reqParams: {id}
	// rspData: {}
	['removeCDType', ServerBase + 'removeCDType', 'post'],
	// reqParams: {ids}
	// rspData: {}
	['removeAllCDTypes', ServerBase + 'removeAllCDTypes', 'post'],
	// reqParams: {cdtId}
	// rspData: [{id,name,cdType.id,cdType.name,valueType,desc}]
	['queryCDItems', ServerBase + 'queryCDItems', 'post'],
	// reqParams: {id}
	// rspData: {id,name,cdType,valueType,desc}
	['getCDItem', ServerBase + 'getCDItem', 'post'],
	// reqParams: {name,cdType,valueType,desc}
	// rspData: {id,name,cdType.id,cdType.name,valueType,desc}
	['addCDItem', ServerBase + 'addCDItem', 'post'],
	// reqParams: {id,name,cdType,valueType,desc}
	// rspData: {id,name,cdType.id,cdType.name,valueType,desc}
	['editCDItem', ServerBase + 'editCDItem', 'post'],
	// reqParams: {id}
	// rspData: {}
	['removeCDItem', ServerBase + 'removeCDItem', 'post'],
	// reqParams: {ids}
	// rspData: {}
	['removeAllCDItems', ServerBase + 'removeAllCDItems', 'post'],
	// reqParams: {id,actived}
	// rspData: {}
	['setFuncActived', ServerBase + 'setFuncActived', 'post'],
	// reqParams: {id}
	// rspData: {actived}
	['getFuncActived', ServerBase + 'getFuncActived', 'post']
];

IX.ns('IXW.Service');
IXW.Service.SeriveToken = 'x-token';
IXW.Service.entries = [
	['loginService', loginServices],
	['apiService', apiServices]
];
