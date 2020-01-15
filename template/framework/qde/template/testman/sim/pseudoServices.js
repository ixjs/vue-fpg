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
	switch(name) {<% for (var i=0; i<apis.length; i++) { %>
	// reqParams: <%-apis[i].reqStrs %>
	// rspData: <%-apis[i].rspStrs %>
	case '<%-apis[i].name %>':
<%} %>
		simRequest(name, params, cbFn, failFn);
		break;
	default:
		console.error('Unknown apiService: ', name);
		break;
	}
}]
];
