// dialogMixin
module.exports = {
	props: {
		id: { type: String, required: true },
		visible: { type: Boolean, default: true },
		transition: { type: [Boolean, String], default: true }
	},
	methods: {
		close() { this.$modal.destroy(this.id); },
		confirm() { this.$emit('confirm', this.id); }
	}
};
