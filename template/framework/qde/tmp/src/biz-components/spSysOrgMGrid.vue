<template>
	<ix-entity-grid entityName='Org' buttons='-' actions='-'
			@cellClick='cellClick' @first='gridDeliver' />
</template>

<script>
import masterMixin from '@/components/ixMS/masterMixin';
import ixEntityGrid from '@/components/ixGrid/entity';

const DeliverTriggerColumns = 'name,type'.split(',');

export default {
	name: 'spSysOrgMGrid',
	mixins: [masterMixin],
	methods: {
		gridDeliver(row) { this.deliver(row._item); },
		cellClick(colName, row) {
			if (IX.Array.isFound(colName, DeliverTriggerColumns))
				return this.deliver(row._item);
		}
	},
	components: {
		ixEntityGrid
	}
};
</script>