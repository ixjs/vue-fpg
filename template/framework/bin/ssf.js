var path = require('path');
var utils = require('../lib/node/utils');

var prjName = process.argv[2];

var targetDir = utils.resolve(prjName);
var ssfDir = utils.$resolve('ssf');

// clean files genereated by base template 
console.log('try remove ', path.join(targetDir, 'src/components'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'src/components'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'src/biz-components'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'src/pages'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'src/router'));
utils.execCmd('rm -f ' + path.join(targetDir, 'src/App.vue'));
utils.execCmd('rm -f ' + path.join(targetDir, 'static/services/services.js'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'static/tinymce'));
utils.execCmd('rm -rf ' + path.join(targetDir, 'testman/sim'));

// copy template files for SSF
console.log('try cp from  ', ssfDir + '/template to ' + targetDir);
utils.execCmd('cp -r ' + ssfDir + '/template/* ' + targetDir);