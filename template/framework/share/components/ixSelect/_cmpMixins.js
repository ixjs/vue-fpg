var serviceFactory = IXW.ns('serviceFactory');

export default {
	props: {
		items: { type: Array, default: null },
		apiName: { type: String, default: null },
		apiParams: { type: Object, default: null }
	},
	data() {
		return {
			val: null,
			options: []
		};
	},
	watch: {
		value(v) { this.val = (v || (v != null && !isNaN(v))) ? this.getSelectedValue(v) : null; }
	},	
	methods: {
		getSelectedValue(v) { return v; },
		getSelectedItem(v) { return v; },
		createOptions(items) { return items || []; },
		loadFromApi() {
			if (!IX.isString(this.apiName))
				return;

			serviceFactory.apiService(this.apiName, this.apiParams || {}, (data) => {
				this.options = this.createOptions(data);
			});
		},
		change(v) {
			this.val = v;
			this.$emit('input', this.getSelectedItem(v)); 
		}
	}
};