<template>
	<div class="sub1">
		<span>{{desc}}</span>
	</div>
</template>

<script>
export default {
	name: 'sampleSubPage1',
	data() {
		return {
			desc: 'Common Sub Page 1'
		};
	}
};
</script>

<style lang='less'>
.sub1{
	background: #ccc;
}
</style>