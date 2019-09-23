<template>
	<ct-gender-select :value='form && form[field.name]'
			:disabled='field.disabled'
			:placeholder='field.tip'
			@input='change' />
</template>

<script>
import formItemMixins from '@/components/ixForm/items/_mixins';
import ctGenderSelect from 'components/select/ctGenderSelect';

export default {
	mixins: [formItemMixins],
	components: {
		ctGenderSelect
	}
};
</script>