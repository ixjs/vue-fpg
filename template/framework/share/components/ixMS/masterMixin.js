module.exports = {
	methods: {
		deliver(item, key) { this.$emit('deliver', item, key); },
	}
};