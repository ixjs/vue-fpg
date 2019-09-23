<template>
	<el-container :class='"default-layout page-" + $route.name'>
		<el-header>
			<span class='logo'>
				<a @click='navTo()'><%- fullname %></a>
			</span>
			<ix-nav v-if='ifNav' :activeIndex='activeIndex' :items='navItems' @select='navTo' />
			<div v-if='ifEntry' class='profile-tip'>
				<span v-show='isLogin' class='name'>{{name}}</span>
				<span class='entry'><a @click='entryClick'>{{entryTitle}}</a></span>
			</div>
		</el-header>
		<el-container class='main-panel'>
			<el-aside v-if='lsideCmp'>
				<component :is='lsideCmp' :focused='focusedId' @select='sideClick' />
			</el-aside>
			<el-main>
				<h3 class='breadcrumb'>
					<slot name='breadcrumb'>{{pageTitle}}</slot>
				</h3>
				<slot />
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import routeKeyEncode from '@/_mixins/routeKeyEncode';
import routeKeyDecode from '@/_mixins/routeKeyDecode';
import ixNav from '@/components/ixNav/index';

var sessionFactory = IXW.ns('SessionFactory');

export default {
	name: 'DefaultLayout',
	mixins: [routeKeyEncode, routeKeyDecode],
	props: {
		ifNav: { type: Boolean, default: true },
		ifEntry: { type: Boolean, default: true },
		lsideCmp: { type: Object, default: null }
	},
	data() {
		return {
			navItems: [],
			activeIndex: null,
			pageTitle: '',

			focusedId: null,

			isLogin: false,
			name: '',
			entryTitle: '登陆'
		};
	},
	methods: {
		navTo(key) {
			this.jumpTo(key || $XP(this.navItems, '0.name'));
		},
		entryClick() {
			if (this.isLogin)
				sessionFactory.clearSession();
			this.jumpTo('entry');
		},
		sideClick(item) {
			this.$emit('select', item);
		}
	},
	components: {
		ixNav
	},
	mounted() {
		var session = sessionFactory.getInstance();
		this.isLogin = session.isValid();
		this.name = $XP(session.get(), 'name', '');
		this.entryTitle = this.isLogin ? '退出' : '登陆';
		this.navItems = session.getNavs();

		var pageInfo = sessionFactory.getPageInfo(this.$route.name);
		if (!pageInfo)
			return;
		this.pageTitle = pageInfo.title;
		this.activeIndex = pageInfo.navItem;

		if (this.lsideCmp)
			this.focusedId = $XP(this.routeKey, 'id');
	}
};
</script>

<style lang='less'>
.default-layout {
	background: #f0f0f0; position:fixed; left:0;right:0; top:0; bottom:0;

	a { text-decoration:none; cursor:pointer; }
	.el-header{
		text-align:left; background: rgba(33,33,33,0.4);
		&>* { display:inline-block; vertical-align:middle;}
		.logo a{ 
			display:block; font-size:40px; width:360px; color: white; 
		}
		.profile-tip {
			float:right; margin:15px 20px; font-size:24px;color:white;
			.name {padding-right:20px; margin-right: 20px;border-right:1px solid #fff;}
			a { color:#fff; }
			a:hover { color:#ccc;}
		}
	}
	.main-panel {overflow: auto;}
	.el-aside { position:relative; }
	.el-aside > .nav-menu { position:absolute; left:0; top:0; width:100%; height:100%; }
	.el-main .breadcrumb {text-align:left;}
}
</style>