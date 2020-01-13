<template>
	<div class="ssf-panel-std">
		Here is {{name}} <br><i>{{msg}}</i>
	</div>
</template>

<script>
export default {
	name: 'ssfStdPanel',
	props: {
		name: { type: String, default: '???' },
		msg: { type: String, default: '...' }
	}
};
</script>

<style lang='less'>
.ssf-panel-std {
	font-size:40px;  color: white;
}
</style>