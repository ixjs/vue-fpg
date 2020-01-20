<template>
	<div :class='"entry-layout page-" + $route.name'>
		<div class='panel'>
			<h3>{{ title }}</h3>
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: 'EntryLayout',
	data() {
		return {
			title: IXW_TITLE || '系统'
		};
	}
};
</script>

<style lang='less'>
.entry-layout{
	position:fixed; left:0; top:0; right:0; bottom: 0; background: #eee;
	.panel {
		position: fixed; left: 50%; top: 50%; width: 600px; transform: translate(-50%, -50%);
		border:5px solid #777; padding:20px 30px 20px 20px;
		background: #ccc;
	}
	h3 { margin:20px auto 40px; }
}
</style>