module.exports = {
	sideNavs: [
		{ name: 'orgTree', base: 'tree', refer: 'ENT:Org' }, 
		{ name: 'cdtypeTree', base: 'tree', refer: 'ENT:CDType' }, 
		{ name: 'funcList', base: 'list', target: 'Func', items: [
			{ id: 21, name: '基本功能', nodeType: 'Func' },
			{ id: 11, name: '数据管理类', nodeType: 'Category', children: [
				{ id: 22, name: '客户数据类型', nodeType: 'Func' },
				{ id: 23, name: '客户数据项', nodeType: 'Func' }
			] },
			{ id: 22, name: '系统管理类', nodeType: 'Category', children: [
				{ id: 24, name: '组织管理', nodeType: 'Func' },
				{ id: 25, name: '配置管理', nodeType: 'Func' }
			] }
		] }
	]
};