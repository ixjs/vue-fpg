function NavModel(list, validNodeType) {
	var itemHT = {}, targetItemNames = [];

	function loopItem(item) {
		var name = item.nodeType + '-' + item.id;
		if (!validNodeType || item.nodeType == validNodeType) {
			targetItemNames.push(name);
			itemHT[name] = item;
		}
		return {
			name: name,
			title: item.name,
			children: loopChildren(item.children || [])
		};
	}
	function loopChildren(children) {
		return IX.map(children, loopItem);
	}

	var navItemList = loopChildren(list);
	// console.log("parsed: ", navItemList);

	return {
		getFocusedIndex(id) { return validNodeType + '-' + id; },
		getFirstIndex() { return targetItemNames[0]; },
		getByIndex(index) { return index in itemHT ? IXW.dup(itemHT[index]) : null; },
		getAll() { return IXW.dup(navItemList); }
	};
}

export default NavModel;