<template>
	<ix-modal class='ix-form-dialog' :transition="true" :footer='false'
			v-bind='$props'>
		<template slot='header'>{{title}}</template>
		<ix-entity-form :entityName='entityName' 
				:columns='fields'
				:entity='entityId'
				:buttons='btns'
				@submitDone='submitDone'
				@cancel='close'/>
	</ix-modal>
</template>

<script>
import ixModal from './modal';
import modalMixin from './modalMixin';
import ixEntityForm from '../ixForm/entity';

export default {
	name: 'IXFormDialog',
	mixins: [modalMixin],
	props: {
		title: { type: String, default: '' },
		entityName: { type: String, default: '' },
		entityId: { type: [Number, String], default: null },
		fields: { type: [String, Array], default: '' },
		okFn: { type: Function }
	},
	data() {
		return {
			btns: [
				{ name: 'submit', text: '确认' },
				{ name: 'cancel', text: '取消' }
			]
		};
	},
	methods: {
		submitDone(newEntity) {
			if (IX.isFn(this.okFn)) this.okFn(newEntity);
			this.close();
		}
	},
	components: {
		ixModal,
		ixEntityForm
	}
};
</script>
<style lang='less'>
.ix-modal {
	.el-form-item__label { color:white; }
}
</style>