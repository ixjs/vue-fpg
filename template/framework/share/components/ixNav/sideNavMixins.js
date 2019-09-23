export default {
	props: {
		focused: { type: [String, Number], default: null }
	},
	data() {
		return {
			activeIndex: null,
			items: []
		};
	},
	methods: {
		firstLoaded() {
			this.items = this.model.getAll();
			if (this.focused) {
				this.activeIndex = this.model.getFocusedIndex(this.focused);
				return;
			}
			this.activeIndex = this.model.getFirstIndex();
			this.selectNavItem(this.activeIndex);
		},
		selectNavItem(index) {
			var item = this.model.getByIndex(index);
			if (item)
				this.$emit('select', item);
		}
	}
};
