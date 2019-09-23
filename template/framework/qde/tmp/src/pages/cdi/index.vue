<template>
	<ix-layout :ifNav='false' :ifEntry='false' :lsideCmp='lsideCmp' @select='select'>
		<template slot='breadcrumb'>《{{routeKey.name}}》的客户数据管理</template>
		<sp-cdi-link :selectedItem='routeKey'/>
	</ix-layout>
</template>

<script>
import routeKeyEncode from '@/_mixins/routeKeyEncode';
import routeKeyDecode from '@/_mixins/routeKeyDecode';
import ixLayout from 'src/layout/default';
import lsideCmp from 'components/sideNav/cdtypeTree';
import spCdiLink from 'biz-components/spCdiLink';

export default {
	name: 'CdiPage',
	mixins: [routeKeyEncode, routeKeyDecode], 
	data() {
		return {
			lsideCmp: lsideCmp
		};
	},
	methods: {
		select(item) { this.jumpTo('cdi', 'id+name', item); }
	},
	components: {
		ixLayout,
		spCdiLink
	}
};
</script>

<style lang='less'>
.page-cdi {
	
}
</style>