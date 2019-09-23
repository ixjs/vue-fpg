<template>
	<ct-orgtype-select :value='form && form[field.name]'
			:disabled='field.disabled'
			:placeholder='field.tip'
			@input='change' />
</template>

<script>
import formItemMixins from '@/components/ixForm/items/_mixins';
import ctOrgtypeSelect from 'components/select/ctOrgtypeSelect';

export default {
	mixins: [formItemMixins],
	components: {
		ctOrgtypeSelect
	}
};
</script>