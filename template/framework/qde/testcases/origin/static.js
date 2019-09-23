module.exports = {
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