<template>
	<ix-base-select nodeType='CDType' apiName='getCDTypes4Select' :value='value'
			:disabled='disabled'
			:placeholder='placeholder'
			@input='select' />
</template>

<script>
import ixBaseSelect from '@/components/ixSelect/treeSelect';
import selectMixins from '@/components/ixSelect/_mixins';

export default {
	name: 'entCdtypeSelect',
	mixins: [selectMixins],
	methods: {
		select(item) { this.$emit('input', item ? item.id : null); }
	},
	components: {
		ixBaseSelect
	}
};
</script>