var fs = require('fs'),
	PNG = require('pngjs').PNG;

var GrowingPacker = require('./lib/GrowingPacker');

function createPng(width, height) {
	var png = new PNG({
		width: width,
		height: height
	});
	// png.data.fill(0);
	var n = png.width * png.height * 4;
	for (var i = 0; i < n; i += 1)
		png.data[i] = 0;
	return png;
}

function packImages(list) {
	var imgInfoArr = IX.Array.sort(list, function (a, b) {
		var len = Math.min(a.length, b.length);
		for (var i = 0; i < len; i += 1) {
			var v = a.charCodeAt(i) - b.charCodeAt(i);
			if (v !== 0)
				return v > 0 ? 1 : -1;
		}
		return a.length > len ? 1 : (b.length > len ? -1 : 0);
	});
	var packer = new GrowingPacker();
	packer.fit(IX.Array.sort(list, function (a, b) { return b.w - a.w; }));
	imgInfoArr.root = packer.root;
	return imgInfoArr;
}
function drawImages(list, callback) {
	var imgInfoArr = packImages(list);
	// console.log('after packImages:' + util.inspect(imgInfoArr));
	var imgPng = createPng(imgInfoArr.root.w, imgInfoArr.root.h);
	imgInfoArr.forEach(function (obj) {
		var img = obj.image, x = obj.fit.x, y = obj.fit.y;
		obj.xpos = x === 0 ? '0' : ('-' + x + 'px');
		obj.ypos = y === 0 ? '0' : ('-' + y + 'px');
		img.bitblt(imgPng, 0, 0, img.width, img.height, x, y);
	});
	// console.log('after bitblt all:' + util.inspect(imgPng));
	var bitBuf = new Buffer(0);
	imgPng.on('data', function (chunk) {
		// console.log(' pack: ' +  (chunk instanceof Buffer));
		bitBuf = Buffer.concat([bitBuf, chunk]);
	});
	imgPng.on('end', function (chunk) {
		// console.log('end packed: ' + bitBuf.length);
		if (chunk)
			bitBuf = Buffer.concat([bitBuf, chunk]);
		// console.log('packed: ' + bitBuf.length);
		callback(imgInfoArr, bitBuf);
	});
	imgPng.pack();
}
function collectImage(imageFileName, cbFn) {
	var pngParser = new PNG();
	pngParser.on('error', function (err) {
		console.error('Error:', err);
	});
	pngParser.on('parsed', function () {
		var result = {
			image: this,
			width: this.width,
			height: this.height
		};
		var size = 0;
		this.pack().on('data', function (chunk) {
			size += chunk.length;
		}).on('end', function () {
			result.size = size;
			cbFn(result);
		});
	});
	fs.createReadStream(imageFileName).pipe(pngParser);
}
function getFileInfoList(srcPath, clzPrefix, margin, cbFn) {
	var files = fs.readdirSync(srcPath);
	var list = [], count = 0;
	function _checkReady() {
		if (count == files.length)
			return cbFn(list);
		return setTimeout(_checkReady, 500);
	}
	function pushResult(name, result) {
		var w = result.width, h = result.height;
		list.push(IX.inherit(result, {
			prefix: clzPrefix,
			name: name,
			info: 'width: ' + w + 'px; height:' + h + 'px;',
			w: w + margin,
			h: h + margin
		}));
	}
	files.forEach(function (_fname) {
		var fname = _fname.split('.');
		if (fname.length != 2 || fname[1].toLowerCase() != 'png') {
			count += 1;
			return;
		}
		collectImage(srcPath + '/' + _fname, function (result) {
			// console.log('collect:' + result);
			pushResult(fname[0], result);
			count += 1;
		});
	});
	_checkReady();
}

/** cfg :{
 * 		margin : margin for each images
 *		path : the filename for generated image file
 *		classPrefix : prefix for all images in src folder
 * 		src : the direction contain origin images
 * 		dest : directoy to contain image file
 * 		demoDest : directory to contain demo files
* } 
 */
module.exports = function (cfg, cb) {
	var clzPrefix = cfg.classPrefix || 'pic';
	
	function outputFiles(list, bitBuf) {
		var picPath = cfg.path;
		var destImgFile = '/images/' + picPath + '.png';
		var dest = cfg.dest;
		var demoDest = cfg.demoDest; 

		IX.safeWriteFileSync(dest + destImgFile, bitBuf);
		if (demoDest)
			IX.safeWriteFileSync(demoDest + destImgFile, bitBuf);
		console.log('Output pic map png to ' + dest + destImgFile);
		cb({
			type: 'pic',
			path: picPath,
			prefix: clzPrefix,
			list: list
		});
	}
	console.log('get images for picmap :' + cfg.src);
	getFileInfoList(cfg.src, clzPrefix, cfg.margin || 8, function (list) {
		if (list.length === 0)
			return cb(null);
		// console.log('draw images for picmap : ' + clzPrefix + '\n' + util.inspect(list));
		drawImages(list, outputFiles);
	});
};
