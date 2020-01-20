var Privs = [{
	'id': 1, 'parentId': 0, 'title': 'SSF PAGE', 
	'name': 'ssf', 'type': 'page', 'idx': 0
}];

module.exports = {
	'get /'() {
		// if (flag) throw new Error('Error message');
		return {
			'id': 1,
			'name': 'admin',
			'privs': Privs
		};
	},
	// example only
	'get /key/:id/:name'(params, outputDir) {
		IX.safeWriteFileSync(outputDir + '/abc.txt', 'ABCDEFG');
		return {
			msg: params.id + '::' + params.name
		};
	}
};