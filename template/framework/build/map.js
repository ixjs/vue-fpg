var fs = require('fs');
var path = require('path');

var utils = require('../lib/node/utils');

var projectFolder = process.argv[2];
var mapConfig = utils.getProjectConfig(projectFolder, 'map');
if (!mapConfig)
	return;

var srcDir = utils.$resolve('build/map');
var targetFile = mapConfig.target;
var scale = mapConfig.scale || 600;
var provList = mapConfig.provinces || 'all';
var requiredProvHT = IX.loop(provList.split(','), {}, function (acc, name) {
	acc[name] = true;
	return acc;
});

var fileData = [
'(function () {',
'var nsMap = IX.ns(\'IXW.Map\');',
'',
'nsMap.LocalMap = {'
];

var provInfoHT = {};
var provinces = require(path.join(srcDir, 'provinces.json'));

IX.iterate(provinces, function (item) {
	provInfoHT[item.name] = item;
});

if (mapConfig.includeChinaMap) {
	var entry = require(path.join(srcDir, 'entry.json'));
	var chinaGeoData = require(path.join(srcDir, 'china.json'));
	var southseaSvg = fs.readFileSync(path.join(srcDir, 'southchinasea.svg'));

	var chinaData = entry.china;

	IX.iterate(chinaGeoData.objects.collection.geometries, function (item) {
		item.properties.id = provInfoHT[item.properties.name].id;
	});

	chinaData.scale = scale;
	chinaData.geo = chinaGeoData;
	chinaData.svg = southseaSvg.toString().replace(/\n/g, '');

	// mapData.china = chinaData;
	fileData.push('china: ' + JSON.stringify(chinaData));
} else
	fileData.push('none: ""');

IX.iterate(provinces, function (item) {
	if (!requiredProvHT.all && !requiredProvHT[item.name])	
		return;

	var bbox = item.bbox;
	var prvn = IX.inherit(item, {
		cp: [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2], // prvn.cp,
		bbox: bbox,
		scale: Math.floor(scale * Math.min(61.2 / (bbox[2] - bbox[0]), 35.8 / (bbox[3] - bbox[1])))
	});

	prvn.geo = require(path.join(srcDir, 'province/' + item.id + '.json'));

	// mapData[item.id] = prvn;
	fileData.push(',' + item.id + ': ' + JSON.stringify(prvn));
});

fileData.push('};');
fileData.push('})();');

IX.safeWriteFileSync(targetFile, fileData.join('\n'));

console.log('Map done! please check:', targetFile);