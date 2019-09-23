<template>
	<ix-ms-linkage deliveryKeys='key,owner' :selectedItem='selectedItem'
			:master='masterCmp' 
			:slave='slaveCmp'
			@deliver='deliver' />
</template>

<script>
import selectedMixin from '@/components/ixMS/selectedMixin';
import masterMixin from '@/components/ixMS/masterMixin';
import ixMsLinkage from '@/components/ixMS/linkage';

import spCdtMMForm from 'biz-components/spCdtMMForm';
import spCdtMSGrid from 'biz-components/spCdtMSGrid';

export default {
	name: 'spCdtMLink',
	mixins: [selectedMixin, masterMixin],
	data() {
		return {
			masterCmp: spCdtMMForm,
			slaveCmp: spCdtMSGrid
		};
	},
	components: {
		ixMsLinkage
	}
};
</script>