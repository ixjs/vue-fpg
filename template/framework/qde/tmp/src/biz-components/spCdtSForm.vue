<template>
	<ix-form class='compact-form' entityName='CDType' :entity='delivery.id' />
</template>

<script>
import slaveMixin from '@/components/ixMS/slaveMixin';
import ixForm from '@/components/ixForm/entity';

export default {
	name: 'spCdtSForm',
	mixins: [slaveMixin],
	components: {
		ixForm
	}
};
</script>