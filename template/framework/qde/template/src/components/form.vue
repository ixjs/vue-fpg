<template>
	<<%- cmpTag %> :value='form && form[field.name]'
			:disabled='field.disabled'
			:placeholder='field.tip'
			@input='change' />
</template>

<script>
import formItemMixins from '@/components/ixForm/items/_mixins';
import <%- cmpName %> from 'components/select/<%- cmpName %>';

export default {
	mixins: [formItemMixins],
	components: {
		<%- cmpName %>
	}
};
</script>