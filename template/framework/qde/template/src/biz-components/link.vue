<template>
	<ix-ms-linkage<% if (!isVertical) {%> :isVertical='false'<%
		} %><% if (deliveryKeys != null) {%> deliveryKeys='<%- deliveryKeys %>'<%
		} %><% if (useSelectedItem) {%> :selectedItem='selectedItem'<% } %>
			:master='masterCmp' 
			:slave='slaveCmp'<% if (deliverToParent) {%>
			@deliver='deliver'<% } %> />
</template>

<script>
<% for (var i=0; i< mixins.length; i++) { 
%>import <%- mixins[i] %> from '@/components/ixMS/<%- mixins[i] %>';
<%}%>import ixMsLinkage from '@/components/ixMS/linkage';

import <%- masterCmp %> from 'biz-components/<%- masterCmp %>';
import <%- defSlaveCmp %> from 'biz-components/<%- defSlaveCmp %>';
<% for (var i=0; i< slaveCmps.length; i++) { 
%>import <%- slaveCmps[i].name %> from 'biz-components/<%- slaveCmps[i].name %>';
<% } %>
export default {
	name: '<%- cmpName %>',
	<% if (mixins.length> 0) { %>mixins: [<%-mixins.join(', ')%>],
	<% } %>data() {
		return {
			masterCmp: <%- masterCmp %>,
			<% if(slaveCmps.length>0){ %>slaveCmp: {
				'default': <%- defSlaveCmp %>,
				<% for (var i=0; i< slaveCmps.length; i++) { 
				%>'<%- slaveCmps[i].type %>': <%- slaveCmps[i].name %><% if (i < slaveCmps.length -1) {%>,
				<%} } %>
			}<%} else {%>slaveCmp: <%- defSlaveCmp %><% } %>
		};
	},
	components: {
		ixMsLinkage
	}
};
</script>