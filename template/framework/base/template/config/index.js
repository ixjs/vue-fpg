// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

function resolve(dir) { return path.join(__dirname, '..', dir); }

module.exports = {
	preless: {
		oem: [], // used to deploy works to OEM products, maybe many. If none, let it empty. 

		src: resolve('_assets'),
		lessDest: resolve('src'),
		imgDest: resolve('static'),
		demoDest: resolve('_demo'),
		background: [{
		// classPrefix: 'bg',  // css Class prefix, default is bg
		// path: 'background'  // the directory for the source files relative to srcRoot
		}],
		picmap: [{
			// margin: 8, // margin for each images in spirit file, default is 8
			classPrefix: 'pic', // defualt is pic
			path: 'pic' // default is 'pic'
		// }, {
		//  classPrefix: 'cn', // defualt is pic
		//  path: 'cn' // default is 'pic'
		}]
	},
	// map: {
	// 	target: resolve('static/js/map/map.js'),
	// 	scale: 600,
	// 	includeChinaMap: true,
	// 	// includeCities: false,
	// 	provinces: 'all' // '青海,山西,...'
	// },
	dev: {
		env: { NODE_ENV: '"development"' },
		port: '{{port}}',
		autoOpenBrowser: true,
		assetsSubDirectory: 'static',
		assetsDemoDirectory: '_demo',
		assetsPublicPath: '/',
		testman: {
			services: {
				'/session': 'testman/sim/session', // mock session simulator;
				'/api': 'testman/sim/api' // mock api simulator;
			},
			output: 'testman/tmp', // output by services simulators
			log: 'testman/log' // log by services simulators
		},
		proxyTable: {
			// '/api': {
			// 	target: 'http://server.com',
			// 	pathRewrite: {
			// 		'^/api': '/'
			// 	}
			// }
		},
		// CSS Sourcemaps off by default because relative paths are 'buggy'
		// with this option, according to the CSS-Loader README
		// (https://github.com/webpack/css-loader#sourcemaps)
		// In our experience, they generally work as expected,
		// just be aware of this issue when enabling this option.
		cssSourceMap: false
	},  
	build: {
		env: { NODE_ENV: '"production"' },
		index: resolve('dist/index.html'),
		assetsRoot: resolve('dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: '',
		productionSourceMap: true,
		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: false,
		productionGzipExtensions: ['js', 'css'],
		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	},
	release: {
		src: resolve('dist'),
		target: resolve('rel'),

		entry: {
			name: 'index.html',
			css: 'less',
			js: 'data-type' 
		},
		copy: {
			dir: ['css', 'fonts', 'images', 'services', 'svg', 'sim'],
			appendix: '.map'
		}
	}
}
