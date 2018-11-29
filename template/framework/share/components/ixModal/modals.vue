<template>
	<div class="ix-modals" v-show='modals.length'>
		<div class="mask" :style='{ zIndex: zMask }' v-show='ifMask'></div>
		<component v-for="modal in modals"
				:is='modal.component'
				:key='modal.id'
				:style='{ zIndex: modal.zIndex }'
				:visible='modal.visible' 
				v-bind='modal.props'/>
	</div>
</template>

<script>
const ZIndexBase = 2000;
const DeltaZIndex = 200;

/* ix-modals: Modal容器标签，一般只在app.vue中作为#app的最后一个子元素被调用；
 * 调用后将在所有vue对象上绑定$modal属性，主要使用三个方法：
 *	
 *	var modal = this.$modal.create({id, component, options: {
 *			mask :  是否使用背景遮罩
 *			visible : 产生是否可见
 *		}, props: { 
 *			transition: 'fall' // 窗体显示/隐藏时的动画效果
 *			// 其他窗体自定义的参数
 *		}
 *	});
 *	this.$modal.destroy(modalId); // modalId可不提供，将销毁最上面的窗体
 *	this.$modal.clean(); //清楚当前的所有窗体
 *
 * create返回的结果modal内含四个方法:
 *
 *		show: function () {}, // 显示窗体
 *		hide: function () {}, // 隐藏窗体
 *		animateDestory: function (ms) {}, // 动画效果销毁窗体
 *		destroy: function () {} // 简单销毁窗体
 */
export default {
	name: 'IXModals',
	data() {
		return {
			modals: [],
			zMask: ZIndexBase - 1,
			ifMask: false
		};
	},
	methods: {
		clean() {
			this.modals = [];
			this.zMask = ZIndexBase - 1;
			this.ifMask = false;
		},
		_refresh() {
			var _ifMask = false, _zIndex = ZIndexBase - 1;
			IX.iterate(this.modals, function (m) {
				if (m.ifMask && m.visible) {
					_ifMask = true;
					_zIndex = m.zIndex - 1;
				}
			});
			this.ifMask = _ifMask;
			this.zMask = _zIndex;
		},
		_destroy(modalId) {
			this.modals = IX.loop(this.modals, [], function (acc, m) {
				if (m.id != modalId)
					acc.push(m);
				return acc;
			});
		},
		/*  modal :{
				id, component, options: {
					mask :  true/false; default false
					visible : true/false, default true
				}, props
			}
		 */
		create(modal) {
			var lastModal = this.modals[this.modals.length - 1];
			var options = $XP(modal, 'options', {});
			var self = this;
			var modalId = modal.id || IX.id();
			var m = {};

			m.id = modalId;
			m.zIndex = lastModal ? (lastModal.zIndex + DeltaZIndex) : ZIndexBase;
			m.ifMask = $XP(options, 'mask', true);
			m.visible = $XP(options, 'visible', true);
			m.component = modal.component;
			m.props = Object.assign(modal.props, {
				id: modalId
			});

			if (m.ifMask) {
				this.ifMask = true;
				this.zMask = m.zIndex - 1;
			}

			this.modals.push(m);
			return {
				show() { m.visible = true; self._refresh(); },
				hide() { m.visible = false; self._refresh(); },
				animateDestory(ms) {
					m.visible = false;
					self._refresh();
					setTimeout(function () { self._destroy(modalId); }, ms || 500);
				},
				destroy: function () { self.destroy(modalId); }
			};
		},
		destroy(modalId) {
			var _id = modalId;
			if (!_id)
				_id = this.modals.length > 0 ? this.modals[this.modals.length - 1].id : null;
			if (!_id)
				return;
			this._destroy(_id);
			this._refresh();
		}
	},
	beforeCreate() {
		var Vue = this.$root.constructor;
		Object.defineProperty(Vue.prototype, '$modal', {
			value: this,
			readable: true,
			writable: false
		});
	}
};
</script>

<style lang='less'>
.ix-modals .mask {
	position: fixed; left: 0; top: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.66);
}
</style>