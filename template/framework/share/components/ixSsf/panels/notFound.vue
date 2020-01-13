<template>
	<div class="ssf-panel-notfound">
		Can't found named Panel：{{name}}.
	</div>
</template>

<script>
export default {
	name: 'ssfPanelNotFound',
	props: {
		name: { type: String, default: '???' }
	}
};
</script>

<style lang='less'>
.ssf-panel-notfound {
	font-size:40px;  color:#d33; font-weight:bold;
}
</style>