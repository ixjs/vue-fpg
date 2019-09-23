<template>
	<ix-layout>
		<sp-sys-org-link/>
	</ix-layout>
</template>

<script>
import ixLayout from 'src/layout/default';
import spSysOrgLink from 'biz-components/spSysOrgLink';

export default {
	name: 'SysOrgPage',
	components: {
		ixLayout,
		spSysOrgLink
	}
};
</script>

<style lang='less'>
.page-sys-org {
	
}
</style>