<template>
	<ix-ms-linkage
			:master='masterCmp' 
			:slave='slaveCmp' />
</template>

<script>
import ixMsLinkage from '@/components/ixMS/linkage';

import spSysOrgMGrid from 'biz-components/spSysOrgMGrid';
import spSysOrgSGrid from 'biz-components/spSysOrgSGrid';

export default {
	name: 'spSysOrgLink',
	data() {
		return {
			masterCmp: spSysOrgMGrid,
			slaveCmp: spSysOrgSGrid
		};
	},
	components: {
		ixMsLinkage
	}
};
</script>