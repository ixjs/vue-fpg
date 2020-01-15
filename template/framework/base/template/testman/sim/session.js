/* eslint-disable */
var Privs = [
	{ id: 1,   parentId: 0, title: 'Page 1',       name: 'p1',   type: 'nav',  idx: 0},
	{ id: 2,   parentId: 0, title: 'Page 2',       name: 'p2',   type: 'nav',  idx: 1 },
	{ id: 21,  parentId: 2, title: 'Sub Page 2.1', name: 'sub1', type: 'nav',  idx: 1 },
	{ id: 22,  parentId: 2, title: 'Sub Page 2.2', name: 'sub2', type: 'nav',  idx: 2 },
	{ id: 100, parentId: 0, title: 'Unique Page',  name: 'up',   type: 'page', idx: 100 }
];
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
	'get /key/:id/:name'(params, outputDir) {
		IX.safeWriteFileSync(outputDir + '/abc.txt', 'ABCDEFG');
		return {
			msg: params.id + '::' + params.name
		};
	}
};