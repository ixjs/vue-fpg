<template>
	<entry-layout>
		<ix-form :form='loginForm' :fields='fields' :btns='btns'
				@submit='doSubmit' /> 
	</entry-layout>
</template>

<script>
import MD5 from 'md5.js';
import ixForm from '@/components/ixForm/base';
import ixAlert from '@/components/ixModal/alert';
import routeKeyEncode from '@/_mixins/routeKeyEncode';

import entryLayout from 'src/layout/entry';

var serviceFactory = IXW.ns('serviceFactory');
var sessionFactory = IXW.ns('SessionFactory');

function maskPwd(pwd) {
	return (new MD5()).update(pwd).digest('base64');
}
export default {
	name: 'EntryPage',
	mixins: [routeKeyEncode],
	data() {
		return {
			loginForm: {
				account: '',
				password: ''
			},
			fields: [
				{ name: 'account', label: '用户名', tip: '请输入用户名称' },
				{ name: 'password', label: '密码', type: 'password', tip: '请输入密码' }
			],
			btns: [
				{ name: 'submit', text: '登陆' },
				{ name: 'cancel', text: '取消' }
			]
		};
	},
	methods: {
		doSubmit(form) {
			if (!form.account || !form.password)
				return this.$modal.create({
					component: ixAlert,
					props: {
						title: '错误提示',
						msg: '请输入用户名和密码'
					}
				});

			serviceFactory.loginService('login', {
				account: form.account,
				password: maskPwd(form.password)
			}, (data) => {
				sessionFactory.resetSession(data);
				this.jumpTo('cdt');
			});
		}
	},
	components: {
		ixForm,
		entryLayout
	}
};
</script>