<template>
	<el-checkbox :value="form && form[field.name]" :disabled="field.disabled" 
			@input="change" />
</template>
<script>
import mixins from './_mixins';

export default {
	mixins: [mixins]
};
</script>