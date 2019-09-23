<template>
	<ix-entity-grid entityName='CDItem'
			:autoLoad='false'
			:apiParams='apiParams' />
</template>

<script>
import slaveMixin from '@/components/ixMS/slaveMixin';
import ixEntityGrid from '@/components/ixGrid/entity';

export default {
	name: 'spCdtSGrid',
	mixins: [slaveMixin],
	computed: {
		apiParams() {
			return {
				cdtId: $XP(this.delivery, 'id', null)
			}; 
		}
	},
	components: {
		ixEntityGrid
	}
};
</script>