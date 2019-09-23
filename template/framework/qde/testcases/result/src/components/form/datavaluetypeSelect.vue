<template>
	<ct-datavaluetype-select :value='form && form[field.name]'
			:disabled='field.disabled'
			:placeholder='field.tip'
			@input='change' />
</template>

<script>
import formItemMixins from '@/components/ixForm/items/_mixins';
import ctDatavaluetypeSelect from 'components/select/ctDatavaluetypeSelect';

export default {
	mixins: [formItemMixins],
	components: {
		ctDatavaluetypeSelect
	}
};
</script>