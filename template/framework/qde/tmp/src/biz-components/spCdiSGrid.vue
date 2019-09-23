<template>
	<ix-entity-grid entityName='CDItem'
			:apiParams='apiParams' />
</template>

<script>
import selectedMixin from '@/components/ixMS/selectedMixin';
import ixEntityGrid from '@/components/ixGrid/entity';

export default {
	name: 'spCdiSGrid',
	mixins: [selectedMixin],
	computed: {
		apiParams() {
			return {
				cdtId: $XP(this.selectedItem, 'id', null)
			}; 
		}
	},
	components: {
		ixEntityGrid
	}
};
</script>