var path = require('path');
var utils = require('../lib/node/utils');

var qde = require('../qde/index');

var prjName = process.argv[2];

var cfg = null;
var targetDir = utils.resolve(prjName);

try {
	cfg = require(targetDir);
} catch (e) {
	console.error('load config file error: ', targetDir + '.js', e);
	process.exit(0);
}

// clean files genereated by base template 
utils.execCmd('rm -rf ' + path.join(targetDir, 'src/components/nsSample.vue'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'src/biz-components/nsBizSample.vue'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'src/pages'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'src/pages'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'src/router'));
utils.execCmd('rm -f ' + path.join(targetDir, 'src/App.vue'));
utils.execCmd('rm -f ' + path.join(targetDir, 'src/main.js'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'static/services'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'static/sim'));

// generate files for QDE
qde(prjName, cfg, () => {
	console.log('Project "' + prjName + '" generated OK!');
});