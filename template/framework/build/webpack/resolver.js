exports.srcResolve4Project = function (prjResolve) {
	var shareDir = prjResolve('../framework/share');
	var nodeModulesDir = prjResolve('../node_modules');
	var srcDir = prjResolve('src');

	return {
		extensions: ['.js', '.vue', '.json'],
		modules: [shareDir, srcDir, nodeModulesDir],
		alias: {
			'@': shareDir,
			'src': srcDir,

			'components': prjResolve('src/components'),
			'biz-components': prjResolve('src/biz-components'),
			'pages': prjResolve('src/pages')
		}
	};
};