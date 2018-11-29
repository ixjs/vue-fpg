<template>
	<nav>
		<el-menu class="nav-menu" mode="horizontal" 
				:default-active="activeIndex" 
				@select="selectNavItem">
			<template v-for="item in items">
				<el-menu-item v-if="item.children.length == 0" 
						:index="item.name">{{ item.title }}</el-menu-item>
				<el-submenu class="submenu" v-if="item.children.length > 0" 
						:index="item.name" :key="item.name">
					<template slot="title"><a class="item" @click="jumpTo(item)">{{ item.title }}</a></template>
					<el-menu-item v-for="child in item.children" 
							:key="child.name" :index="child.name" >{{ child.title }}</el-menu-item>
				</el-submenu>
			</template>
		</el-menu>
	</nav>	
</template>

<script>
export default {
	name: 'IXNav',
	props: {
		activeIndex: { type: String },
		items: { type: Array, default: [] }
	},
	methods: {
		jumpTo(item) {
			this.$emit('select', item.defRoute || item.name);
		},
		selectNavItem(key, keyPath) {
			this.$emit('select', key, keyPath);
		}
	}
};
</script>
