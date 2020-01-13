<template>
	<div class="ssf-page-layout-base">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'ssfPageLayoutBase'
};
</script>

<style lang='less'>
.ssf-page-layout-base {
	background:rgba(0,0,255, 0.3);
	width:100%; height:100%;
}
</style>