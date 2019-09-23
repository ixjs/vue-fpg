var utils = require('../../../lib/node/utils');
var formatter = require('../../../lib/node/dataFormatter');

var CmpTypeNames = {
	'grid': 'Grid',
	'form': 'Form',
	'ms-linkage': 'Link'
};

var cmpDefHT = {}, routerHT = {}, navDefHT = {};
var bizCmpHT = new IX.IListManager(),
	pageHT = new IX.IListManager();
var routers = [],
	unauthPages = [],
	uniquePages = [],
	privs = [],
	treePrivs = [],
	apis = [],
	queryParams = {};

var Checkers = {
	'grid'(cmp) {
		var gridTrigger = $XP(cmp, 'cfg.defTrigger', '');
		return IX.isString(gridTrigger) && gridTrigger.length > 0;
	},
	'form'(cmp) {
		var formSubmit = $XP(cmp, 'cfg.submitMethod', '');
		return IX.isString(formSubmit) && formSubmit.startsWith('deliver');
	},
	'link'(cmp) {
		return $XP(cmp, 'cfg.deliverToParent');
	}
};
function registerSlaveCmp(cmpItem, extCmp, parentCmpPrefix) {
	if (IX.isString(cmpItem) || !('default' in cmpItem)) { 
		// only one component defined/referred
		var defCmp = registerCmp(cmpItem, extCmp, parentCmpPrefix);
		return {
			def: { name: defCmp.name },
			items: [],
			useSelectedItem: $XP(defCmp, 'cfg.useSelectedItem', false),
			deliverToParent: Checkers[defCmp.type](defCmp)
		};
	}
	// multi components defined/referred
	var data = {
		def: { name: '' },
		items: [],
		useSelectedItem: false,
		deliverToParent: false
	};
	// console.log("registerSlaveCmp 0:" , cmpItem);
	data.items = IX.each(cmpItem, [], (acc, val, name) => {
		// console.log("registerSlaveCmp:" , acc, val, name);
		var cmp = registerCmp(val, extCmp, parentCmpPrefix);

		data.useSelectedItem = data.useSelectedItem || $XP(cmp, 'cfg.useSelectedItem', false);
		data.deliverToParent = data.deliverToParent || Checkers[cmp.type](cmp);
		if (name == 'default')
			data.def.name = cmp.name;
		else 
			acc.push({ type: name, name: cmp.name });
		return acc;
	});
	return data;
}

/* return  {
	cmpName, isVertical, deliveryKeys,useSelectedItem
	deliverToParent, mixins:[],
	masterCmp, defSlaveCmp, slaveCmps: [{type,name}]
} */
function applyLinkCfg(cmpCfg, parentCmpPrefix) {
	var cfg = {
		cmpName: null,
		isVertical: true,
		deliveryKeys: null,
		useSelectedItem: false,
		deliverToParent: false,
		mixins: null,
		masterCmp: null,
		defSlaveCmp: null,
		slaveCmps: []
	};
	var mixins = [];

	if ($XP(cmpCfg, 'layout', 'vertical') != 'vertical')
		cfg.isVertical = false;

	if (IX.isString(cmpCfg.delivery))
		cfg.deliveryKeys = cmpCfg.delivery;
	var ifNoDelivery = cfg.deliveryKeys == '-';

	var masterCmp = registerCmp($XP(cmpCfg, 'master', null), 
			{ ifNoDelivery: ifNoDelivery, msType: 'master' }, parentCmpPrefix + 'M');
	var slaveCmp = registerSlaveCmp($XP(cmpCfg, 'slave', null), 
			{ ifNoDelivery: ifNoDelivery, msType: 'slave' }, parentCmpPrefix + 'S');
	// console.log("===== register link master: ", utils.inspect(masterCmp));
	// console.log("===== register link slaves: ", utils.inspect(slaveCmp), cmpCfg.slave);
	
	cfg.masterCmp = $XP(masterCmp, 'name');
	cfg.defSlaveCmp = $XP(slaveCmp, 'def.name');
	cfg.slaveCmps = $XP(slaveCmp, 'items', []);
	cfg.deliverToParent = $XP(slaveCmp, 'deliverToParent');

	if ($XP(masterCmp, 'cfg.useSelectedItem') || $XP(slaveCmp, 'useSelectedItem')) {
		cfg.useSelectedItem = true;
		mixins.push('selectedMixin');
	}

	var msType = $XP(cmpCfg, 'msType', '');
	if (msType.length > 0)
		mixins.push(msType + 'Mixin');
	cfg.mixins = mixins;
	
	return cfg;
}

function resetQueryParams(entName, paramKeys, hasPagination) {
	// console.log('============= Query: ', entName, paramKeys);
	var oldKeys = $XP(queryParams, entName, '');
	if (oldKeys)
		paramKeys = IX.Array.toSet(oldKeys.split(','), paramKeys);
	if (hasPagination)
		paramKeys.push('pageNo,pageSize');
	queryParams[entName] = paramKeys.join(',');
}
/* return  {
	cmpName, entityName, entityAttrs,
	disableAutoLoad, hasPagination
	useSelectedItem
	mixins:[],
	defTrigger, triggers: [],
	apiParamsSentences: []
} */
function applyGridCfg(cmpCfg) {
	var cfg = {
		cmpName: null,
		entityName: cmpCfg.entityName,
		entityAttrs: '',
		disableAutoLoad: false,
		hasPagination: false,
		useSelectedItem: false,
		mixins: [],
		defTrigger: '',
		triggers: [],
		apiParamsSentences: []
	};

	var buttons = $XP(cmpCfg, 'buttons', null),
		actions = $XP(cmpCfg, 'actions', null);
	if (buttons == '-') 
		cfg.entityAttrs += ' buttons=\'-\'';
	else if (IX.isString(buttons))
		cfg.entityAttrs += ' buttons=\'' + buttons + '\'';
	if (actions == '-') 
		cfg.entityAttrs += ' actions=\'-\'';
	else if (IX.isString(actions))
		cfg.entityAttrs += ' actions=\'' + actions + '\'';

	if (cmpCfg.hasPagination) 
		cfg.hasPagination = true;

	cfg.triggers = IX.each($XP(cmpCfg, 'cellClick', {}), [], (acc, val, name) => {
		if (val == 'deliver') {
			cfg.defTrigger = name;
			return acc;
		}
		if (!val.startsWith('deliver.'))
			return acc;
		var triggerName = val.substring(8);
		acc.push({ type: triggerName, capitalizeType: triggerName.capitalize(), cols: name });
		return acc;
	});

	var useSelectedItem = false;
	var queryParamKeys = [];
	cfg.apiParamsSentences = IX.each($XP(cmpCfg, 'apiParams', {}), [], (acc, val, name) => {
		// console.log("apiParams:", name, val);
		var arr = val.split('.');
		if (arr[0] == 'selectedItem')
			useSelectedItem = true;
		queryParamKeys.push(name);
		return acc.concat(name + ': $XP(this.' + arr[0] + ', \'' + arr[1] + '\', null)');
	});
	resetQueryParams(cmpCfg.entityName, queryParamKeys, cfg.hasPagination);
	if (useSelectedItem) {
		cfg.mixins.push('selectedMixin');
		cfg.useSelectedItem = true;
	}

	var msType = $XP(cmpCfg, 'msType', ''),
		ifNoDelivery = $XP(cmpCfg, 'ifNoDelivery', false);
	if (cfg.defTrigger || (msType == 'master' && !ifNoDelivery))
		cfg.mixins.push('masterMixin');
	if (msType == 'slave' && !ifNoDelivery) {
		cfg.mixins.push('slaveMixin');
		cfg.disableAutoLoad = true;
	}
	// console.log("Detect:", cmpCfg, msType, cfg);
	return cfg;
}

function formatDataItems(data, level) {
	var lines = [];
	var line = '';

	function isSimpleValue(val) {
		return (IX.isBoolean(val) || val === null || val === undefined || IX.isNumber(val));
	}
	function removeLastComma() {
		var lastLine = lines.pop();
		lastLine = lastLine.substring(0, lastLine.length - 1);
		lines.push(lastLine);
	}
	function formatArr(arr) {
		var isSimpleArr = false;
		line += '[';
		IX.iterate(arr, (item, idx) => {
			var isSimpleItem = isSimpleValue(item);
			if (idx == 0 && (isSimpleItem || IX.isString(item)))
				isSimpleArr = true;
			if (isSimpleArr)
				line += ' ';
			else {
				lines.push(line);
				line = '\t\t';
			}

			if (isSimpleItem)
				line += item + ',';
			else if (IX.isString(item))
				line += '\'' + item + '\',';
			else 
				line += utils.inspect(item) + ',';
		});
		if (arr.length > 0)
			line = line.substring(0, line.length - 1);
		if (arr.length == 0 || isSimpleArr) {
			line += '],';
			lines.push(line);
			line = '\t';
		} else {
			lines.push(line);
			lines.push('\t],');
		}
	}
	function formatObj(obj) {
		line += '{';
		lines.push(line);
		IX.each(obj, 0, (acc, val, name) => {
			line = '\t\t' + name + ': ';
			if (isSimpleValue(val))
				line += val + ',';
			else if (IX.isString(val))
				line += '\'' + val.replace(/'/g, '\\\'') + '\',';
			else 
				line += utils.inspect(val) + ',';
			lines.push(line);
		});
		removeLastComma();
		lines.push('\t},');
	}

	lines.push('{');
	IX.each(data, 0, (acc, val, name) => {
		line = '\t' + name + ': ';
		if (isSimpleValue(val)) {
			line += val + ',';
			lines.push(line);
		} else if (IX.isString(val)) {
			line += '\'' + val.replace(/'/g, '\\\'') + '\',';
			lines.push(line);
		} else if (IX.isArray(val))
			formatArr(val);
		else
			formatObj(val);
	});
	removeLastComma();
	lines.push('}');
	return lines.join('\n' + '\t'.multi(level));
}

/*
	cmpName, mixins: [], isCompactForm,
	formType,
	entityName, entityId, // only for formType == 'entity'
	autoSubmit: true, submitMethod: 'deliver', // only for formType=='base'
	callService,useSelectedItem, selectedTrigger,
	keyFieldName, //only for selectTrigger == true
	dataItems,methods: [] // only for formType=='base'
*/
function applyFormCfg(cmpCfg) {
	var cfg = {
		cmpName: null,
		mixins: [],
		isCompactForm: false,
		formType: 'base',
		entityName: '',
		entityId: '',
		autoSubmit: false,
		submitMethod: 'submit',	
		callService: false,
		useSelectedItem: false,
		selectedTrigger: false,
		keyFieldName: null,
		dataItems: null,
		methods: []
	};

	var msType = cmpCfg.msType,
		ifNoDelivery = $XP(cmpCfg, 'ifNoDelivery', false);
	if (!IX.isEmpty(msType) && !ifNoDelivery)
		cfg.mixins.push(msType + 'Mixin');
	cfg.isCompactForm = !IX.isEmpty(msType); // form in ms-linkage 

	if ('entityName' in cmpCfg) {
		cfg.formType = 'entity';
		cfg.entityName = cmpCfg.entityName;
		var entityId = cmpCfg.entity || 'delivery.id';
		cfg.entityId = entityId;
		if (entityId.startsWith('selectedItem')) {
			cfg.mixins.unshift('selectedMixin');
			cfg.useSelectedItem = true;
		}

		return cfg;
	}

	var fields = $XP(cmpCfg, 'fields', []);
	var data = {
		'form': IX.loop(fields, {}, (acc, field, idx) => {
			acc[field.name] = field.type ? (field.type == 'bool' ? false : null) : '';
			if (idx == 0)
				cfg.keyFieldName = field.name;
			return acc;
		}),
		'fields': fields,
		'btns': $XP(cmpCfg, 'buttons', [])
	};
	cfg.autoSubmit = (data.btns == null || data.btns.length == 0);
	cfg.dataItems = formatDataItems(data, 2);

	function getFormMethod(mName, _cfg) {
		var methodCfg = {
			name: mName,
			apiName: $XP(_cfg, 'apiName', null),
			apiParams: [],
			namedRsp: '',
			rspSentences: []
		};
		var reqStrs = [], rspStrs = [];

		cfg.callService = true;

		methodCfg.apiParams = IX.each(_cfg.apiParams || {}, [], (acc, val, name) => {
			// console.log(' api params:', val, val.startsWith('selectedItem'));
			if (val.startsWith('selectedItem')) {
				cfg.useSelectedItem = true;
				if (mName == 'load')
					cfg.selectedTrigger = true;
			}
			acc.push('\'' + name + '\': this.' + val);
			reqStrs.push(name);
			return acc;
		});
		methodCfg.rspSentences = IX.each(_cfg.rsp || {}, [], (acc, val, name) => {
			var str = 'this.' + name + ' = ';
			if (val.startsWith('data.')) {
				methodCfg.namedRsp = 'data'; 
				rspStrs.push(val.substring(5));
			} else
				str += 'this.';
			acc.push(str + val);
			return acc;
		});
		apis.push({ name: methodCfg.apiName, reqStrs: reqStrs.join(), rspStrs: rspStrs.join() });
		return methodCfg;
	}
	var methods = [];
	var submitMethod = cmpCfg.submit;
	if (IX.isString(submitMethod))
		cfg.submitMethod = submitMethod;
	else if ('apiName' in submitMethod) {
		cfg.submitMethod = 'submit';
		methods.push(getFormMethod('submit', submitMethod));
	}
	var loadCfg = cmpCfg.load;
	if (loadCfg && 'apiName' in loadCfg)
		methods.push(getFormMethod('load', loadCfg));
	if (cfg.useSelectedItem)
		cfg.mixins.unshift('selectedMixin');

	cfg.methods = methods;
	return cfg;
}

function _getCmpName(parentCmpPrefix, cmpType) {
	var baseName = (parentCmpPrefix || '') + cmpType;
	if (!(baseName in cmpDefHT))
		return baseName;
	for (var i = 2; i > 0; i += 1) {
		if (!((baseName + i) in cmpDefHT))
			return baseName + i;
	}
	console.error('Should not go here!!!');
}
function getCmpName(cmpItem, extCmp, parentCmpPrefix) {
	var cmpName = null, cmpCfg = null;
	if (!IX.isString(cmpItem)) {
		cmpCfg = IX.inherit(cmpItem, extCmp);
		var cmpType = CmpTypeNames[cmpCfg.type];
		cmpName = cmpName || _getCmpName(parentCmpPrefix, cmpType);
		cmpDefHT[cmpName] = cmpCfg;
		return cmpName;
	}
	if (cmpItem.substring(0, 4) == 'CFG:') {
		cmpName = cmpItem.substring(4);
		cmpCfg = cmpDefHT[cmpName];
		cmpDefHT[cmpName] = IX.inherit(cmpCfg, extCmp);
		return cmpName;
	}
	console.error('Can\'t find component reference in configuration for: ', cmpItem);
	return null;
}
/* extCmp : { 
	msType, // useRouteKey, useSelectedItem
} */
function registerCmp(cmpItem, extCmp, parentCmpPrefix) {
	var cmpName = getCmpName(cmpItem, extCmp, parentCmpPrefix);
	var cmpCfg = cmpDefHT[cmpName];
	// console.log('registerCmp: ', cmpName, cmpItem, cmpCfg, extCmp);
	var cmpType = CmpTypeNames[cmpCfg.type];
	var parsed = {
		name: cmpName, 
		type: cmpType.toLowerCase()
	};
	bizCmpHT.register(cmpName, parsed);

	var extCfg = null;
	switch (cmpType) {
	case 'Link':
		extCfg = applyLinkCfg(cmpCfg, parentCmpPrefix);
		break;
	case 'Form':
		extCfg = applyFormCfg(cmpCfg, parentCmpPrefix);
		break;
	case 'Grid':
		extCfg = applyGridCfg(cmpCfg, parentCmpPrefix);
		break;	
	default:
		console.error('unknown biz-cmp type:', cmpType);
		return null;
	}
	if (!extCfg) {
		console.error('incorrect biz-cmp definition:', cmpItem, cmpCfg);
		return;
	}
	parsed.cfg = IX.inherit(extCfg, { 
		cmpName: cmpName
	});
	return parsed;
}

/* 
	name,tag,ifUnAut,ifUnique,layoutType,ifNav,ifEntry,lsideCmp,titlebar,
	bizCmpName,bizCmpTag,
	encodeRouteKey, useRouteKey, mixins
	useSelectedItem,toPageName,toPageAttrs
*/	
function applyPageCfg(pageCfg, name, arr) {
	var detailCfg = {
		name: name.camelize().capitalize() + 'Page',
		tag: name,
		ifUnAuth: false,
		ifUnique: false,
		layoutType: 'default',
		ifNav: true,
		ifEntry: true,
		lsideCmp: null,
		titlebar: null,
		bizCmpName: '',
		bizCmpTag: '',
		encodeRouteKey: false, 
		useRouteKey: false,
		mixins: [],
		useSelectedItem: false,
		toPageName: null,
		toPageAttrs: ''
	};

	if ('ifAuth' in pageCfg && !pageCfg.ifAuth) 
		detailCfg.ifUnAuth = true;
	if ('ifUnique' in pageCfg && pageCfg.ifUnique)
		detailCfg.ifUnique = true;

	var layoutCfg = pageCfg.layout;
	if ('type' in layoutCfg)
		detailCfg.layoutType = layoutCfg.type;

	var topbarCfg = $XP(layoutCfg, 'topbar', null); 
	if (topbarCfg && 'ifNav' in topbarCfg && !topbarCfg.ifNav)
		detailCfg.ifNav = false;
	if (topbarCfg && 'ifEntry' in topbarCfg && !topbarCfg.ifEntry)
		detailCfg.ifEntry = false;

	if ('lside' in layoutCfg) {
		var lsideCfg = layoutCfg.lside;
		detailCfg.lsideCmp = lsideCfg.cmp;

		var selectAction = lsideCfg.select;
		if (selectAction.startsWith('jumpTo')) {
			detailCfg.encodeRouteKey = true;
			detailCfg.mixins.push('routeKeyEncode');

			var selectionArr = selectAction.split(/\(|\)/);
			if (selectionArr.length == 3) {
				var _arr = selectionArr[1].split(',');
				detailCfg.toPageName = _arr[0].strip();
				detailCfg.toPageAttrs = _arr[1].strip();
			}
		} else if (selectAction.startsWith('selectedItem')) 
			detailCfg.useSelectedItem = true;
	}

	if ('titlebar' in layoutCfg)
		detailCfg.titlebar = layoutCfg.titlebar;

	if ('routeKey' in pageCfg && pageCfg.routeKey) {
		detailCfg.mixins.push('routeKeyDecode');
		detailCfg.useRouteKey = true;
		IX.setProperty(routerHT, name + '.hasRouterKey', true);
	}

	var cmpTagPrefix = ['sp'].concat(arr);
	var parsedPageCmp = registerCmp(layoutCfg.page, {}, cmpTagPrefix.join('-').camelize());
	var bizCmpTag = cmpTagPrefix.concat(parsedPageCmp.type).join('-');
	detailCfg.bizCmpTag = bizCmpTag;
	detailCfg.bizCmpName = bizCmpTag.camelize();

	return detailCfg;
}

function parsePageCfg(pageCfg) {
	// console.log('--------parsePageCfg: ', pageCfg);
	var name = pageCfg.name || IX.id();
	var parsedCfg = { 
		type: 'page',
		path: name + '/index' 
	};
	var arr = name.split('-');
	if (arr.length == 2) {
		var parentPage = arr[0].toLowerCase();
		pageHT.register(arr[0], { 
			type: 'route', path: parentPage + '/index', cfg: {
				name: parentPage.camelize().capitalize() + 'Page'
			} 
		});
		IX.setProperty(routerHT, parentPage + '.pageType', 'route');
		IX.setProperty(routerHT, parentPage + '.name', parentPage);
		IX.setProperty(routerHT, name + '.parent', parentPage);

		parsedCfg.path = arr.join('/');
	}

	IX.setProperty(routerHT, name + '.name', arr[arr.length - 1]);
	if ('title' in pageCfg)
		IX.setProperty(routerHT, name + '.title', pageCfg.title);

	parsedCfg.cfg = applyPageCfg(pageCfg, name, arr);
	// console.log ("Parsed page:", utils.inspect(parsedCfg));
	pageHT.register(name, parsedCfg);
}

// navs: ['cdt', 'cdi', { name: 'sys', title: '系统管理', children: 'org,setting' }],
function addNav(pNavNames, name, navItem) {
	var arr = pNavNames.concat(navItem.name);
	var routeName = arr.join('-');
	if (pNavNames.length > 0)
		treePrivs.push({ name: routeName, pname: pNavNames.join('-') });
	routerHT[routeName].type = 'nav';
	if (navItem.title)
		routerHT[routeName].title = navItem.title;
}
function iterNav(navItem, pNavNames) {
	var arr = pNavNames || [];
	// console.log('iterNav:', arr, navItem, pNavNames);
	if (IX.isString(navItem)) {
		addNav(arr, navItem, { name: navItem });
		return;
	}
	var name = navItem.name;
	addNav(arr, name, { name: name, title: navItem.title });
	var children = navItem.children || [];
	if (children.length > 0)
		children = IX.isString(children) ? children.split(',') : children;

	IX.iterate(children, (child) => {
		iterNav(child, arr.concat(name));
	});
}

function logStat(key) {
	console.log('================' + key);
	// console.log('\tcmpDefHT: ', formatter.formatObj(cmpDefHT, 2));
	console.log('\trouterHT: ', formatter.formatObj(routerHT, 2));
	console.log('\tnavDefHT: ', formatter.formatObj(navDefHT, 2));
	console.log('\tbizCmpHT.keys: ', bizCmpHT.getKeys());
	console.log('\tpageHT.keys: ', pageHT.getKeys());

	console.log('\trouters: ', formatter.formatArr(routers, 2));
	console.log('\tunauthPages: ', unauthPages);
	console.log('\tuniquePages: ', uniquePages);

	console.log('\tprivs: ', formatter.formatArr(privs, 2));
	console.log('\ttreePrivs: ', formatter.formatArr(treePrivs, 2));
}
module.exports = function (pages, bizCmps, navs) {
	cmpDefHT = {};
	routerHT = {};
	navDefHT = {};
	bizCmpHT.clear();
	pageHT.clear();
	routers = [];
	unauthPages = [];
	uniquePages = [];
	privs = [];
	treePrivs = [];
	apis = [];
	queryParams = {};

	IX.iterate(bizCmps, (cmpDef) => {
		cmpDefHT[cmpDef.name] = cmpDef.cfg;
	});
	IX.iterate(pages, parsePageCfg);
	IX.iterate(navs, (item) => { iterNav(item); });

	var tmpHT = new IX.IListManager();
	pageHT.iterate((pageCfg, pageName, idx) => {
		var r = routerHT[pageName];
		var privName = r.name;
		r.id = idx + 1;
		r.pId = 0;
		if ($XP(pageCfg, 'cfg.ifUnAuth'))
			unauthPages.push(pageName);
		if ($XP(pageCfg, 'cfg.ifUnique'))
			uniquePages.push(pageName);

		if (r.parent) {
			var parentName = r.parent;
			r.pId = routerHT[parentName].id;
			var pRobj = tmpHT.get(parentName);
			pRobj.children.push('\'' + privName + '\'');
		} else {
			tmpHT.register(pageName, {
				name: pageName,
				hasRouterKey: !!r.hasRouterKey,
				children: []
			});
		}
		privs.push({
			id: r.id,
			pId: r.pId,
			title: r.title,
			name: privName,
			fullname: pageName,
			type: r.type || 'page',
			idx: r.id
		});
	});
	tmpHT.iterate((router) => {
		routers.push({
			name: router.name,
			hasRouterKey: router.hasRouterKey,
			children: router.children.join(', ')
		});
	});
	logStat('Step End');

	cmpDefHT = {};
	routerHT = {};
	navDefHT = {};
	tmpHT.clear();

	return {
		engines: {
			routers: utils.dup(routers),
			unauth: utils.dup(unauthPages),
			uniquePages: utils.dup(uniquePages),
			privs: utils.dup(privs),
			treePrivs: utils.dup(treePrivs)
		},
		apis: utils.dup(apis),
		queryParams: utils.dup(queryParams),
		pages: utils.dup(pageHT.getAll()),
		bizCmps: utils.dup(bizCmpHT.getAll())
	};
};