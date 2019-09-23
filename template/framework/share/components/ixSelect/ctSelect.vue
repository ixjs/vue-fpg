<template>
	<el-select :value="val" :disabled="disabled" :placeholder="placeholder"
			@input="change">
		<el-option v-for="item in options"
				:key="item.value" :label="item.label" :value="item.value"></el-option>
	</el-select>
</template>

<script>
import mixins from './_mixins';
import cmpMixins from './_cmpMixins';

var nsConst = IXW.ns('Const');

// ix-ct-select 
// 可以定义items，优先被常量码表覆盖，也可以被api调取码表数据覆盖；
export default {
	name: 'IXCTSelect',
	mixins: [mixins, cmpMixins],
	props: {
		ctName: { type: String }
	},
	mounted() {
		if (this.items) {
			this.options = this.items;
			return;
		}
		if (IX.isString(this.ctName))
			this.options = IXW.dup(nsConst[this.ctName + 'Set']);
		else
			this.loadFromApi();
	}
};
</script>
