<template>
	<div class="ssf-noborder-layout">
		<div class="hdr">
			<span>{{title}}</span>
		</div>	
		<slot />
	</div>
</template>

<script>

export default {
	name: 'ssfNoborderLayout',
	props: {
		title: { type: String, default: '标题栏' }
	}
};
</script>

<style lang='less'>
.ssf-noborder-layout {
	background: rgba(0,0,127, 0.8); padding: 2px;

	.hdr { 
		height:24px; background:#efefef; 
		text-align:left; color: #555;
	}
}
</style>