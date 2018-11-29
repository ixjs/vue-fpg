<template>
	<div class="p2">
		<span>{{desc}}</span>
		<biz-example />
		<{{ ns }}-biz-sample />

		<router-view></router-view>
	</div>
</template>

<script>
import BizExample from '@/biz-components/example';
import {{ ns }}BizSample from 'biz-components/{{ ns }}BizSample';

export default {
	name: 'samplePage2',
	data() {
		return {
			desc: 'Common Page Sample 2'
		};
	},
	components: {
		BizExample,
		{{ ns }}BizSample
	}
};
</script>

<style lang='less'>
.p2{
	.{{ ns }}-biz-sample { background: green; }
}
</style>