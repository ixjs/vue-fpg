function PrivsManager(privsData) {
	var treeHT = new IX.I1ToNManager();
	var tmpHT = {};
	var allIds = [];

	IX.iterate(privsData, function (item) {
		var itemId = item.id;
		treeHT.put(item.parentId, itemId);
		tmpHT[itemId] = IX.inherit(item);
		allIds.push(itemId);
	});

	// var privObj = {}; // "uri-uri": privItem
	// {'name' : {"__authed" : true, 'subname': {...}}}
	var pagesHT = {};
	var quickCheckerObj = {}; // "name-name": true
	function getPrivChecker(rsrcKey) {
		return $XP(quickCheckerObj, rsrcKey.replace(/-/g, '.'), null);
	}
	function parsePrivItem(key, privItem) {
		var rsrcType = privItem.type;
		// privObj[key] = privItem;

		if (rsrcType == 'nav' || rsrcType == 'page') 
			pagesHT[key] = true;

		return (rsrcType != 'nav') ? null : {
			name: key,
			title: privItem.title,
			idx: privItem.idx
		};
	}
	function parseChildren(pid, namePrefix, parentCheckerObj) {
		var children = [];

		IX.iterate(treeHT.get(pid), function (childId) {
			var privItem = tmpHT[childId];
			var privName = privItem.name;
			var key = namePrefix + privName;
			var checkerObj = { '__authed': true, '__type': privItem.type }; 

			parentCheckerObj[privName] = checkerObj;

			var navChilds = parseChildren(childId, key + '-', checkerObj);
			var navItem = parsePrivItem(key, privItem);

			tmpHT[childId] = null;

			if (!navItem) return;
			navItem.children = navChilds;
			if (navChilds.length > 0) {
				var firstChild = navChilds[0];
				navItem.defRoute = firstChild.defRoute || firstChild.name;
			}
			children.push(navItem);
		});

		return children.sort(function (a, b) { return a.idx - b.idx; });
	}

	var navList = parseChildren(0, '', quickCheckerObj);
	IX.iterate(allIds, function (id) {
		if (tmpHT[id])
			console.error('Unknow Priviledge:', tmpHT[id]);
	});
	allIds = null;
	tmpHT = null;
	treeHT = null;

	// console.log("PRIVs:", privObj);
	// console.log("pagesHT:", pagesHT);
	// console.log("Navs:", navList);
	// console.log("Checker:", quickCheckerObj);

	return {
		navList: navList,
		pagesHT: pagesHT,
		getModuleChecker: getPrivChecker, // (rsrcKey)
		checkIfValid(rsrcKey) {
			var checker = getPrivChecker(rsrcKey);
			return $XP(checker, '__authed', false);
		}
	};
}

function Session(data) {
	if (!data)
		return {
			isValid() { return null; },
			get() { return null; },

			getNavs() { return []; },
			getValidPages() { return {}; },
			getModuleChecker() { return {}; },
			checkIfRsrcValid() { return false; }
		};

	var privMgr = new PrivsManager(data.privs);
	var _data = IX.inherit(data, {
		privs: null,
		isManager: true,
		isLeader: true
	});

	return {
		isValid() { return _data.id; },
		get() { return _data; },

		getNavs() { return privMgr.navList; },
		getValidPages() { return privMgr.pagesHT; },
		getModuleChecker: privMgr.getModuleChecker,
		checkIfRsrcValid: privMgr.checkIfValid
	};
}

export default {
	SessionClass: Session
};
