<template>
	<ix-layout :lsideCmp='lsideCmp' @select='select'>
		<template slot='breadcrumb'>《{{routeKey.name}}》的客户数据类型管理</template>
		<sp-cdt-link :selectedItem='routeKey'/>
	</ix-layout>
</template>

<script>
import routeKeyEncode from '@/_mixins/routeKeyEncode';
import routeKeyDecode from '@/_mixins/routeKeyDecode';
import ixLayout from 'src/layout/default';
import lsideCmp from 'components/sideNav/orgTree';
import spCdtLink from 'biz-components/spCdtLink';

export default {
	name: 'CdtPage',
	mixins: [routeKeyEncode, routeKeyDecode], 
	data() {
		return {
			lsideCmp: lsideCmp
		};
	},
	methods: {
		select(item) { this.jumpTo('cdt', 'id+name', item); }
	},
	components: {
		ixLayout,
		spCdtLink
	}
};
</script>

<style lang='less'>
.page-cdt {
	
}
</style>