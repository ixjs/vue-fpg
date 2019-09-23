<template>
	<ix-modal :title='title' :transition="true" v-bind='$props' >
		<template>
			<pre>{{msg}}</pre>
		</template>
		<template slot='footer'>
			<a class="btn-ok" @click="confirm"><span>确定</span></a>
			<a class="btn-cancel" @click="close"><span>取消</span></a>
		</template>
	</ix-modal>
</template>

<script>
import ixModal from './modal';
import modalMixin from './modalMixin';

export default {
	name: 'IXConfirmModal',
	mixins: [modalMixin],
	props: {
		title: { type: String, default: '' },
		msg: { type: String, default: '' },
		okFn: { type: Function }
	},
	methods: {
		confirm() {
			this.okFn();
			this.close();
		}
	},
	components: {
		ixModal
	}
};
</script>
<style lang='less'>
.ix-modal {
	pre {
		background: transparent;color:white; text-align:left; font-size:14px;
		padding: 30px 35px 20px; border:none; 
	}
}
</style>