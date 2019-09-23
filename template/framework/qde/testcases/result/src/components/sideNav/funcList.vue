<template>
	<ix-nav-tree class='list-style-nav' :activeIndex='activeIndex' :items='items' 
			@select='selectNavItem' />
</template>

<script>
import navMixins from '@/components/ixNav/sideNavMixins';
import ixNavTree from '@/components/ixNav/tree';
import NavModel from '@/components/ixNav/model';

const model = new NavModel([
	{ 'id': 21, 'name': '基本功能', 'nodeType': 'Func' },
	{ 'id': 11, 'name': '数据管理类', 'nodeType': 'Category', 'children': [
		{ 'id': 22, 'name': '客户数据类型', 'nodeType': 'Func' },
		{ 'id': 23, 'name': '客户数据项', 'nodeType': 'Func' }
	] },
	{ 'id': 22, 'name': '系统管理类', 'nodeType': 'Category', 'children': [
		{ 'id': 24, 'name': '组织管理', 'nodeType': 'Func' },
		{ 'id': 25, 'name': '配置管理', 'nodeType': 'Func' }
	] }
], 'Func');

export default {
	name: 'funcList',
	mixins: [navMixins],
	components: {
		ixNavTree
	},
	mounted() {
		this.model = model;
		this.firstLoaded();
	}
};
</script>