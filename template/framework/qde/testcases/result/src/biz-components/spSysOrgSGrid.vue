<template>
	<ix-entity-grid entityName='User' buttons='-' actions='-'
			:autoLoad='false'
			:hasPagination='true'
			:apiParams='apiParams' />
</template>

<script>
import slaveMixin from '@/components/ixMS/slaveMixin';
import ixEntityGrid from '@/components/ixGrid/entity';

export default {
	name: 'spSysOrgSGrid',
	mixins: [slaveMixin],
	computed: {
		apiParams() {
			return {
				orgId: $XP(this.delivery, 'id', null)
			}; 
		}
	},
	components: {
		ixEntityGrid
	}
};
</script>