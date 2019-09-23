<template>
	<ix-nav-tree class='tree-style-nav' :activeIndex='activeIndex' :items='items' 
			@select='selectNavItem' />
</template>

<script>
import navMixins from '@/components/ixNav/sideNavMixins';
import ixNavTree from '@/components/ixNav/tree';
import NavModel from '@/components/ixNav/model';

var serviceFactory = IXW.ns('serviceFactory');
var Entity = IXW.ns('Entity.CDType');

export default {
	name: 'cdtypeTree',
	mixins: [navMixins],
	components: {
		ixNavTree
	},
	mounted() {
		serviceFactory.apiService(Entity.apiNames.selectLoader, {}, (data) => {
			this.model = new NavModel(data, Entity.name);
			this.firstLoaded();
		});
	}
};
</script>