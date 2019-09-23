(function(){
var Test = IX.ns('Test');

var sessionData = {
	'id': 1,
	'name': 'admin',
	'privs': [<%- defPrivs %>]
};

var isLogin = !!localStorage['x-token'];
function getSession() {
	return isLogin ? sessionData : {};
}

var Name = 'admin', Pass = '4QrcOUm6Wau+VuBX8g+IPg==';

Test.getSession = getSession;

Test.login = function(params) {
	isLogin = params.account == Name && params.password == Pass;
	localStorage['x-token'] = 'TheTokenFromServer';
	return isLogin ? IX.inherit(sessionData, {
		token: 'TheTokenFromServer'
	}) : null;
};

Test.logout = function() {
	isLogin = false;
	localStorage['x-token'] = '';
	return {};	
};

})();