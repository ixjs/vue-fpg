var nsRoute = IXW.ns('Route');
module.exports = {
	methods: {
		jumpTo(name, paramsStr, item) {
			var pArr = paramsStr ? paramsStr.split('+') : [];
			if (name == this.$route.name) {
				this.routeKey = IX.loop(pArr, {}, (acc, pname) => {
					acc[pname] = $XP(item, pname);
					return acc;
				});
			}
			var arr = IX.map(pArr, (pname) => { return pname + '=' + item[pname]; });
			var keyValue = arr.length > 0 ? Base64.encode(arr.join('&')) : '~';
			nsRoute.jumpTo(name, { key: keyValue });
		}
	}
};