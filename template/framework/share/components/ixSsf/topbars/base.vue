<template>
	<div class="ssf-topbar-base">
		<span>{{title}}</span>
	</div>
</template>

<script>

export default {
	name: 'ssfTopbarBase',
	props: {
		title: { type: String, default: '标题栏' }
	}
};
</script>

<style lang='less'>
.ssf-topbar-base {
	top:0; height:60px; left: 560px; right:560px;
	background: rgba(0, 0, 224, 0.5); border:1px solid #fff; border-top:0;
 	text-align:center; color: #fff;	
}
</style>