module.exports = {
	data() {
		return { routeKey: {} };
	},
	mounted() {
		var key = this.$route.params.key;
		var params = [];
		try {
			params = IX.isEmpty(key) || key == '~' ? [] : Base64.decode(key).split('&');
		} catch (e) {
			params = [];
		}
		this.routeKey = IX.loop(params, {}, (acc, param) => {
			var arr = param.split('=');
			acc[arr[0]] = arr[1];
			return acc;
		});
	}
};