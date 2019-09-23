// http://eslint.cn/docs/user-guide/configuring
// https://www.npmjs.com/package/eslint
var srcResolve = {
	extensions: ['.js', '.vue', '.json'],
	modules: ['framework/share', 'node_modules']
};
module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true
	},
	globals : {
		'Base64' : false,
		'IX' : false,
		'IXW' : false,
		'IXW_NS' : false,
		'$XP' : false,
		'$Xw' : false,
		'$XD' : false,
		'$XH' : false
	},

	extends: 'airbnb-base',
	// required to lint *.vue files
	plugins: [ 'html' ],

	// check if imports actually resolve
	'settings': {
		'import/resolver': {
			'webpack': {
				'config': { resolve: srcResolve }
			}
		}
	},
	// add your custom rules here, refer to http://eslint.cn/docs/rules/
	'rules': {
		'no-tabs' : 0,
		'no-extra-semi' : 2,
		'no-var' : 0,
		'indent' : 0,
		'curly' : 0,
		'comma-dangle' : 0,
		'consistent-return' : 0,
		'global-require' : 0,
		'prefer-template' : 0,
		'prefer-arrow-callback' : 0,
		'no-trailing-spaces':0,
		'no-underscore-dangle' : 0,
		'func-names' : 0,
		'object-shorthand' : 0,
		'one-var' : 0,
		'one-var-declaration-per-line' : 0,
		'no-param-reassign' : 0,
		'no-mixed-operators' : 0,
		'eqeqeq' : 0,
		'no-nested-ternary' : 0,
		'no-use-before-define' : 0,
		'no-continue': 0,
		'wrap-iife': 0,
		'quote-props': 0,
		'vars-on-top': 0,
		'eol-last': 0,
		'object-property-newline': 0,
		'default-case': 0,

		'import/no-extraneous-dependencies' : 0,
		'import/no-dynamic-require' : 0,
		'arrow-body-style': ['error', 'always'],

		// don't require .vue extension when importing
		'import/extensions': ['error', 'always', {
			'js': 'never',
			'vue': 'never'
		}],
		// allow debugger during development
		'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
	}
}
