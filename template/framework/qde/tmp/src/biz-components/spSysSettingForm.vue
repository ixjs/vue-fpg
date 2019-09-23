<template>
	<ix-form :form='form' :fields='fields' :btns='btns'
			@submit='submit' />
</template>

<script>
import selectedMixin from '@/components/ixMS/selectedMixin';
import ixForm from '@/components/ixForm/base';

var serviceFactory = IXW.ns('serviceFactory');

export default {
	name: 'spSysSettingForm',
	mixins: [selectedMixin],
	data() {
		return {
			form: {
				name: '',
				actived: false
			},
			fields: [
				{ name: 'name', label: '功能项', disabled: true },
				{ name: 'actived', label: '是否启用', type: 'bool' }
			],
			btns: [
				{ name: 'submit', label: '确认' }
			]
		};
	},
	watch: {
		selectedItem() {
			this.form.name = null;
			this.load();
		}
	},
	methods: {
		submit() {
			if (this.inSubmit)
				return;
			this.inSubmit = true;
			serviceFactory.apiService('setFuncActived', {
				'id': this.selectedItem.id,
				'actived': this.form.actived
			}, () => {
				this.inSubmit = false;
			});
		},
		load() {
			serviceFactory.apiService('getFuncActived', {
				'id': this.selectedItem.id
			}, (data) => {
				this.form.name = this.selectedItem.name;
				this.form.actived = data.actived;
			});
		}
	},
	components: {
		ixForm
	}
};
</script>