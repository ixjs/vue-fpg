module.exports = {
	"helpers": {
		"if_or": function (v1, v2, options) {
			if (v1 || v2)
				return options.fn(this);
			return options.inverse(this);
		}
	},
	"prompts": {
		"name": {
			"type": "string",
			"required": true,
			"message": "Project Group's name"
		},
		"owner": {
			"type": "string",
			"required": false,
			"message": "Project Group's owner",
			"default": "nobody"
		},
		"description": {
			"type": "string",
			"required": false,
			"message": "Project Group's description",
			"default": "FPG framework for xxx.com"
		},
		"author": {
			"type": "string",
			"required": false,
			"message": "Author",
			"default": "nobody@xxx.com"
		},
		"namespace": {
			"type": "string",
			"required": false,
			"message": "Namespace for project group",
			"default": "ns"
		}
	},
	"skipInterpolation": [
		"framework/base/**/*.*",
		"framework/qde/**/*.*",
		"framework/ssf/**/*.*",
		"framework/share/**/*.*"
	],
	"completeMessage": "To get started:\n\n\tcd {{destDirName}}\n\tsh framework/init.sh\n\nDocumentation can be found at {{destDirName}}/framework/init.sh "
};