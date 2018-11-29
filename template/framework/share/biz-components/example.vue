<template>
	<div class="biz-example">
		<span>{{desc}}</span>
	</div>
</template>

<script>
export default {
	name: 'SharedBizExample',
	data() {
		return {
			desc: 'Shared Business Component Sample'
		};
	}
};
</script>

<style type='less'>
.biz-example { color: green; }
</style>