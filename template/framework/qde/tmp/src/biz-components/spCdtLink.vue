<template>
	<ix-ms-linkage :selectedItem='selectedItem'
			:master='masterCmp' 
			:slave='slaveCmp' />
</template>

<script>
import selectedMixin from '@/components/ixMS/selectedMixin';
import ixMsLinkage from '@/components/ixMS/linkage';

import spCdtMLink from 'biz-components/spCdtMLink';
import spCdtSGrid from 'biz-components/spCdtSGrid';
import spCdtSForm from 'biz-components/spCdtSForm';

export default {
	name: 'spCdtLink',
	mixins: [selectedMixin],
	data() {
		return {
			masterCmp: spCdtMLink,
			slaveCmp: {
				'default': spCdtSGrid,
				'form': spCdtSForm
			}
		};
	},
	components: {
		ixMsLinkage
	}
};
</script>