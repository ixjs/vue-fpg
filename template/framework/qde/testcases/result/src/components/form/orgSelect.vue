<template>
	<ent-org-select :value='form && form[field.name]'
			:disabled='field.disabled'
			:placeholder='field.tip'
			@input='change' />
</template>

<script>
import formItemMixins from '@/components/ixForm/items/_mixins';
import entOrgSelect from 'components/select/entOrgSelect';

export default {
	mixins: [formItemMixins],
	components: {
		entOrgSelect
	}
};
</script>