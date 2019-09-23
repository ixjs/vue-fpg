module.exports = {
	methods: {
		handleScroll() {}
	},
	mounted() {
		this.handleScroll();
		this.listenerScroll = $Xw.listen('scroll', (e) => {
			this.handleScroll(e);
		});
	},
	beforeDestroy() {
		this.listenerScroll.remove();
	}
};