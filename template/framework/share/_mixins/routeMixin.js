var nsRoute = IXW.ns('Route');
module.exports = {
	data() {
		return { routeKey: {} };
	},
	methods: {
		jumpTo: function (name, paramsStr) {
			var keyValue = paramsStr ? Base64.encode(paramsStr) : '';
			nsRoute.jumpTo(name, { key: keyValue });
		}
	},
	mounted() {
		var key = this.$route.params.key;
		var params = IX.isEmpty(key) ? '' : key;
		try {
			params = Base64.decode(key).split('&');
		} catch (e) {
			params = [];
		}
		this.routeKey = IX.loop(params, {}, function (acc, param) {
			var arr = param.split('=');
			acc[arr[0]] = arr[1];
			return acc;
		});
	}
};