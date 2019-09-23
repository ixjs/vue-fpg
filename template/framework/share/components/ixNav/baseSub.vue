<template>
	<el-submenu class="submenu" v-else  :key="item.name" :index="item.name">
		<template slot="title"><a @click="selectNavItem(item.name)">{{ item.title }}</a></template>
		<template v-for="child in item.children">
			<el-menu-item v-if="!child.children || child.children.length == 0"
					:key="child.name" :index="child.name">
				<template slot="title">{{ child.title }}</template>
			</el-menu-item>
			<nav-base-sub v-else :item="child" @select="selectNavItem" />
		</template>
	</el-submenu>
</template>

<script>
export default {
	name: 'NavBaseSub',
	props: {
		item: { type: Object, default: null }
	},
	methods: {
		selectNavItem(key, keyPath) { this.$emit('select', key, keyPath); }
	}
};
</script>
