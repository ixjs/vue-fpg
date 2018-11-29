var fs = require('fs');
var PNG = require('pngjs').PNG;

function collectImage(imageFileName, cbFn) {
	var pngParser = new PNG();
	pngParser.on('error', function (err) {
		console.err('Error:', err);
	});
	pngParser.on('parsed', function () {
		cbFn({
			width: this.width,
			height: this.height
		});
	});
	fs.createReadStream(imageFileName).pipe(pngParser);
}

function getFileInfoList(srcPath, clzPrefix, cbFn) {
	function base64Encode(filename) {
		return new Buffer(fs.readFileSync(srcPath + '/' + filename)).toString('base64');
	}
	var files = fs.readdirSync(srcPath);
	// console.info('background list :\n\t' + util.inspect(files));
	var list = [];
	var total = 0;
	files.forEach(function (fname) {
		var arr = fname.split('.');
		if (arr.length != 2 || arr.pop().toLowerCase() != 'png')
			return;

		var clzName = arr[0];
		var arr1 = clzName.split('_');
		var pf = arr1[0].toLowerCase();

		total += 1;
		setTimeout(function () {
			collectImage(srcPath + '/' + fname, function (result) {
				// console.info('background  :\n\t' + fname, result);
				var infoArr = [];
				var direct = 'no-repeat'; 

				var w = result.width, h = result.height;

				if (pf != 'v') 
					infoArr.push('height:' + h + 'px;');
				if (pf != 'h') 
					infoArr.push('width:' + w + 'px;');	
				switch (pf) {
				case 'h': direct = 'repeat-x'; break;
				case 'v': direct = 'repeat-y'; break;
				case 'vh': direct = 'repeat'; break;
				}

				list.push({
					prefix: clzPrefix,
					name: clzName,
					info: infoArr.join(''),
					data: base64Encode(fname),
					direct: direct
				});
			});
		}, 0);
	});

	function _checkReady() {
		if (total == list.length)
			return cbFn(list);
		return setTimeout(_checkReady, 500);
	}
	_checkReady();
}
/** cfg :{
 *		path : the filename for generated less file
 *		classPrefix : prefix for all background in src folder
 * 		src : the direction contain origin background images
 * 		dest : directoy to contain less file
 * } 
 */
module.exports = function (cfg, cb) {
	var clzPrefix = cfg.classPrefix || 'bg';
	getFileInfoList(cfg.src, clzPrefix, function (list) {
		if (list.length === 0)
			return cb(null);
		// console.info('backgrounds : ' + clzPrefix + '::' + util.inspect(list));
		cb({
			type: 'bg',
			path: cfg.path,
			prefix: clzPrefix,
			list: list
		});
	});
};