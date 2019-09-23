<template>
	<ix-form class='compact-form' entityName='CDType' :entity='selectedItem.id' />
</template>

<script>
import selectedMixin from '@/components/ixMS/selectedMixin';
import ixForm from '@/components/ixForm/entity';

export default {
	name: 'spCdiMForm',
	mixins: [selectedMixin],
	components: {
		ixForm
	}
};
</script>