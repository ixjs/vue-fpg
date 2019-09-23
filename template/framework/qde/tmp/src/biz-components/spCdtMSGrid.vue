<template>
	<ix-entity-grid entityName='CDType'
			:autoLoad='false'
			:apiParams='apiParams'
			@cellClick='cellClick' @first='gridDeliver' />
</template>

<script>
import selectedMixin from '@/components/ixMS/selectedMixin';
import masterMixin from '@/components/ixMS/masterMixin';
import slaveMixin from '@/components/ixMS/slaveMixin';
import ixEntityGrid from '@/components/ixGrid/entity';

const DeliverTriggerColumns = 'org,owner,desc'.split(',');
const DeliverFormTriggerColumns = 'name'.split(',');

export default {
	name: 'spCdtMSGrid',
	mixins: [selectedMixin, masterMixin, slaveMixin],
	computed: {
		apiParams() {
			return {
				orgId: $XP(this.selectedItem, 'id', null),
				key: $XP(this.delivery, 'key', null),
				owner: $XP(this.delivery, 'owner', null)
			}; 
		}
	},
	methods: {
		gridDeliver(row) { this.deliver(row._item); },
		cellClick(colName, row) {
			if (IX.Array.isFound(colName, DeliverTriggerColumns))
				return this.deliver(row._item);
			if (IX.Array.isFound(colName, DeliverFormTriggerColumns))
				return this.deliver(row._item, 'form');
		}
	},
	components: {
		ixEntityGrid
	}
};
</script>