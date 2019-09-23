<template>
	<ix-html-editor :content="form && form[field.name]" :disabled="field.disabled"
			:placeholder="field.tip" 
			@input="change" />
</template>
<script>
import ixHtmlEditor from '../../ixHtmlEditor';
import mixins from './_mixins';

export default {
	mixins: [mixins],
	components: {
		ixHtmlEditor
	}
};
</script>