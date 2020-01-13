import defPageLayoutCmp from './layout/page/base';
import defTopbarCmp from './topbars/base';
import basePanelLayoutCmp from './layout/panel/base';
import panel404Cmp from './panels/notFound';

const typeCmpHTs = {
	pageLayout: {
		base: defPageLayoutCmp
	},
	topbar: {
		base: defTopbarCmp
	},
	panelLayout: {
		base: basePanelLayoutCmp
	},
	panel: {
		base: panel404Cmp
	}
};

function register(type, name, cmp) {
	var ht = typeCmpHTs[type];
	if (ht)
		ht[name] = cmp;
}

function getComponent(type, name) {
	var ht = typeCmpHTs[type];
	return ht ? ht[name in ht ? name : 'base'] : null;
} 

function getValue(key, matchStr, unitArr, base) {
	var idx = matchStr.indexOf(key);
	return (idx > 0 && idx < unitArr.length) 
			? Math.abs(base - unitArr[idx])
			: base;
}

// anchorType: 'L|C|R' + 'T|M|B';
function getPanelData(item) {
	var panelName = $XP(item, 'name', 'panel' + IX.id());
	var panelTitle = $XP(item, 'title', panelName);

	var pt = item.pt, size = item.size;
	var anchorType = $XP(item, 'anchorType', 'LT').split('');
	var w = size[0] || 400, h = size[1] || 240;
	var l = pt[0] || 30, t = pt[1] || 90;

	l = getValue(anchorType[0], 'LCR', [0, w / 2, 1920 - w], l);
	t = getValue(anchorType[1], 'TMB', [0, h / 2, 1080 - h], t);

	return {
		name: panelName,
		title: panelTitle,
		layout: getComponent('panelLayout', $XP(item, 'layout', 'base')),
		component: getComponent('panel', $XP(item, 'cmp', panelName)),
		style: {
			left: l + 'px', top: t + 'px', 
			width: w + 'px', height: h + 'px'
		}
	};
}

export default {
	register, // (type, name, cmp)
	getLayout(name) { return getComponent('pageLayout', name); },
	getTopbar(name) { return getComponent('topbar', name); },
	getPanels(list) { return IX.map(list, getPanelData); }
};