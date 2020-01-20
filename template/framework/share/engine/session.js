function SimpleSession(data) {
	var _data = IX.inherit(data, {});
	return {
		isValid() { return _data.id; },
		get() { return _data; }
	};
}
var sessionClz = SimpleSession;
var session = new SimpleSession();

var initListeners = [];
var clearListeners = []; 
function newInstance(_sessionData) {
	session = sessionClz(_sessionData);
	IX.iterate(initListeners, function (fn) { fn(session); });
}
function clearInstance() {
	session = sessionClz(); 
	IX.iterate(clearListeners, function (fn) { fn(); });
}

var serviceFactory = IXW.ns('serviceFactory');
var sessionFactory = IXW.ns('SessionFactory');
sessionFactory.register = function (clz) {
	if (IX.isFn(clz)) sessionClz = clz;
};
sessionFactory.listen = function (evtName, fn) {
	if (evtName != 'init' && evtName != 'clear')
		return;
	var listeners = evtName == 'init' ? initListeners : clearListeners;
	listeners.push(fn);
};
sessionFactory.unlisten = function (evtName) {
	if (evtName != 'init' && evtName != 'clear')
		return;
	if (evtName == 'init')
		initListeners = [];
	else 
		clearListeners = [];
};

sessionFactory.getInstance = function () { return session; };
sessionFactory.resetSession = function (data) { newInstance(data); };

function doClear(cbFn) {
	clearInstance();
	if (IX.isFn(cbFn)) cbFn(session);
}
sessionFactory.loadSession = function (cbFn) {
	// 判断有没有token, 如果有，才会请求session接口
	if (!serviceFactory.getToken()) 
		return doClear(cbFn);
	serviceFactory.loginService('session', {}, function (data) {
		newInstance(data);
		cbFn(session);
	}, function () {
		doClear(cbFn);
	});	
};
sessionFactory.clearSession = function (cbFn) {
	serviceFactory.loginService('logout', {}, function () {
		doClear(cbFn);
	});
};
