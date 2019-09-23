<template>
	<ix-form class='compact-form' :form='form' :fields='fields' :btns='btns'
			:autoSubmit='true'
			@submit='deliver' />
</template>

<script>
import masterMixin from '@/components/ixMS/masterMixin';
import ixForm from '@/components/ixForm/base';

export default {
	name: 'spCdtMMForm',
	mixins: [masterMixin],
	data() {
		return {
			form: {
				key: '',
				owner: null
			},
			fields: [
				{ name: 'key', label: '关键字', tip: '请输入查询关键字' },
				{ name: 'owner', label: '管理员', type: 'ENT:User', tip: '根据管理员筛选查询' }
			],
			btns: []
		};
	},
	components: {
		ixForm
	}
};
</script>