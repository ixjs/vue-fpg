<template>
	<div id="app">
		<ix-nav :activeIndex="activeIndex" :items="navItems" @select="navTo" />

		<div class="links">
			<a @click="popDialog"><span class="pic-l"></span>弹窗</a>
			<a @click="jumpTo('np')">打开Unique Page<span class="pic-r"></span></a>
		</div>

		<transition name="page-fade" mode="out-in">
			<router-view></router-view>
		</transition>

		<ix-modals></ix-modals>
	</div>
</template>

<script>
import routeMixin from '@/_mixins/routeMixin';
import ixModals from '@/components/ixModal/modals';
import ixAlert from '@/components/ixModal/alert';
import ixNav from '@/components/ixNav';

// var nsRoute = IXW.ns('Route');
var sessionFactory = IXW.ns('SessionFactory');
// var serviceFactory = IXW.ns('serviceFactory');

export default {
	name: 'app',
	mixins: [routeMixin],
	data: function () {
		return {
			navItems: [],
			activeIndex: null
		};
	},
	methods: {
		cleanSession() {
			// console.log('Caused by clear Sesson:');
		},
		initSession(session) {
			this.navItems = session.getNavs();
			this.focusNav(this.$route.name);
			// console.log('caused by init Sesson:');
		},
		focusNav(name) { this.activeIndex = name; },
		navTo(key) { 
			this.focusNav(key);
			this.jumpTo(key); 
		},
		popDialog: function () {
			this.$modal.create({
				component: ixAlert,
				props: {
					title: '弹出名称',
					msg: '看到弹窗，请关闭！',
					okFn: () => { console.log('已关闭弹窗'); }
				}
			});
		}
	},
	watch: {
		'$route'(to) {
			// console.log('switch to:', to);
			this.focusNav(to.name);
		}
	},
	components: {
		ixModals,
		ixNav
	},
	created() {
		// sessionFactory.listen('init', (session) => {
		// 	this.initSession(session);
		// });
		// sessionFactory.listen('clear', () => {
		// 	this.cleanSession();
		// });
		// serviceFactory.registerErrorHandler((result) => {
		// 	this.$modal.create({
		// 		component: ixAlert,
		// 		props: {
		// 			title: '错误提示',
		// 			msg: result.msg
		// 		}
		// 	});
		// });
		this.initSession(sessionFactory.getInstance());
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
.nav-item {background:green;color:white;margin:0 10px;}

.links {
	a { color:green;}
	span {width: 18px; height: 17px;}
	.pic-r {.x-pic-btn-fold;}
	a:hover .pic-r {.x-pic-btn-fold-hover; }
	.pic-l {.x-pic-btn-unfold;}
	a:hover .pic-l {.x-pic-btn-unfold-hover; }
}	
</style>
