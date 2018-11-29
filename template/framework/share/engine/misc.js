var nsMisc = IXW.ns('misc');

function filterFormatNumber(value, len) {
	if (!value) { return '-'; }
	return IX.Math.formatNumber(value, len || 2);
}

nsMisc.init = function (vue) {
	// 逗号分割格式化数字， 可携带一个参数说明小数点后保留位数，默认为2
	vue.filter('if_num', filterFormatNumber);
};