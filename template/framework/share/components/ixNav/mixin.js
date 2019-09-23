export default {
	props: {
		activeIndex: { type: String },
		items: { type: Array, default: () => { return []; } }
	},
	methods: {
		selectNavItem(key, keyPath) {
			this.$emit('select', key, keyPath);
		}
	}
};