<template>
	<ix-layout>
		<div class="p2">
			<span>{{desc}}</span>
			<biz-example />
			<ns-biz-sample />

			<router-view></router-view>
		</div>
	</ix-layout>
</template>

<script>
import ixLayout from '@/layout/default';
import BizExample from '@/biz-components/example';
import nsBizSample from 'biz-components/nsBizSample';

export default {
	name: 'samplePage2',
	data() {
		return {
			desc: 'Common Page Sample 2'
		};
	},
	components: {
		ixLayout,
		BizExample,
		nsBizSample
	}
};
</script>

<style lang='less'>
.p2{
	.ns-biz-sample { background: green; }
}
</style>