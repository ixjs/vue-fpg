<template>
	<div class="cmp-sample">
		<span>{{desc}}</span>
	</div>
</template>

<script>
export default {
	name: 'SharedSample',
	data() {
		return {
			desc: 'Shared Component Sample'
		};
	}
};
</script>

<style type='less'>
.cmp-sample { color: blue; }
</style>