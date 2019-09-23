<template>
	<div class="ns-sample">
		<h2>{{desc}}</h2>
	</div>
</template>

<script>
export default {
	name: 'sample4Project',
	data() {
		return {
			desc: 'Common Component Sample'
		};
	}
};
</script>

<style lang='less'>
.ns-sample {
	border: 1px solid #fcc; background: #ccf;
}
</style>