<template>
	<ix-entity-grid entityName='<%- entityName %>'<%- entityAttrs %><% if (disableAutoLoad) {%>
			:autoLoad='false'<% } if (hasPagination) {%>
			:hasPagination='true'<% } if (apiParamsSentences.length > 0) {%>
			:apiParams='apiParams'<%} if (defTrigger.length>0) {%>
			@cellClick='cellClick' @first='gridDeliver'<% } %> />
</template>

<script>
<% for (var i=0; i< mixins.length; i++) { 
%>import <%- mixins[i] %> from '@/components/ixMS/<%- mixins[i] %>';
<%}%>import ixEntityGrid from '@/components/ixGrid/entity';
<% if(defTrigger.length>0){ %>
const DeliverTriggerColumns = '<%- defTrigger %>'.split(',');
<% } for (var i=0; i< triggers.length; i++) { 
%>const Deliver<%-triggers[i].capitalizeType %>TriggerColumns = '<%- triggers[i].cols %>'.split(',');
<% }  %>
export default {
	name: '<%- cmpName %>',
	<% if (mixins.length> 0) { %>mixins: [<%-mixins.join(', ')%>],
	<% } if (apiParamsSentences.length>0) { %>computed: {
		apiParams() {
			return {<% for (var j=0; j<apiParamsSentences.length; j++) { %>
				<%- apiParamsSentences[j] %><%if (j < apiParamsSentences.length-1) {%>,<% } } %>
			}; 
		}
	},
	<% } if (defTrigger.length>0) {%>methods: {
		gridDeliver(row) { this.deliver(row._item); },
		cellClick(colName, row) {
			<% if(defTrigger.length>0) {%>if (IX.Array.isFound(colName, DeliverTriggerColumns))
				return this.deliver(row._item);<% } for (var i=0; i< triggers.length; i++) { %>
			if (IX.Array.isFound(colName, Deliver<%-triggers[i].capitalizeType %>TriggerColumns))
				return this.deliver(row._item, '<%- triggers[i].type %>');<%
			} %>
		}
	},
	<% } %>components: {
		ixEntityGrid
	}
};
</script>