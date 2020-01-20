var utils = require('../../lib/node/utils');
var util = require('util');
var outputDir =  '/tmp/fpg-output';

function testman(app, prjResolve, cfg) {
	IX.setLogPath(prjResolve(cfg.log), 'testman');
	outputDir = prjResolve(cfg.output);

	function listenUrl(url, method, proc) {
		var procFn = IX.isFn(proc) ? (req) => {
			var data = {};
			try {
				data = proc(req.params, outputDir);
			} catch (e) {
				return {
					code: -1,
					err: 'Fail:' + e.message
				};
			}
			return {
				code: 0,
				data: data
			}; 
		} : () => {
			return {
				code: 0,
				data: proc
			};
		};
		console.log('LISTEN:', url, method);
		if (method == 'post')
			return app.post(url, (req, rsp) => {
				var str = '';
				req.on('data', (chunk) => { str += chunk; });
				req.on('end', () => {
					IX.log('[POST IN]: ' + url + ':' + util.inspect(req) + 'payload: ' + str);
					var params = IX.inherit(req.params, JSON.parse(str || {}));
					rsp.send(procFn({ params: params }));
				});
			});
		app[method](url, (req, rsp) => {
			IX.log('[IN]: ' + url + ':' + util.inspect(req.params));
			rsp.send(procFn(req));
		});
	}
	function listen4(urlPrefix, filepath) {
		var urls = require(prjResolve(filepath));
		
		IX.each(urls, 0, (acc, v, k) => {
			var arr = k.split(/\s+/);
			// console.log("arr:", arr);
			listenUrl(urlPrefix + (arr[1] == '/' ? '' : arr[1]), arr[0], v);
		});
	}

	IX.each($XP(cfg, 'services', {}), 0, (acc, v, k) => {
		listen4(k, v);
		return 0;
	});
}

module.exports = testman;

// var projectFolder = 'ssf';
// var prjResolve = utils.getProjectResolve(projectFolder);
// var devConfig = utils.getProjectConfig(projectFolder, 'dev');
// testman(console.log, prjResolve, devConfig.testman);