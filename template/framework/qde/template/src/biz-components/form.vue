<template>
	<ix-form<%if(isCompactForm){%> class='compact-form'<%
			} if (formType=='entity') { 
			%> entityName='<%- entityName %>' :entity='<%- entityId %>'<% 
			} else { %> :form='form' :fields='fields' :btns='btns'<% if(autoSubmit){ %>
			:autoSubmit='true'<% } %>
			@submit='<%- submitMethod %>'<% } %> />
</template>

<script>
<% for (var i=0; i< mixins.length; i++) { 
%>import <%- mixins[i] %> from '@/components/ixMS/<%- mixins[i] %>';
<%}%>import ixForm from '@/components/ixForm/<%- formType %>';
<% if(callService){ %>
var serviceFactory = IXW.ns('serviceFactory');
<% } %>
export default {
	name: '<%- cmpName %>',
	<% if (mixins.length> 0) { %>mixins: [<%-mixins.join(', ')%>],
	<% } if (dataItems && dataItems.length > 0) { %>data() {
		return <%- dataItems %>;
	},
	<% } if (selectedTrigger) {%>watch: {
		selectedItem() {
			this.form.<%-keyFieldName%> = null;
			this.load();
		}
	},
	<% } if (methods && methods.length>0) {%>methods: {<% 
		for (var i=0;i<methods.length;i++) { %>
		<%- methods[i].name %>() {
			<% if(methods[i].name == 'submit') {
				%>if (this.inSubmit)
				return;
			this.inSubmit = true;
			<% } 
			%>serviceFactory.apiService('<%- methods[i].apiName %>', {<%for (var j=0; j<methods[i].apiParams.length; j++) {%>
				<%- methods[i].apiParams[j] %><% if(methods[i].apiParams.length - 1 > j ) {%>,<%} else {%>
			<%} } %>}, (<%- methods[i].namedRsp%>) => {<%
			for (var j=0; j<methods[i].rspSentences.length; j++) { %>
				<%- methods[i].rspSentences[j] %>;<% } %><% if(methods[i].name == 'submit') {%>
				this.inSubmit = false;<% } %>
			});
		}<% if (i < methods.length -1) {%>,<% } }%>
	},
	<% } %>components: {
		ixForm
	}
};
</script>