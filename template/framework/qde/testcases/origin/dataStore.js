module.exports = {
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
	}]
};