<template>
	<div class="{{ ns }}-biz-sample">
		<h2>{{desc}}</h2>
	</div>
</template>

<script>
export default {
	name: 'bizSample4Project',
	data() {
		return {
			desc: 'Business Component Sample'
		};
	}
};
</script>

<style lang='less'>
.{{ ns }}-biz-sample{
	border: 1px solid #cfc; background: #ccf;
}
</style>