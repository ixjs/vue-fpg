import entityFactory from '@/engine/entity';
import formFactory from '@/components/ixForm/formFactory';

import ctOrgtypeSelect from 'components/form/orgtypeSelect';
import ctGenderSelect from 'components/form/genderSelect';
import ctDatavaluetypeSelect from 'components/form/datavaluetypeSelect';
import entOrgSelect from 'components/form/orgSelect';
import entUserSelect from 'components/form/userSelect';
import entCdtypeSelect from 'components/form/cdtypeSelect';

var codeTables = [
	{ 'name': 'OrgType', 'label': '组织类型', 'values': [
		{ 'label': '省部级', 'value': 1 },
		{ 'label': '地市级', 'value': 2 },
		{ 'label': '区县级', 'value': 3 }
	] },
	{ 'name': 'Gender', 'label': '性别', 'values': [
		{ 'label': '男', 'value': 'male' },
		{ 'label': '女', 'value': 'female' }
	] },
	{ 'name': 'DataValueType', 'label': '数据值类型', 'values': [
		{ 'label': '文字型', 'value': 1 },
		{ 'label': '数字型', 'value': 2 },
		{ 'label': '布尔型', 'value': 3 }
	] }
];

var nsConst = IXW.ns('Const');
IX.iterate(codeTables, (ctItem) => {
	var name = ctItem.name;

	nsConst[name + 'Label'] = ctItem.label;
	nsConst[name + 'Set'] = ctItem.values;
	nsConst[name + 'HT'] = IX.loop(ctItem.values, {}, (acc, valueItem) => {
		acc[valueItem.value] = valueItem.label;
		return acc;
	});
});

var entities = [
	{ 'name': 'Org', 'label': '组织', 'columns': [
		{ 'name': 'name', 'label': '组织名称' },
		{ 'name': 'type', 'label': '组织类型', 'type': 'CT:OrgType' },
		{ 'name': 'addr', 'label': '地址' },
		{ 'name': 'desc', 'label': '简要说明', 'type': 'text' }
	], 'enableSelect': true },
	{ 'name': 'User', 'label': '用户', 'columns': [
		{ 'name': 'name', 'label': '用户名称' },
		{ 'name': 'gender', 'label': '性别', 'type': 'CT:Gender' },
		{ 'name': 'org', 'label': '所属组织', 'type': 'ENT:Org' },
		{ 'name': 'desc', 'label': '简要说明', 'type': 'text' }
	], 'enableSelect': true },
	{ 'name': 'CDType', 'label': '客户数据类型', 'columns': [
		{ 'name': 'name', 'label': '类型名称' },
		{ 'name': 'org', 'label': '所属组织', 'type': 'ENT:Org' },
		{ 'name': 'owner', 'label': '管理员', 'type': 'ENT:User' },
		{ 'name': 'desc', 'label': '简要说明', 'type': 'text' }
	], 'enableSelect': true },
	{ 'name': 'CDItem', 'label': '客户数据项', 'columns': [
		{ 'name': 'name', 'label': '数据项名称' },
		{ 'name': 'cdType', 'label': '类型', 'type': 'ENT:CDType' },
		{ 'name': 'valueType', 'label': '数据项值类型', 'type': 'CT:DataValueType' },
		{ 'name': 'desc', 'label': '备注', 'type': 'text' }
	] }
];

// name: {
// 	name,
// 	label,
// 	getColumns(colNames) 
// 	apiNames 
// 	buttons 
// 	parse(item) { return {id, _item, _actions, colName:colValue, children} }
// };
var nsEntity = IXW.ns('Entity');
IX.iterate(entities, (entity) => {
	nsEntity[entity.name] = entityFactory.register(entity);
});

formFactory.register('CT:OrgType', ctOrgtypeSelect);
formFactory.register('CT:Gender', ctGenderSelect);
formFactory.register('CT:DataValueType', ctDatavaluetypeSelect);
formFactory.register('ENT:Org', entOrgSelect);
formFactory.register('ENT:User', entUserSelect);
formFactory.register('ENT:CDType', entCdtypeSelect);

// console.log('All DataTables and Models:', nsConst, nsEntity);