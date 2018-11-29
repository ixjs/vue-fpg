// http://eslint.cn/docs/user-guide/configuring
// https://www.npmjs.com/package/eslint
var path = require('path');
var merge = require('webpack-merge');

var resolver = require('../framework/build/webpack/resolver');
var sharedEslintrc = require('../framework/env/.eslintrc');

var srcResolve = resolver.srcResolve4Project(function (dir) { 
	return path.join(__dirname, dir); 
});

module.exports = merge(sharedEslintrc, {
	// project-based eslint globals;
	globals : {
	
	},
	// check if imports actually resolve
	'settings': {
		'import/resolver': {
			'webpack': {
				'config': { resolve: srcResolve }
			}
		}
	},
	// project-based eslint rules;
	'rules' : {

	}
});
