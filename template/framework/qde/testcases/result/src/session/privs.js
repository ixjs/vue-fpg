export default {
	DefaultPrivs: {
		'cdt': { id: 1, parentId: 0, title: '客户数据类型管理', name: 'cdt', type: 'nav', idx: 1 },
		'cdi': { id: 2, parentId: 0, title: '客户数据管理', name: 'cdi', type: 'nav', idx: 2 },
		'sys': { id: 3, parentId: 0, title: '系统管理', name: 'sys', type: 'nav', idx: 3 },
		'sys-org': { id: 4, parentId: 3, title: '组织结构管理', name: 'org', type: 'nav', idx: 4 },
		'sys-setting': { id: 5, parentId: 3, title: '配置项管理', name: 'setting', type: 'nav', idx: 5 }
	},
	ParentPrivs: {
		'sys-org': 'sys',
		'sys-setting': 'sys'
	}
};
