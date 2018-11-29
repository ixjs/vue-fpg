var chalk = require('chalk');
var semver = require('semver');
var packageConfig = require('../env/package.json');

function exec(cmd) {
	return require('child_process').execSync(cmd).toString().trim();
}

var versionRequirements = [{
	name: 'node',
	currentVersion: semver.clean(process.version),
	versionRequirement: packageConfig.engines.node
}, {
	name: 'npm',
	currentVersion: exec('npm --version'),
	versionRequirement: packageConfig.engines.npm
}];

module.exports = function () {
	var warnings = [];
	var i = 0;
	for (i = 0; i < versionRequirements.length; i += 1) {
		var mod = versionRequirements[i];
		if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
			warnings.push(mod.name + ': ' +
				chalk.red(mod.currentVersion) + ' should be ' +
				chalk.green(mod.versionRequirement)
			);
		}
	}

	if (warnings.length) {
		console.log('');
		console.log(chalk.yellow('To use this template, you must update following to modules:'));
		console.log();
		for (i = 0; i < warnings.length; i += 1) {
			var warning = warnings[i];
			console.log('  ' + warning);
		}
		console.log();
		process.exit(1);
	}
};
