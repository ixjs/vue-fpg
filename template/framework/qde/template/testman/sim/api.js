var entityFactory = require('./entityFactory');

/* eslint-disable */
entityFactory.registerTypes({<% for (var i=0; i<typedRef.length; i++) { %>
	<%- typedRef[i] %><% if (i < typedRef.length-1) {%>,<%}
%><%}%>
});
var SimData = <%- simData %>;

var parseEntity = entityFactory.parseEntity;
IX.iterate(SimData, function (typedData) {
	var type = typedData.name;
	IX.iterate(typedData.items, function(entity) {
		parseEntity(type, entity);
	});
});

var getEntity = entityFactory.getEntity;
var addEntity = entityFactory.addEntity;
var editEntity = entityFactory.editEntity;
var removeEntity = entityFactory.removeEntity;
var removeEntities = entityFactory.removeEntities;
var queryEntities = entityFactory.queryEntities;
var getEntityTree4Select = entityFactory.getEntityTree4Select;

module.exports = {
<% for (var i=0; i<apis.length; i++) { 
%>	'post /<%- apis[i].name %>'<% if (apis[i].methodName) { 
	%>(params) { return <%- apis[i].methodName %>('<%- apis[i].type %>', params); <% } else {
	%>() { return <%- apis[i].result %>; <% }%>}<% if (i < apis.length-1) {%>,<%}
	%>
<%} %>};