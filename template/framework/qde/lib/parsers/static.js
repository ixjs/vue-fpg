var utils = require('../../../lib/node/utils');

var EntApiGenerators = {
	get(reqStrs) {
		return { 
			reqStrs: '{id}',
			rspStrs: '{id,' + reqStrs + '}',
			methodName: 'getEntity'
		};
	},
	add(reqStrs, rspStrs) {
		return { 
			reqStrs: '{' + reqStrs + '}',
			rspStrs: '{id,' + rspStrs + '}',
			methodName: 'addEntity'
		};
	},
	edit(reqStrs, rspStrs) {
		return { 
			reqStrs: '{id,' + reqStrs + '}',
			rspStrs: '{id,' + rspStrs + '}',
			methodName: 'editEntity'
		};
	},
	remove() {
		return {
			reqStrs: '{id}',
			rspStrs: '{}',
			methodName: 'removeEntity'
		};
	},
	removeAll() {
		return {
			reqStrs: '{ids}',
			rspStrs: '{}',
			methodName: 'removeEntities'
		};
	}
};

module.exports = (simData, entCfg, privs, extApis, queryParams) => {
	var apis = [], typedRef = [], defPrivs = [];
	var dataArr = [];

	var selectLoaderApis = [];

	function pushGridLoader(entName, apiName, rspStrs, isTreeEnt) {
		var apiParam = $XP(queryParams, entName, '');
		var _rspStrs = '[{id,' + rspStrs + (isTreeEnt ? ',children*' : '') + '}]';
		if (apiParam.indexOf('pageNo') > 0) 
			_rspStrs = '{total,pageNo,pageSize,list:' + _rspStrs + '}';
		apis.push({
			name: apiName,
			type: entName,
			reqStrs: '{' + apiParam + '}',
			rspStrs: _rspStrs,
			methodName: 'queryEntities'
		});
	}
	function pushSelectLoader(entName, apiName) {
		selectLoaderApis.push({
			name: apiName,
			type: entName,
			reqStrs: '{}',
			rspStrs: '[{id,name,nodeType,children*}]',
			methodName: 'getEntityTree4Select'
		});
	}

	IX.iterate(entCfg.entNames, (entName) => {
		var entItem = entCfg.entHT[entName];
		var apiNames = entItem.apiNames;
		var reqStrs = entItem.reqStrs;
		var rspStrs = entItem.rspStrs;
		var isTreeEnt = entItem.isTreeEnt;

		if ('selectLoader' in apiNames)
			pushSelectLoader(entName, apiNames.selectLoader);

		pushGridLoader(entName, apiNames.gridLoader, rspStrs, isTreeEnt);
		IX.iterate('get,add,edit,remove,removeAll'.split(','), (apiType) => {
			apis.push(IX.inherit({
				name: apiNames[apiType],
				type: entName
			}, EntApiGenerators[apiType](reqStrs, rspStrs)));
		});

		dataArr.push({ name: entName, items: simData[entName] });
	});
	typedRef = IX.map(entCfg.typedRef, (ref) => {
		var arr = ref.split(':');
		return '\'' + arr[0] + '\': \'' + arr[1] + '\'';
	});
	defPrivs = IX.map(privs, (priv) => { 
		return '\'' + priv.fullname + '\''; 
	});
	IX.iterate(extApis, (api) => {
		var apiRsp = api.rspStrs;
		var defResult = apiRsp.length == 0 ? '' 
				: (' ' + IX.map(apiRsp.split(','), (key) => {
					return key + ': \'' + key + '\'';
				}).join(', ') + ' ');
		apis.push(IX.inherit(api, {
			reqStrs: '{' + api.reqStrs + '}',
			rspStrs: '{' + apiRsp + '}',
			result: '{' + defResult + '}'
		}));
	});

	return {
		apis: selectLoaderApis.concat(apis),
		defPrivs: defPrivs.join(', '),
		typedRef: typedRef,
		simData: utils.inspect(dataArr).replaceAll('    ', '\t')
	};
};