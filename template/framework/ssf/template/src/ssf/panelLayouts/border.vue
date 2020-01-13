<template>
	<div class="ssf-border-layout">
		<div class="hdr">
			<span>{{title}}</span>
		</div>	
		<slot />
	</div>
</template>

<script>

export default {
	name: 'ssfBorderLayout',
	props: {
		title: { type: String, default: '标题栏' }
	}
};
</script>

<style lang='less'>
.ssf-border-layout {
	border:2px solid rgba(127,0,0, 0.8); padding: 2px;

	.hdr { 
		height:24px; background:#efefef; 
		text-align:left; color: #555;
	}
}
</style>