import VueResource from 'vue-resource';

var serviceFactory = IXW.ns('serviceFactory');

/** Comments for CommonJS file
	......
 */
var Vue = null;
var commonFailFn = IX.emptyFn;
var isInitialized = false;
var serviceToken = null;

function getToken() {
	serviceToken = localStorage['service-token'] || null;
}
function setToken(token) {
	localStorage['service-token'] = token;
	serviceToken = token;
}
function clearToken() {
	localStorage['service-token'] = '';
	serviceToken = null;
}

/*
	@entry : RouteDef
	1. ['name', 'url', 'type',preDataHandler, errorhandler, paramHandler]
	// default ['name', 'urlPattern', 'GET'(POST,DELETE,PUT,JS), IX.selfFn, null]
	2. {name, url, type, 
			preDataHandler:function(jsonObj), 
			errorhandler: function(err), 
			paramHandler: function(params)
		}
 */
function getRouteRequest(entry) {
	var isArray = IX.isArray(entry);
	var name = entry[isArray ? 0 : 'name'];
	var url = entry[isArray ? 1 : 'url'];
	var urlFn = IX.isFn(url) ? url : function (params) {
		return url.replaceByParams(params);
	};
	var isLogout = name == 'logout';
	var isLogin = name == 'login';

	var type = (entry[isArray ? 2 : 'type'] || 'get').toLowerCase();
	var withoutBody = !(type === 'post' || type === 'put' || type === 'patch');

	var preDataHandler = entry[isArray ? 3 : 'preDataHandler'];
	var entryFailFn = entry[isArray ? 4 : 'errorhandler'];
	var paramHandler = entry[isArray ? 5 : 'paramHandler'];
	if (!IX.isFn(preDataHandler))
		preDataHandler = IX.selfFn;
	if (!IX.isFn(paramHandler))
		paramHandler = IX.selfFn;

	return function (params, cbFn, failFn) {
		var _url = urlFn(params);
		var _params = paramHandler(params);
		var _options = IX.inherit(!isLogout ? {
			headers: { token: serviceToken }
		} : {
			params: { token: serviceToken }
		}, withoutBody ? { params: _params } : { emulateJSON: false });

		var ajaxRequest = withoutBody 
				? Vue.http[type](_url, _options) 
				: Vue.http[type](_url, _params, _options);

		if (!IX.isFn(entryFailFn))
			entryFailFn = commonFailFn;

		var _failFn = IX.isFn(failFn) ? failFn : entryFailFn;
		ajaxRequest.then(function (rsp) {
			rsp.json().then(function (rspData) {
				if (name.indexOf('-nocode') >= 0) 
					return cbFn(preDataHandler(rspData));

				if (rspData.code != 200 && rspData.code != 0)
					return _failFn(rspData);

				if (isLogout)
					clearToken();
				else if (isLogin)
					setToken(rspData.token);

				cbFn(preDataHandler(rspData.data || rspData));
			});
		}, function (rsp) {
			_failFn({
				code: -1,
				err: 'Failed:' + rsp.status + ':' + rsp.statusText,
				msg: rsp.body.msg
			});
		}).catch(function (error) {
			_failFn({
				code: -1,
				err: 'Exception:' + error
			});
		});
		return ajaxRequest;
	};
}
/**  
	@routeMapping : [RouteDef]
 */
function createServiceEngine(serviceEntry) {
	var serviceName = serviceEntry[0];
	var routeMapping = serviceEntry[1];
	var routeHT = {};

	if (IX.isFn(routeMapping)) {
		serviceFactory[serviceName] = routeMapping;
		return;
	}

	routeMapping.forEach(function (entry) {
		var routeName = $XP(entry, IX.isArray(entry) ? '0' : 'name', null);
		if (!routeName) return;
		routeHT[routeName] = getRouteRequest(entry);
	});

	serviceFactory[serviceName] = function (name, params, cbFn, failFn) {
		var routeRequestFn = routeHT[name];
		if (IX.isFn(routeRequestFn))
			return routeRequestFn(params, cbFn, failFn);

		(IX.isFn(failFn) ? failFn : commonFailFn)({
			code: -1,
			err: 'Method:' + name + ' for service "' + serviceName + '" not found!'
		});
	};
}

serviceFactory.getToken = function () { return serviceToken; };
serviceFactory.init = function (vue, serviceEntries) {
	if (!isInitialized) {
		isInitialized = true;
		Vue = vue;
		Vue.use(VueResource);

		// Vue.http.headers.common['token'] = localStorage['service-token'];
		getToken();
	}
	if (serviceEntries)
		serviceEntries.forEach(createServiceEngine);
};
serviceFactory.register = function (serviceEntries) {
	if (serviceEntries)
		serviceEntries.forEach(createServiceEngine);
};
serviceFactory.registerErrorHandler = function (failFn) {
	if (IX.isFn(failFn)) commonFailFn = failFn;
};
serviceFactory.unregisterErrorHandler = function () {
	commonFailFn = IX.emptyFn;
};
