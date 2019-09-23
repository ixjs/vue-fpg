<template>
	<ix-layout<% if (!ifNav) { %> :ifNav='false'<% 
			} if (!ifEntry) { %> :ifEntry='false'<% 
			} if (lsideCmp) { %> :lsideCmp='lsideCmp' @select='select'<% } %>>
		<% if (titlebar) { %><template slot='breadcrumb'><%- titlebar %></template>
		<% } %><<%- bizCmpTag %><% if (useRouteKey) {%> :selectedItem='routeKey'<%
		} else if (useSelectedItem) {%> :selectedItem='selectedItem'<% } %>/>
	</ix-layout>
</template>

<script>
<% if (encodeRouteKey) { %>import routeKeyEncode from '@/_mixins/routeKeyEncode';
<% } if (useRouteKey) { %>import routeKeyDecode from '@/_mixins/routeKeyDecode';
<% }%>import ixLayout from 'src/layout/<%- layoutType %>';
<% if (lsideCmp) { %>import lsideCmp from 'components/sideNav/<%- lsideCmp %>';
<% } %>import <%- bizCmpName %> from 'biz-components/<%- bizCmpName %>';

export default {
	name: '<%- name %>',
	<% if (mixins.length > 0) { %>mixins: [<%-mixins.join(', ') %>], 
	<% } if (lsideCmp) { %>data() {
		return {
			<% if (useSelectedItem) {%>selectedItem: null,
			<% } %>lsideCmp: lsideCmp
		};
	},
	methods: {
		select(item) { <% if (encodeRouteKey) {%>this.jumpTo('<%- toPageName %>', '<%- toPageAttrs %>', item);<%
		} else if (useSelectedItem) {%>this.selectedItem = item;<% } 
		%> }
	},
	<% } %>components: {
		ixLayout,
		<%- bizCmpName %>
	}
};
</script>

<style lang='less'>
.page-<%- tag %> {
	
}
</style>