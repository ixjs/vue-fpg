const Precise = 100000;
function stdCvt(v, base) {
	return Math.floor(v * Precise / base) / Precise;
}
function stdDecvt(v, base) {
	return Math.floor(v * base);
}

/** cfg: {
		convert2Store(value, base),  // (20, 100) => 0.2
		convert2View(value, base)    // (0.2, 100) => 20
	}
	return {
		setArea(maxW, maxH)
		cvt2Store({ x, y, w, h }) => { px, py, pw, ph }
		cvt2View({ px, py, pw, ph }) => { x, y, w, h }
	}
  */
function Calculator(cfg) {
	var cvt = cfg.convert2Store || stdCvt;
	var decvt = cfg.convert2View || stdDecvt;

	var maxX = 320;
    var maxY = 240;

	return {
		setArea(w, h) {
			maxX = w; 
			maxY = h;
		},
		cvt2Store(rect) {
			return {
				px: cvt(rect.x, maxX),
				py: cvt(rect.y, maxY),
				pw: cvt(rect.w, maxX),
				ph: cvt(rect.h, maxY),
			};
		},
		cvt2View(rect) {
			return {
				x: decvt(rect.px, maxX),
				y: decvt(rect.py, maxY),
				w: decvt(rect.pw, maxX),
				h: decvt(rect.ph, maxY),
			};
		}
	};
}

const DefMarkerStr = JSON.stringify({
	clz: '', isFocused: false,
    x: 200, y: 100, w: 160, h: 80
});

var localIdCounter = 1;
function getId() {
	localIdCounter += 1;
	return 'rect-' + localIdCounter + '-' + (new Date()).getTime();
}
function stdMarkerClz(marker) {
    var clzArr = [];
	if (marker.isFocused) clzArr.push('focused');
    return clzArr.join(' ');
}

/* cfg: {
		mode: 'view', // 工作模式：仅查看还是可修改
		clzFn({id, isFocused}),

		convert2Store(value, base),  // (20, 100) => 0.2
		convert2View(value, base)    // (0.2, 100) => 20
	},

	marker4View: {id,clz, isFocused, x, y, w, h}
	marker4Store: {id, px, py, pw, ph}

	return {
        setViewMode(m), // C/V: 更改工作模式，触发 ’viewmode’事件
		inViewMode(), // V: 返回当前工作模式是否查看模式

        setViewArea(w, h)， // V: 画布区域重置；触发‘resize'和’refresh‘事件
		on(name, fn), // C/V: 事件监听：
			// 'viewmode‘：V: 工作模式变更；参数为：<是否查看模式>,
			// 'resize': C: 画布区域变更；参数为<[画布宽,画布高]>
			// 'refresh': V: 展示数据变更；参数为<用于页面展示的标记数组>
			// 'add': C: 新增节点； 参数为：<新节点临时ID>
			// 'remove': C: 删除节点； 参数为：<删除节点ID>
			// 'update': C: 新增节点； 参数为：<当前焦点节点ID>
			// ‘blur’：C: 失去焦点，参数为：<失去焦点节点ID>
			// ‘focus’：C: 聚焦节点，参数为：<聚焦节点ID>

		setViewportFn(fn), // V: 设置获取查看画布的窗口位置的函数
		get(markerId), // C: 获取 markerId对应的标记数据（用于持久化）； 
		getFocusedId(), // C: 获取当前焦点的markerId
		getRenderData, // V: 获取用于页面展示的标记数组
		getData(), // C: 获取用于持久化的标记数组
		refresh(list), // C: 通过持久化的数据舒心画布，触发‘refresh’事件
        add(), // C: 非查看模式下新增marker，触发‘add’和‘refresh’事件
        remove(), // C: 非查看模式下删除被聚焦的marker，触发‘remove’和‘refresh’事件 {
		resetMarkerId(id, newId), // C: 变更id指定marker的主键为newID
		updateClass(id), // C: 更新id 指定marker的展示样式,
        updateStyles(rect), // V: 更新焦点marker的位置和尺寸，触发‘update’事件
		blur(id), // V: 对当前焦点marker失焦， 触发‘blur’事件
        focus(id) // V: 聚焦id对应的marker节点， 触发‘focus’事件
    }
 */
function Model(cfg) {
	var isInViewMode = cfg.mode == 'view';

	var markerClzFn = cfg.clzFn || stdMarkerClz;
	var calc = new Calculator(cfg);

	var focusedId = null;
	var marker4StoreHT = {};
	var marker4ViewHT = {};
    var markerIds = [];

	var getViewportXY = () => { return [0, 0]; };
	
	var cbHT = {};
    function triggerCB(name, data) {
        if (name in cbHT && cbHT[name])
            cbHT[name](data);
	}

	function updateViewClz(marker) {
		marker.isFocused = marker.id == focusedId;
		marker.clz = markerClzFn(marker);
	}
	function createViewMarker(markerId) {
		var marker = calc.cvt2View(marker4StoreHT[markerId]);
			
		marker.id = markerId;
		updateViewClz(marker);

		marker4ViewHT[markerId] = marker;
		return marker;
	}
	function createStoreMarker() {
		var newMarkerId = getId();
		var newMarker = JSON.parse(DefMarkerStr);
		var pos = getViewportXY();
		newMarker.id = newMarkerId;
		newMarker.x += pos[0];
		newMarker.y += pos[1];

		var markerInStore = calc.cvt2Store(newMarker);
		markerInStore.id = newMarkerId;

		marker4ViewHT[newMarkerId] = newMarker;
		marker4StoreHT[newMarkerId] = markerInStore;
		markerIds.push(newMarkerId);

		return newMarkerId;
	}
	function updateViewMarkers() {
		var arr = [];
		for (var i = 0; i < markerIds.length; i += 1) 
			arr.push(createViewMarker(markerIds[i]));
		return arr;
	}
	function getRenderData() {
		var arr = [];
		for (var i = 0; i < markerIds.length; i += 1)
			arr.push(marker4ViewHT[markerIds[i]]);
		return arr;
	}
	function getStoreData() {
		var arr = [];
		for (var i = 0; i < markerIds.length; i += 1)
			arr.push(marker4StoreHT[markerIds[i]]);
		return arr;
	}

	function clear() {
		marker4StoreHT = {};
		marker4ViewHT = {};
		markerIds = [];
		focusedId = null;
	}
	function initMarkers(list) {
		clear();
		if (!list || list.length == 0)
            return [];

		var len = list.length;
		focusedId = null; // list[len - 1].id;
			
		var arr = [];
        for (var i = 0; i < len; i += 1) {
			var marker = list[i];
			var markerId = marker.id || getId();

			markerIds.push(markerId);
			marker4StoreHT[markerId] = marker;
			arr.push(createViewMarker(markerId));
		}
		return arr;
	}
	function updatePosition(markerId, rect) {
		var focusedItem = marker4ViewHT[markerId];
		if (!focusedItem)
			return;

		focusedItem.x = rect.left;
		focusedItem.y = rect.top;
		focusedItem.w = rect.width;
		focusedItem.h = rect.height;

		var marker = marker4StoreHT[markerId];
		var pos = calc.cvt2Store(focusedItem);
		marker.px = pos.px;
		marker.py = pos.py;
		marker.pw = pos.pw;
		marker.ph = pos.ph;

		return true;
	}
	
    var self = {
        setViewMode(m) { 
			isInViewMode = m == 'view';
			triggerCB('viewmode', isInViewMode);
		},
		inViewMode() { return isInViewMode; },

        setViewArea(w, h) {
			calc.setArea(w, h);
			triggerCB('resize', [w, h]);
            triggerCB('refresh', updateViewMarkers());
		},
		on(name, fn) { cbHT[name] = fn; },
		setViewportFn(fn) { getViewportXY = fn; },
		
		get(markerId) { return marker4StoreHT[markerId] || null; },
		getFocusedId() { return focusedId; },
		
		getRenderData,

		getData() { return getStoreData(); },
		refresh(list) { triggerCB('refresh', initMarkers(list)); },
		
        add() {
			if (isInViewMode) 
				return;
			var newMarkerId = createStoreMarker();
			self.focus(newMarkerId);
			triggerCB('add', newMarkerId);
            triggerCB('refresh', getRenderData());
        },
        remove() {
            if (isInViewMode || !focusedId)
                return;
            var arr = [];
            for (var i = 0; i < markerIds.length; i += 1) {
                if (markerIds[i] != focusedId)
					arr.push(markerIds[i]);
			}
			marker4StoreHT[focusedId] = null;
			marker4ViewHT[focusedId] = null;
            markerIds = arr;
			triggerCB('remove', focusedId);
			focusedId = null;
            triggerCB('refresh', getRenderData());
		},
		resetMarkerId(id, newId) {
			var marker = marker4StoreHT[id];
			marker.id = newId;
			marker4StoreHT[id] = null;
			marker4StoreHT[newId] = marker;

			marker = marker4ViewHT[id];
			marker.id = newId;
			updateViewClz(marker);
			marker4ViewHT[id] = null;
			marker4ViewHT[newId] = marker;

			for (var i = 0; i < markerIds.length; i += 1) {
				if (markerIds[i] != id)
					markerIds[id] = newId;
			}
		},
		updateClass(id) { updateViewClz(marker4ViewHT[id]); },
        updateStyles(rect) { 
			if (updatePosition(focusedId, rect))
				triggerCB('update', focusedId);
		},
        blur(id) {
            if (!focusedId || (id && id != focusedId))
                return;
            var marker = marker4ViewHT[focusedId];
            focusedId = null;
            updateViewClz(marker);
			triggerCB('blur', marker.id);
        },
        focus(id) {
            self.blur();
            var marker = marker4ViewHT[id];
            focusedId = id;
			updateViewClz(marker);
			triggerCB('focus', id);
        }
    };
    return self;
}

export default Model;