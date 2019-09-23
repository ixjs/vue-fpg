export default {
	props: {
		value: null,
		disabled: { type: Boolean, default: false },
		placeholder: { type: String, default: '请选择：' }
	},
	methods: {
		select(item) { this.$emit('input', item); }
	}
};