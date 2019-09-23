module.exports = {
	configurations: [],
	navs: ['cdt', 'cdi', { name: 'sys', title: '系统管理', children: 'org,setting' }],
	pages: [{
		name: 'cdt',
		title: '客户数据类型管理',
		routeKey: 'id,name',
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
		routeKey: 'id,name',
		layout: {
			topbar: {
				ifNav: false,
				ifEntry: false
			},
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
	}]
};