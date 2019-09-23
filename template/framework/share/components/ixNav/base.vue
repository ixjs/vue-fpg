<template>
	<el-menu class="nav-menu" :mode="mode" :default-active="activeIndex" 
			@select="selectNavItem">
		<template v-for="item in items">
			<el-menu-item v-if="!item.children || item.children.length == 0"
					:key="item.name" :index="item.name">
				<template slot="title">{{ item.title }}</template>
			</el-menu-item>
			<nav-base-sub v-else :item="item" @select="selectNavItem" />
		</template>
	</el-menu>
</template>

<script>
import navMixin from './mixin';
import navBaseSub from './baseSub';

export default {
	name: 'NavBase',
	mixins: [navMixin],
	props: {
		mode: { type: String, default: 'vertical' }
	},
	components: {
		navBaseSub
	}
};
</script>

<style lang='less'>
.el-menu.tree-style-nav {
	.el-submenu__title { color:#777; text-align:left;}
	.el-menu-item { text-align:left; }
}
</style>

