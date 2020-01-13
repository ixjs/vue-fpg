<template>
	<div class="ssf-main-layout">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'ssfMainLayout'
};
</script>

<style lang='less'>
.ssf-main-layout{
	background:rgba(0,0,255, 0.3);
	width:100%; height:100%;
}
</style>