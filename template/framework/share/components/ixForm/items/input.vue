<template>
	<el-input :value="form && form[field.name]" :disabled="field.disabled"
			:placeholder="field.tip" 
			@input="change" />
</template>
<script>
import mixins from './_mixins';

export default {
	mixins: [mixins]
};
</script>