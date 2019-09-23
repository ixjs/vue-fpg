<template>
	<ix-base-select <% if(type == 'ent') { 
	%>nodeType='<%- name %>' apiName='<%- apiNames.selectLoader %>'<%
	} else { %>ctName='<%- name %>'<%
	} %> :value='value'
			:disabled='disabled'
			:placeholder='placeholder'
			@input='select' />
</template>

<script>
import ixBaseSelect from '@/components/ixSelect/<%- base %>Select';
import selectMixins from '@/components/ixSelect/_mixins';

export default {
	name: '<%- cmpName.camelize() %>',
	mixins: [selectMixins],
	<% if(type=='ent') { %>methods: {
		select(item) { this.$emit('input', item ? item.id : null); }
	},
	<%} %>components: {
		ixBaseSelect
	}
};
</script>