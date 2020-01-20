<template>
	<div class = "ix-markers-view" :class = "inViewMode ? 'view-mode' : ''">
		<img :src='url' />
		<div class="markers" :style="style"
				@click = "click"
				@dblclick = "dbclick">
			<vue-drag-resize class = "marker" v-for = "marker in markers" 
					:data-marker-id = "marker.id"
					:key = "marker.id" :class = "marker.clz"
					:isDraggable = "!inViewMode" :isResizable = "!inViewMode" 
					:isActive = "marker.isFocused" :parentLimitation = "true"
					:x = "marker.x" :y = "marker.y"
					:w = "marker.w" :h = "marker.h" :minw = "10" :minh = "10"
					@resizing = "resize" @dragging = "resize"
					@activated = "focus(marker.id)" >
				<slot v-bind:markerId = "marker.id" />
			</vue-drag-resize>
		</div>
	</div>
</template>

<script>
import VueDragResize from 'vue-drag-resize';
/*
$ npm i -s vue-drag-resize

	<ix-markers-view :url = "viewBg" :model = "model"
			@click = "clickOnMarker"
			@dbclick = "dbclickOnMarker" />
*/

function getAncestorNode(node, className) {
	var el = node;
	while (el) {				
		if (el.className && el.className.indexOf(className) >= 0)
			return el;
		var nodeName = el.nodeName ? el.nodeName.toLowerCase() : '';
		el = (nodeName === 'body') ? null : el.parentNode;
	}
	return null;
}

export default {
	name: 'IXMarkerView',
	props: {
		url: { type: String, default: '' },
		model: { type: Object, default: null }
	},
	data() {
		return {
			inViewMode: this.model.inViewMode(),
			style: '',
			markers: []
				// [{id:1, isFocused: true, clz: 'status-focused',
				//	x: 200, y:100, w:200, h:100 }]
		};
	},
	watch: {
		url(url) { this.resetImgWH(url); }
	},
	methods: {
		getImageRate(w) { // (w, h) {
			return this.areaWidth / w; // Math.max(this.areaWidth / w, this.areaHeight / h);
		},
		resizeImage() {
			var rate = this.getImageRate(this.imageWidth, this.imageHeight);
			var w = this.imageWidth * rate;
			var h = this.imageHeight * rate;
			if (h == 0) return;
			this.style = 'width: ' + w + 'px; height: ' + h + 'px;';
			this.model.setViewArea(w, h);
		},
		resizeView() {
			this.areaWidth = this.$el.offsetWidth;
			if (this.imageWidth) this.resizeImage();
		},
		resetImgWH(url) {
			var img = new Image();
			img.onload = () => {
				img.onload = null;
				this.imageWidth = img.width;
				this.imageHeight = img.height;
				setTimeout(() => { this.resizeImage(); }, 0);
			};
			setTimeout(() => { img.src = url; }, 200);
		},
		resize(newRect) { this.model.updateStyles(newRect); },
		focus(id) { this.model.focus(id); },
		checkBlur(target) {
			var markerNode = getAncestorNode(target, 'marker');
			if (!markerNode) 
				return this.model.blur();
			this.$emit('click', markerNode.getAttribute('data-marker-id'));	
		},
		clearTimeout4Click() { if (this.timer) clearTimeout(this.timer); },
		click(evt) {
			this.clearTimeout4Click();
			this.timer = setTimeout(() => { this.checkBlur(evt.target); }, 100);
		},
		dbclick(evt) {
			this.clearTimeout4Click();
			var markerNode = getAncestorNode(evt.target, 'marker');
			if (!markerNode) return this.model.blur();
			this.$emit('dbclick', markerNode.getAttribute('data-marker-id'));
		}
	},
	components: {
		VueDragResize
	},
	mounted() {
		this.areaWidth = this.$el.offsetWidth;
		this.resetImgWH(this.url);
		this.model.on('viewmode', (inViewMode) => {
			this.inViewMode = inViewMode;
		});
		this.model.on('refresh', (data) => {
			// console.log('refresh:', data);
			this.markers = data;
		});
		this.model.setViewportFn(() => {
			return [0, this.$el.scrollTop];
		});
		this.listener = $Xw.listen('resize', () => {
			// console.log('resize for markers');
			this.resizeView();
		});
	},
	beforeDestroy() {
		this.listener.remove();
	}
};
</script>

<style lang='less'>
@base-border-color: #cccccc;
@linked-border-color: rgb(44, 42, 170);
@focused-border-color: red;
@border-color-1: #ccf;
@border-color-2: #cfc;
@border-color-3: #fcc;

@stick-color: red;

.ix-markers-view {
	position: relative; width: 1280px; height: 960px; overflow: scroll;

	.markers { position:absolute; left:0; top:0;}
	.marker { border: 4px solid @base-border-color; background: rgba(111,111,111,0.2); }
	.marker.linked {border-color: @linked-border-color; }
	.marker.active {border-color: @focused-border-color; background: rgba(77, 13, 13, 0.4);}

	span { 
		position:absolute; top: -12px; right:-12px; height:16px; width:16px;
		background: red; color:white; border-radius:8px; display:block;font-size:8px; 
	}

	.vdr-stick {background: @stick-color;}
}
.ix-markers-view.view-mode {
	.marker, .marker.active {
		 background: rgba(77, 13, 13, 0.1);
	}
	.vdr.active:before { outline: 0;}
}
</style>