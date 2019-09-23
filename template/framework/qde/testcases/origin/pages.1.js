module.exports = {
	configurations: [{
		name: 'spCdiLink',
		cfg: {
			type: 'ms-linkage',
			master: 'CFG:spCdiMForm',
			delivery: '-',
			slave: 'CFG:spCdiSGrid'
		}
	}, {
		name: 'spCdtLink',
		cfg: {
			type: 'ms-linkage',
			master: 'CFG:spCdtMLink',
			slave: {
				'default': 'CFG:spCdtSGrid',
				'form': 'CFG:spCdtSForm'
			}
		}
	},{
		name: 'spCdtMLink',
		cfg: {
			type: 'ms-linkage',
			master: 'CFG:spCdtMMForm',
			delivery: 'key,owner',
			slave: 'CFG:spCdtMSGrid'
		}
	}, {
		name: 'spSysOrgLink',
		cfg: {
			type: 'ms-linkage',
			master: 'CFG:spSysOrgMGrid',
			slave: 'CFG:spSysOrgSGrid'
		}
	}, {
		name: 'spCdiSGrid',
		cfg: {
			type: 'grid',
			entityName: 'CDItem',
			apiParams: {
				cdtId: 'selectedItem.id'
			}
		}
	},{
		name: 'spCdtMSGrid',
		cfg: {
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
	}, {
		name: 'spCdtSGrid',
		cfg: {
			type: 'grid',
			entityName: 'CDItem',
			apiParams: {
				cdtId: 'delivery.id'
			}
		}
	}, {
		name: 'spSysOrgMGrid',
		cfg: {
			type: 'grid',
			entityName: 'Org',
			buttons: '-',
			actions: '-',
			cellClick: {
				'name,type': 'deliver'
			}
		}
	}, {
		name: 'spSysOrgSGrid',
		cfg: {
			type: 'grid',
			entityName: 'User',
			buttons: '-',
			actions: '-',
			hasPagination: true,
			apiParams: {
				orgId: 'delivery.id'
			}
		}
	},{
		name: 'spCdtMMForm',
		cfg: {
			type: 'form',
			fields: [
				{ name: 'key', label: '关键字', tip: '请输入查询关键字' },
				{ name: 'owner', label: '管理员', type: 'ENT:User', tip: '根据管理员筛选查询' }
			],
			buttons: [],
			submit: 'deliver'
		}
	}, {
		name: 'spCdtSForm',
		cfg: {
			type: 'form',
			entityName: 'CDType',
			entity: 'delivery.id'
		}
	}, {
		name: 'spCdiMForm',
		cfg: {
			type: 'form',
			entityName: 'CDType',
			entity: 'selectedItem.id'
		}
	}, {
		name: 'spSysSettingForm',
		cfg: {
			type: 'form',
			fields: [
				{ name: 'name', label: '功能项', disabled: true },
				{ name: 'actived', label: '是否启用', type: 'bool' }
			],
			buttons: [
				{ name: 'submit', text: '确认' }
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
	}],
	navs: [
		{ name: 'cdt', title: '客户数据类型管理' },
		{ name: 'cdi', title: '客户数据管理' },
		{ name: 'sys', title: '系统管理', children: [
			{ name: 'org', title: '组织结构管理' },
			{ name: 'setting', title: '配置项管理' }
		] }
	],
	pages: [{
		name: 'cdt',
		title: '客户数据类型管理',
		pathPattern: '/cdt/:key',
		routeKey: [
			{ name: 'id', defValue: null },
			{ name: 'name', defValue: null }
		],
		ifAuth: true,
		ifUnique: false,
		layout: {
			type: 'default',
			// topbar: {
			// 	ifNav: true,
			// 	ifEntry: true
			// },
			lside: {
				cmp: 'orgTree',
				select: 'jumpTo(cdt, id+name)'
				// function (orgId, org) {this.jumpTo('cdt', { id: org.id, name: org.name });}
			},
			titlebar: '《{{routeKey.name}}》的客户数据类型管理',
			page: 'CFG:spCdtLink'
		}
	}, {
		name: 'cdi',
		title: '客户数据项管理',
		pathPattern: '/cdi/:key',
		routeKey: [
			{ name: 'id', defValue: null },
			{ name: 'name', defValue: null }
		],
		ifAuth: true,
		ifUnique: false,
		layout: {
			type: 'default',
			// topbar: {
			// 	ifNav: true,
			// 	ifEntry: true
			// },
			lside: {
				cmp: 'cdtypeTree',
				select: 'jumpTo(cdi, id+name)'
				// function (cdtId, cdt) {this.jumpTo('cdi', { id: cdt.id, name: cdt.name });}
			},
			titlebar: '《{{routeKey.name}}》的客户数据管理',
			page: 'CFG:spCdiLink'
		}
	}, {
		name: 'sys-org',
		title: '组织结构管理',
		pathPattern: 'sys/org',
		ifAuth: true,
		ifUnique: false,
		layout: {
			type: 'default',
			// topbar: {
			// 	ifNav: true,
			// 	ifEntry: true
			// },
			page: 'CFG:spSysOrgLink'
		}
	}, {
		name: 'sys-setting',
		title: '配置项管理',
		pathPattern: 'sys/setting',
		ifAuth: true,
		ifUnique: false,
		layout: {
			type: 'default',
			// topbar: {
			// 	ifNav: true,
			// 	ifEntry: true
			// },
			lside: {
				cmp: 'funcList',
				select: 'selectedItem=item'
				// function (item) { this.selectedItem = item;}
			},
			titlebar: '配置项管理 : <i>{{ selectedItem && selectedItem.name }}</i>',
			page: 'CFG:spSysSettingForm'
		}
	}]
}; 
