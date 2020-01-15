/* eslint-disable */
var Privs = [<%- defPrivs %>];
var sessionData = {
	id: 1,
	name: 'admin',
	'privs': Privs
};
var Name = 'admin', Pass = '4QrcOUm6Wau+VuBX8g+IPg==';
var isLogin = true;

module.exports = {
	'get /'() {
		// if (flag) throw new Error('Error message');
		return isLogin ? sessionData : {};
	},
	'post /login'(params) {
		isLogin = params.account == Name && params.password == Pass;

		if (isLogin)
			throw new Error('Unmatched name and password');
		return IX.inherit(sessionData, {
			token: 'TheTokenFromServer'
		});
	},
	'get /logout'() {
		isLogin = false;
		return {};
	},
	// example only
	'get /key/:id/:name'(params, outputDir) { 
		IX.safeWriteFileSync(outputDir + '/abc.txt', 'ABCDEFG');
		return {
			msg: params.id + '::' + params.name
		};
	}
};