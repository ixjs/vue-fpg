import entityFactory from '@/engine/entity';
import formFactory from '@/components/ixForm/formFactory';

<% cmps.forEach(function(item) { 
%>import <%- item.cmpName %> from 'components/form/<%- item.formCmpName %>';
<% }); %>
var codeTables = <%- ctItems %>;

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

var entities = <%- entItems %>;

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

<% cmps.forEach(function(item) { 
%>formFactory.register('<%= item.formCmpKey %>', <%= item.cmpName %>);
<% }); %>
// console.log('All DataTables and Models:', nsConst, nsEntity);