<template>
	<ix-base-select nodeType='User' apiName='getUsers4Select' :value='value'
			:disabled='disabled'
			:placeholder='placeholder'
			@input='select' />
</template>

<script>
import ixBaseSelect from '@/components/ixSelect/treeSelect';
import selectMixins from '@/components/ixSelect/_mixins';

export default {
	name: 'entUserSelect',
	mixins: [selectMixins],
	methods: {
		select(item) { this.$emit('input', item ? item.id : null); }
	},
	components: {
		ixBaseSelect
	}
};
</script>