var p1 = require('./data/p1.json');
var p1data = require('./data/p1data.json');
var p2 = require('./data/p2.json');
var p2data = require('./data/p2data.json');

module.exports = {
	'get /a': p1,
	'post /a-data': p1data,
	'get /b': p2,
	'post /b-data': p2data
};