<template>
	<ent-user-select :value='form && form[field.name]'
			:disabled='field.disabled'
			:placeholder='field.tip'
			@input='change' />
</template>

<script>
import formItemMixins from '@/components/ixForm/items/_mixins';
import entUserSelect from 'components/select/entUserSelect';

export default {
	mixins: [formItemMixins],
	components: {
		entUserSelect
	}
};
</script>