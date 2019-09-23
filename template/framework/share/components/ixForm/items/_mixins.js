module.exports = {
	props: {
		field: { type: Object, default: {} },
		form: Object
	},
	methods: {
		change(v) { this.$emit('change', this.field.name, v); }
	}
};