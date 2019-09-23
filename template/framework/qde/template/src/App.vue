<template>
	<div id='app'>
		<transition name='page-fade' mode='out-in'>
			<router-view></router-view>
		</transition>
		<ix-modals></ix-modals>
	</div>
</template>

<script>
import ixModals from '@/components/ixModal/modals';
import ixAlert from '@/components/ixModal/alert';

var serviceFactory = IXW.ns('serviceFactory');

export default {
	name: 'app',
	components: {
		ixModals
	},
	created() {
		serviceFactory.registerErrorHandler((result) => {
			this.$modal.create({
				component: ixAlert,
				props: {
					title: '错误提示',
					msg: result.msg
				}
			});
		});
	}
};
</script>

<style lang='less'>
@import './less/ixwpre.less';

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	background-color: #777;
}
</style>
