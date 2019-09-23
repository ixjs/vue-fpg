<template>
	<ix-ms-linkage :isVertical='false' deliveryKeys='-' :selectedItem='selectedItem'
			:master='masterCmp' 
			:slave='slaveCmp' />
</template>

<script>
import selectedMixin from '@/components/ixMS/selectedMixin';
import ixMsLinkage from '@/components/ixMS/linkage';

import spCdiMForm from 'biz-components/spCdiMForm';
import spCdiSGrid from 'biz-components/spCdiSGrid';

export default {
	name: 'spCdiLink',
	mixins: [selectedMixin],
	data() {
		return {
			masterCmp: spCdiMForm,
			slaveCmp: spCdiSGrid
		};
	},
	components: {
		ixMsLinkage
	}
};
</script>