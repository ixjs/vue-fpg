<template>
	<ix-nav-tree class='<%- type %>-style-nav' :activeIndex='activeIndex' :items='items' 
			@select='selectNavItem' />
</template>

<script>
import navMixins from '@/components/ixNav/sideNavMixins';
import ixNavTree from '@/components/ixNav/tree';
import NavModel from '@/components/ixNav/model';
<% if (isReferTo) {%>
var serviceFactory = IXW.ns('serviceFactory');
var Entity = IXW.ns('Entity.<%- entity %>');
<% } else {%>
const model = new NavModel(<%- dataItems %>, '<%- target %>');
<% } %>
export default {
	name: '<%- name %>',
	mixins: [navMixins],
	components: {
		ixNavTree
	},
	mounted() {
		<% 
		if (isReferTo) {
		%>serviceFactory.apiService(<%- apiName %>, {}, (data) => {
			this.model = new NavModel(data, <%- target %>);
			this.firstLoaded();
		});<% 
		} else { 
		%>this.model = model;
		this.firstLoaded();<% 
		} %>
	}
};
</script>