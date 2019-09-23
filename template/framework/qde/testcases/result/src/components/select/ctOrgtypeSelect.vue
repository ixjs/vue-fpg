<template>
	<ix-base-select ctName='OrgType' :value='value'
			:disabled='disabled'
			:placeholder='placeholder'
			@input='select' />
</template>

<script>
import ixBaseSelect from '@/components/ixSelect/ctSelect';
import selectMixins from '@/components/ixSelect/_mixins';

export default {
	name: 'ctOrgtypeSelect',
	mixins: [selectMixins],
	components: {
		ixBaseSelect
	}
};
</script>