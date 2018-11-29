<template :name="transition === true ? 'fall' : transition">
	<div class="ix-modal" :id="id" v-show="visible">
		<div class="header" v-if="$slots.header">
			<slot name="header" :id="id"/>
		</div>
		<div class="header" v-else-if="title">
			<span class="title" v-html="title" />
			<a class="el-icon-close" @click="close"></a>
		</div>
		<div class="body">
			<slot :id="id" />
		</div>
		<div class="footer" v-if="$slots.footer">
			<slot name="footer" :id="id"/>
		</div>
		<div class="footer" v-else-if="footer">
			<a class="btn-ok" @click="confirm"><span>确定</span></a>
			<a class="btn-cancel" @click="close"><span>取消</span></a>
		</div>
	</div>
</template>

<script>
import modalMixin from './modalMixin';

export default {
	name: 'IXModalBase',
	mixins: [modalMixin],
	props: {
		title: { type: String },
		footer: { type: Boolean, default: true }
	}
};
</script>

<style lang='less'>
.ix-modal {
	position: fixed; left: 50%; top: 50%; width: 609px; transform: translate(-50%, -50%);
	background: rgba(13,40,59,0.8); color: white; 

	.header {
		width: 100%; height: 40px; line-height: 40px; overflow: hidden; 
		padding-left: 20px; border-bottom: 1px solid #777;

		.title { float: left; font-size: 14px; font-weight: bold; }
		.el-icon-close { 
			float: right; font-size: 24px; color: #C8CCD0;
			position: relative; left: -8px; top: 8px; width: 24px; height: 24px;
		}
	}
	.body { padding: 30px 35px 20px; margin: 0;}
	.footer { overflow: hidden; padding: 18px 0 20px; text-align: center; }
}

.fall-enter { transform: scale(0.2); }
.fall-enter-active{ transition: all 0.3s ease; }
.fall-leave-active{ transition: all 0.4s ease; transform: scale(0.2); opacity: 0.3; }
</style>