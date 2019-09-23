module.exports = {
	name: 'cdd',
	fullname: '客户数据管理系统',
	codeTables: [{
		name: 'OrgType', label: '组织类型', values: [
			{ label: '省部级', value: 1 },
			{ label: '地市级', value: 2 },
			{ label: '区县级', value: 3 }
		]
	}, {
		name: 'Gender', label: '性别', values: [
			{ label: '男', value: 'male' },
			{ label: '女', value: 'female' }
		]
	}, {
		name: 'DataValueType', label: '数据值类型', values: [
			{ label: '文字型', value: 1 },
			{ label: '数字型', value: 2 },
			{ label: '布尔型', value: 3 }
		]
	}],
	entities: [{
		name: 'Org', label: '组织', columns: [
			{ name: 'name', label: '组织名称' },
			{ name: 'type', label: '组织类型', type: 'CT:OrgType' },
			{ name: 'addr', label: '地址' },
			{ name: 'desc', label: '简要说明', type: 'text' }
		], 
		selectCmp: 'tree', treeAttr: 'parentId'
	}, {
		name: 'User', label: '用户', columns: [
			{ name: 'name', label: '用户名称' },
			{ name: 'gender', label: '性别', type: 'CT:Gender' },
			{ name: 'org', label: '所属组织', type: 'ENT:Org' },
			{ name: 'desc', label: '简要说明', type: 'text' }
		],
		selectCmp: 'tree'
	}, {
		name: 'CDType', label: '客户数据类型', columns: [
			{ name: 'name', label: '类型名称' },
			{ name: 'org', label: '所属组织', type: 'ENT:Org' },
			{ name: 'owner', label: '管理员', type: 'ENT:User' },
			{ name: 'desc', label: '简要说明', type: 'text' }
		],
		selectCmp: 'tree'
	}, {
		name: 'CDItem', label: '客户数据项', columns: [
			{ name: 'name', label: '数据项名称' },
			{ name: 'cdType', label: '类型', type: 'ENT:CDType' },
			{ name: 'valueType', label: '数据项值类型', type: 'CT:DataValueType' },
			{ name: 'desc', label: '备注', type: 'text' }
		]
	}],
	configurations: [],
	navs: ['cdt', 'cdi', { name: 'sys', title: '系统管理', children: 'org,setting' }],
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
	],
	pages: [{
		name: 'cdt',
		title: '客户数据类型管理',
		routeKey: true,
		layout: {
			lside: {
				cmp: 'orgTree',
				select: 'jumpTo(cdt, id+name)'
			},
			titlebar: '《{{routeKey.name}}》的客户数据类型管理',
			page: {
				type: 'ms-linkage',
				master: {
					type: 'ms-linkage',
					master: {
						type: 'form',
						fields: [
							{ name: 'key', label: '关键字', tip: '请输入查询关键字' },
							{ name: 'owner', label: '管理员', type: 'ENT:User', tip: '根据管理员筛选查询' }
						],
						submit: 'deliver'
					},
					delivery: 'key,owner',
					slave: {
						type: 'grid',
						entityName: 'CDType',
						cellClick: {
							'name': 'deliver.form',
							'org,owner,desc': 'deliver'
						},
						apiParams: {
							orgId: 'selectedItem.id',
							key: 'delivery.key',
							owner: 'delivery.owner'
						}
					}
				},
				slave: {
					"default": {
						type: 'grid',
						entityName: 'CDItem',
						apiParams: {
							cdtId: 'delivery.id'
						}
					},
					"form" : {
						type: 'form',
						entityName: 'CDType',
						entity: 'delivery.id'
					}
				}
			}
		}
	}, {
		name: 'cdi',
		title: '客户数据管理',
		routeKey: true,
		layout: {
			lside: {
				cmp: 'cdtypeTree',
				select: 'jumpTo(cdi, id+name)'
			},
			titlebar: '《{{routeKey.name}}》的客户数据管理',
			page: {
				type: 'ms-linkage',
				layout: 'horizon',
				master: {
					type: 'form',
					entityName: 'CDType',
					entity: 'selectedItem.id'
				},
				delivery: '-',
				slave: {
					type: 'grid',
					entityName: 'CDItem',
					apiParams: {
						cdtId: 'selectedItem.id'
					}
				}
			}
		}
	}, {
		name: 'sys-org',
		title: '组织结构管理',
		layout: {
			page: {
				type: 'ms-linkage',
				master: {
					type: 'grid',
					entityName: 'Org',
					buttons: '-',
					actions: '-',
					cellClick: {
						'name,type': 'deliver'
					}
				},
				slave: {
					type: 'grid',
					entityName: 'User',
					buttons: '-',
					actions: '-',
					hasPagination: true,
					apiParams: {
						orgId: 'delivery.id'
					}
				}
			}
		}
	}, {
		name: 'sys-setting',
		title: '配置项管理',
		layout: {
			lside: {
				cmp: 'funcList',
				select: 'selectedItem=item'
			},
			titlebar: '配置项管理 : <i>{{ selectedItem && selectedItem.name }}</i>',
			page: {
				type: 'form',
				fields: [
					{ name: 'name', label: '功能项', disabled: true },
					{ name: 'actived', label: '是否启用', type: 'bool' }
				],
				buttons: [
					{ name: 'submit', label: '确认' }
				],
				load: {
					apiName: 'getFuncActived',
					apiParams: {
						id: 'selectedItem.id'
					},
					rsp: {
						'form.name': 'selectedItem.name',
						'form.actived': 'data.actived'
					}
				},
				submit: {
					apiName: 'setFuncActived',
					apiParams: {
						id: 'selectedItem.id',
						actived: 'form.actived'
					}
				}
			}
		}
	}],
	simData: {
		Org: [
			{ id: 1, parentId: 0, name: '总行', type: 1, addr: '北京市中心', desc: '总行位于北京市' },
			{ id: 11, parentId: 1, name: '渠道管理部', type: 2, addr: '北京市复兴门', desc: '分行位于金融街' },
			{ id: 12, parentId: 1, name: '风险管理部', type: 2, addr: '上海市东方明珠', desc: '分行位于东方明珠' },
			{ id: 13, parentId: 1, name: '科技信息部', type: 2, addr: '北京市北四环高斯大厦', desc: '科技部位于高斯大厦' },
			{ id: 21, parentId: 13, name: '架构中心', type: 3, addr: '北京市北四环高斯大厦四层', desc: '科技部位于高斯大厦' },
			{ id: 22, parentId: 13, name: '需求中心', type: 3, addr: '北京市北四环高斯大厦五层', desc: '科技部位于高斯大厦' }
		],
		User: [
			{ id: 21, org: 13, name: '李部', gender: 'male', desc: '科技信息部部长' },
			{ id: 22, org: 21, name: '谭总', gender: 'male', desc: '架构中心总经理' },
			{ id: 23, org: 21, name: '张三', gender: 'male', desc: '架构中心成员' },
			{ id: 24, org: 22, name: '王总', gender: 'male', desc: '需求中心总经理' },
			{ id: 25, org: 22, name: '李四', gender: 'female', desc: '需求中心成员' }
		],
		CDType: [
			{ id: 21, name: '基础类', org: 1, owner: 23, desc: '基础类XX' },
			{ id: 22, name: '媒介类', org: 11, owner: 23, desc: '媒介类YY' },
			{ id: 23, name: '区域数据', org: 11, owner: 23, desc: '区域数据ZZ' },
			{ id: 24, name: '资产评估', org: 12, owner: 23, desc: '资产评估WWW' },
			{ id: 25, name: '信用评估', org: 12, owner: 23, desc: '信用评估UUUU' }
		],
		CDItem: [
			{ id: 21, name: '姓名', cdType: 21, valueType: 1, desc: '客户姓名X' },
			{ id: 22, name: '性别', cdType: 21, valueType: 1, desc: '客户性别X' },
			{ id: 23, name: '手机号', cdType: 21, valueType: 2, desc: '客户手机号X' },
			{ id: 24, name: '手机型号', cdType: 22, valueType: 2, desc: '手机型号XX' },
			{ id: 25, name: '地区', cdType: 23, valueType: 3, desc: '客户手机号X' },
			{ id: 26, name: '民族', cdType: 23, valueType: 3, desc: '手机型号XX' }
		]
	}
};