<template>
	<ix-modal :title='title' :transition="true" v-bind='$props' >
		<template>
			<p>{{msg}}</p>
		</template>
		<template slot='footer'>
			<a class="btn-ok" @click="confirm"><span>确定</span></a>
		</template>
	</ix-modal>
</template>

<script>
import ixModal from './modal';
import modalMixin from './modalMixin';

export default {
	name: 'IXAlertModal',
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