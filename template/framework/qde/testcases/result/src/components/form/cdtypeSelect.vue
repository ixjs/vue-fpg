<template>
	<ent-cdtype-select :value='form && form[field.name]'
			:disabled='field.disabled'
			:placeholder='field.tip'
			@input='change' />
</template>

<script>
import formItemMixins from '@/components/ixForm/items/_mixins';
import entCdtypeSelect from 'components/select/entCdtypeSelect';

export default {
	mixins: [formItemMixins],
	components: {
		entCdtypeSelect
	}
};
</script>