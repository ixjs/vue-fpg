function simRequest(name, params,cbFn, failFn){
	console.log('Request:', name, params);
	setTimeout(function() {
		var data = Test[name](params);
		if (!data) IX.isFn(failFn) && failFn();
		else cbFn(IXW.dup(data));
	}, 1000);
}

IX.ns('IXW.Service');
IXW.Service.SeriveToken = 'x-token';
localStorage[IXW.Service.SeriveToken] = 'TheTokenFromServer';
IXW.Service.entries = [
['loginService', function (name, params, cbFn, failFn){
	switch(name) {
	// reqParams: {}
	// rspDara: {id,name,privs*}
	case 'session':
		simRequest('getSession', {}, cbFn, failFn);
		break;
	// reqParams: {account,password}
	// rspDara: {id,name,privs*}
	case 'login':
	// reqParams: {}
	// rspDara: {}
	case 'logout':
		simRequest(name, params, cbFn, failFn);
		break;
	}
}], ['apiService', function (name, params, cbFn, failFn) {
	switch(name) {
	// reqParams: {}
	// rspData: [{id,name,nodeType,children*}]
	case 'getOrgs4Select':

	// reqParams: {}
	// rspData: [{id,name,nodeType,children*}]
	case 'getUsers4Select':

	// reqParams: {}
	// rspData: [{id,name,nodeType,children*}]
	case 'getCDTypes4Select':

	// reqParams: {}
	// rspData: [{id,name,type,addr,desc,children*}]
	case 'queryOrgs':

	// reqParams: {id}
	// rspData: {id,name,type,addr,desc}
	case 'getOrg':

	// reqParams: {name,type,addr,desc}
	// rspData: {id,name,type,addr,desc}
	case 'addOrg':

	// reqParams: {id,name,type,addr,desc}
	// rspData: {id,name,type,addr,desc}
	case 'editOrg':

	// reqParams: {id}
	// rspData: {}
	case 'removeOrg':

	// reqParams: {ids}
	// rspData: {}
	case 'removeAllOrgs':

	// reqParams: {orgId,pageNo,pageSize}
	// rspData: {total,pageNo,pageSize,list:[{id,name,gender,org.id,org.name,desc}]}
	case 'queryUsers':

	// reqParams: {id}
	// rspData: {id,name,gender,org,desc}
	case 'getUser':

	// reqParams: {name,gender,org,desc}
	// rspData: {id,name,gender,org.id,org.name,desc}
	case 'addUser':

	// reqParams: {id,name,gender,org,desc}
	// rspData: {id,name,gender,org.id,org.name,desc}
	case 'editUser':

	// reqParams: {id}
	// rspData: {}
	case 'removeUser':

	// reqParams: {ids}
	// rspData: {}
	case 'removeAllUsers':

	// reqParams: {orgId,key,owner}
	// rspData: [{id,name,org.id,org.name,owner.id,owner.name,desc}]
	case 'queryCDTypes':

	// reqParams: {id}
	// rspData: {id,name,org,owner,desc}
	case 'getCDType':

	// reqParams: {name,org,owner,desc}
	// rspData: {id,name,org.id,org.name,owner.id,owner.name,desc}
	case 'addCDType':

	// reqParams: {id,name,org,owner,desc}
	// rspData: {id,name,org.id,org.name,owner.id,owner.name,desc}
	case 'editCDType':

	// reqParams: {id}
	// rspData: {}
	case 'removeCDType':

	// reqParams: {ids}
	// rspData: {}
	case 'removeAllCDTypes':

	// reqParams: {cdtId}
	// rspData: [{id,name,cdType.id,cdType.name,valueType,desc}]
	case 'queryCDItems':

	// reqParams: {id}
	// rspData: {id,name,cdType,valueType,desc}
	case 'getCDItem':

	// reqParams: {name,cdType,valueType,desc}
	// rspData: {id,name,cdType.id,cdType.name,valueType,desc}
	case 'addCDItem':

	// reqParams: {id,name,cdType,valueType,desc}
	// rspData: {id,name,cdType.id,cdType.name,valueType,desc}
	case 'editCDItem':

	// reqParams: {id}
	// rspData: {}
	case 'removeCDItem':

	// reqParams: {ids}
	// rspData: {}
	case 'removeAllCDItems':

	// reqParams: {id,actived}
	// rspData: {}
	case 'setFuncActived':

	// reqParams: {id}
	// rspData: {actived}
	case 'getFuncActived':

		simRequest(name, params, cbFn, failFn);
		break;
	default:
		console.error('Unknown apiService: ', name);
		break;
	}
}]
];
