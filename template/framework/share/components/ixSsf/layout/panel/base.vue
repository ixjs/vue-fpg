<template>
	<div class="ssf-panel-layout-base">
		<div class="hdr">
			<span>{{title}}</span>
		</div>	
		<slot />
	</div>
</template>

<script>

export default {
	name: 'ssfPanelLayoutBase',
	props: {
		title: { type: String, default: '标题栏' }
	}
};
</script>

<style lang='less'>
.ssf-panel-layout-base {
	background: #777; padding: 2px;
	border:1px solid rgba(127,32,32, 0.8); border-width: 1px 0 0 1px; 

	.hdr { 
		height:24px; background:#efefef; padding:4px 8px;
		text-align:left; color: #555;
	}
}
</style>