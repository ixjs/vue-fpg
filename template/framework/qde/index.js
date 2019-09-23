var utils = require('../lib/node/utils');

var dataStoreParser = require('./lib/parsers/dataStore');
var pagesParser = require('./lib/parsers/pages');
var sideNavParser = require('./lib/parsers/sideNavs');
var staticParser = require('./lib/parsers/static');

var bizCmpRender = require('./lib/renders/bizCmp');
var dataStoreRender = require('./lib/renders/dataStore');
var engineRender = require('./lib/renders/engine');
var frameworkRender = require('./lib/renders/framework');
var pageRender = require('./lib/renders/page');
var selectRender = require('./lib/renders/select');
var sideNavRender = require('./lib/renders/sideNav');
var staticRender = require('./lib/renders/static');

module.exports = (prjName, cfg, done) => {
	var prjDir = utils.resolve(prjName);

	var sideNavInfo = sideNavParser(cfg.sideNavs); 
	// sideNavInfo: { sideNavs,apiNames,entityAttrs }
	var dsInfo = dataStoreParser(cfg.codeTables, cfg.entities, sideNavInfo.entityAttrs);
	// dsInfo: { ctNames,entNames,typedRef,ctHT,entHT,dataStore }
	var pageInfo = pagesParser(cfg.pages, cfg.configurations, cfg.navs);
	// pageInfo: { engines: {routers,privs,treePrivs},apis,queryParams,pages,bizCmps }
	var staticInfo = staticParser(cfg.simData, dsInfo,
			pageInfo.engines.privs, pageInfo.apis, pageInfo.queryParams);
	// staticInfo: { apis,defPrivs,typedRef,simData }

	console.log('prjDir:', prjDir);

	frameworkRender(prjDir, { fullname: cfg.fullname });
	sideNavRender(prjDir, sideNavInfo.sideNavs);
	dataStoreRender(prjDir, dsInfo.dataStore);
	selectRender(prjDir, dsInfo.dataStore.cmps);
	engineRender(prjDir, pageInfo.engines);
	bizCmpRender(prjDir, pageInfo.bizCmps);
	pageRender(prjDir, pageInfo.pages);
	staticRender(prjDir, staticInfo);

	done();
};