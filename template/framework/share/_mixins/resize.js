module.exports = {
	methods: {
		handleResize() {}
	},
	mounted() {
		this.handleResize();
		this.listenerResize = $Xw.listen('resize', (e) => {
			this.handleResize(e);
		});
	},
	beforeDestroy() {
		this.listenerResize.remove();
	}
};