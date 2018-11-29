<template>
	<div class="p1">
		<span>{{desc}}</span>

		<sample />
		<{{ ns }}-sample />
	</div>
</template>

<script>
import sample from '@/components/sample';
import {{ ns }}Sample from 'components/{{ ns }}Sample';

// var serviceFactory = IXW.ns('serviceFactory');
// serviceFactory.loginService("login", {}, function(data){
// 	console.log("login :", data);
// }, function(info){
// 	console.log("err :", info);
// });

export default {
	name: 'samplePage',
	data() {
		return {
			desc: 'Common Page Sample 1'
		};
	},
	components: {
		sample,
		{{ ns }}Sample
	}
};
</script>

<style lang='less'>
.p1{
	.{{ ns }}-sample { background: red; }
}
</style>