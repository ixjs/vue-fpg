function formatAttr(attrs, level) {
	return '';
}
function outputValue(val, level, isCompact) {
	if (IX.isBoolean(val) || val === null || val === undefined || IX.isNumber(val))
		return val;
	// console.log('====1');
	if (IX.isString(val))
		return '\'' + val.replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + '\'';
	// console.log('====2');
	if (IX.isArray(val))
		return formatArr(val, level, isCompact);
	// console.log('====3');
	return formatObj(val, level, isCompact);	 
}

function formatObj(obj, level, isCompact) {
	// console.log('===================format obj:', JSON.stringify(obj).substring(0,40));
	var Tabs = '\t'.multi(level + 1);
	var splitor = isCompact ? ', ': (',\n' + Tabs);
	var objStrs = [];
	IX.each(obj, [], (acc, val, key) => {
		// console.log('===================format val in obj:', key, JSON.stringify(obj[key]).substring(0,40));
		objStrs.push('\'' + key + '\': ' + outputValue(obj[key], level + 1, isCompact)); 
	});

	return '{ ' + objStrs.join(splitor) + ' }';
}
function formatArr(arr, level, isCompact) {
	// console.log('====================format obj:', JSON.stringify(arr).substring(0,40));
	var Tabs = '\t'.multi(level + 1);
	return '[\n' + IX.map(arr, (item) => {
		// console.log('===================format val in arr:', JSON.stringify(item).substring(0,40));
		return Tabs + outputValue(item, level, isCompact === undefined ? true : isCompact);
	}).join(',\n') + '\n' + '\t'.multi(level)  + ']';
}

exports.formatAttrs = (attrs, level) => { return formatAttrs(attrs, level || 0); };
exports.formatObj = (obj, level) => { return formatObj(obj, level || 0); };
exports.formatArr = (arr, level) => { return formatArr(arr, level || 0); };
exports.format = outputValue;