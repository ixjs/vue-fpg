var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom');

var utils = require('../../lib/node/utils');
var envDir = utils.$resolve('lib/dom');

function removeUnusedScript(tag) {
	tag.removeAttribute('data-type');
	tag.removeAttribute('src');
	tag.removeAttribute('type');
	tag.setAttribute('aux', '');
	tag.innerHTML = '';
}

function parserIndexFile(entryFile, srcDir, targetDir, cbFn) {
	var jsFiles = new IX.I1ToNManager();

	function rename4MD5(targetFile, filename, appendix) {
		var md5 = IX.digestOnce(fs.readFileSync(targetFile));
		var newfilename = filename.substring(0, filename.length - appendix.length)
				+ '.' + md5 + appendix;
		utils.execCmd(['mv', targetFile, path.join(targetDir, newfilename)].join(' '));
		return newfilename;
	}
	// console.log('parserIndexFile:', entryFile, srcDir, envDir);
	function iterateScriptTag(tag, idx) {
		console.log('Script:\t', idx, tag.outerHTML);
		if (tag.hasAttribute('aux')) {
			removeUnusedScript(tag);
			console.log('\tremoved!');
			return;
		}

		var filepath = tag.getAttribute('src');
		var isContent = IX.isEmpty(filepath);
		var isEnvFile = !isContent && filepath.indexOf('env/') == 0;
		var targetName = tag.getAttribute('data-type');

		var realFilepath = isEnvFile ? path.join(envDir, filepath.substring(4)) 
				: (isContent ? '' : path.join(srcDir, filepath));
		
		if (IX.isEmpty(targetName)) {
			if (!isContent)
				jsFiles.put(filepath, { type: 'copy', value: realFilepath });
			console.log('\treserved:', filepath);
			return;
		}

		var targetFile = 'static/js/' + targetName + '.js';
		var isFirst = !jsFiles.hasValue(targetFile);
		if (isContent)
			jsFiles.put(targetFile, { type: 'content', value: tag.innerHTML });
		else 
			jsFiles.put(targetFile, { type: 'file', value: realFilepath });

		if (isFirst) {
			tag.removeAttribute('data-type');
			tag.setAttribute('type', 'text/javascript');
			tag.setAttribute('src', targetFile);
			tag.innerHTML = '';
		} else removeUnusedScript(tag);

		console.log('\tmerge to:', targetFile);
	}
	function iterateLinkTag(tag) {
		console.log('Link:\t\t', tag.outerHTML);

		var rel = tag.getAttribute('rel');
		if (IX.isEmpty(rel) || rel == 'stylesheet' || rel == 'shortcut icon')
			return;

		var filepath = tag.getAttribute('href');
		var targetFilePath = filepath.replace(/less/g, 'css');
		var srcFile = path.join(srcDir, filepath);
		var targetFile = path.join(targetDir, targetFilePath);

		// console.log('filepath:', filepath);
		utils.execCmd('/usr/local/bin/lessc ' + srcFile + '>' + targetFile);
		var newfilename = rename4MD5(targetFile, targetFilePath, '.css');

		tag.setAttribute('href', newfilename);
		tag.setAttribute('rel', 'stylesheet');
	}
	function mergeFiles(key) {
		var filepath = path.join(targetDir, key);

		var list = jsFiles.get(key);
		if (list.length == 1 && list[0].type == 'copy') {
			console.log('\t' + list[0].value + ' copied to ' + filepath + '!');
			IX.safeWriteFileSync(filepath, fs.readFileSync(list[0].value));
			return null;
		}

		IX.safeWriteFileSync(filepath, '');
		IX.iterate(list, function (item) {
			var content = item.type == 'content' ? item.value : fs.readFileSync(item.value);
			fs.appendFileSync(filepath, content + '\n');
		});

		return rename4MD5(filepath, key, '.js');
	}

	var dom = new jsdom.JSDOM(fs.readFileSync(path.join(srcDir, entryFile), 'utf8'));
	var doc = dom.window.document;
	IX.iterate(doc.scripts, iterateScriptTag);
	IX.iterate(doc.getElementsByTagName('link'), iterateLinkTag);

	var newHTML = dom.serialize();
	newHTML = newHTML.replace(/<script aux=""><\/script>/g, '');
	newHTML = newHTML.replace(/\t|\n/g, '');

	IX.iterate(jsFiles.getKeys(), function (key) {
		console.log('Handle: \t\t', key);
		var newfilepath = mergeFiles(key);
		if (newfilepath)
			newHTML = newHTML.replace(key, newfilepath);
	});
	IX.safeWriteFileSync(path.join(targetDir, entryFile), newHTML);
	cbFn();
}

module.exports = function (cfg, done) {
	var srcDir = cfg.src;
	var targetDir = cfg.target;
	var copyJobs = cfg.copy;

	utils.execCmd('rm -rf ' + path.join(targetDir, 'static'));
	utils.execCmd('rm -rf ' + path.join(targetDir, 'env'));

	var regStr = '^\/(' + copyJobs.dir.join('|').replace(/\//g, '\\\/') + ')|' 
			+ copyJobs.appendix.replace(/\./g, '\\.') + '$';
	var reg = new RegExp(regStr);

	IX.iterDirSync(path.join(srcDir, 'static'), '', function (_path, fileFullPath) {
		if (!reg.test(_path))
			return;
		// console.log('iter:', path);
		var filePath = path.dirname(_path);
		var filename = path.basename(_path);
		
		// console.log('path:', _path);//, filePath, filename);
		IX.safeMkdirSync(path.resolve(targetDir, 'static/' + filePath));
		IX.safeCopyToSync(fileFullPath, targetDir, 'static/' + filePath, filename);
	});

	parserIndexFile(cfg.entry.name, srcDir, targetDir, function () {
		console.log('release done!');
		done();
	});
};