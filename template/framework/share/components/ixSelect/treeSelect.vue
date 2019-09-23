<template>
	<el-select filterable clearable class="ix-tree-select"
			:value="val" :disabled="disabled" :placeholder="placeholder"
			@input="change">
		<el-option v-for="item in options" 
				:disabled="item.disabled" :class="['ix-tree-select-option', item.clz]"
				:key="item.value" :label="item.label" :value="item.value">
			<slot v-if="$slots" :item="item"/>
			<span v-else>{{item.label}}</span>
		</el-option>
	</el-select>
</template>

<script>
import mixins from './_mixins';
import cmpMixins from './_cmpMixins';

function getDefaultChecker(nodeType) {
	return (item) => { return !nodeType || item.nodeType == nodeType; };
}
function getItemFromValue(v) {
	if (!v) return null;
	var arr = v.split('-');
	return { id: arr[1], nodeType: arr[0] };
}
// items: [{id, name, nodeType, children}]
// value : {id, nodeType}
// checkFn: function(item, value)
// return [{value, label, clz, disabled}]
function createOptions4Tree(items, value, checkFn) {
	var _check = IX.isFn(checkFn) ? checkFn : () => { return true; };
	var options = [];

	function iterItems(arr, lvl) {
		IX.iterate(arr, (item) => {
			options.push({
				value: item.nodeType + '-' + item.id,
				label: item.name,
				clz: 'type-' + item.nodeType + ' level-' + lvl,
				disabled: !_check(item, value)
			});
			iterItems(item.children, lvl + 1);
		});
	}
	iterItems(items, 1);
	// console.log('created options: ', options);
	return options;
}

// ix-tree-select 
// api获取数据将覆盖items;
export default {
	name: 'IXTreeSelect',
	mixins: [mixins, cmpMixins],
	props: {
		checkEnable: { type: Function },
		nodeType: { type: String, default: null }
	},
	methods: {
		getSelectedValue(v) { return this.nodeType + '-' + v; },
		getSelectedItem(v) { return getItemFromValue(v); },
		createOptions(items) {
			return createOptions4Tree(items || [], this.value, this._check);
		}
	},
	mounted() {
		this._check = this.checkEnable;
		if (!IX.isFn(this._check))
			this._check = getDefaultChecker(this.nodeType);

		if (this.items)
			this.options = this.createOptions(this.items);
		else 
			this.loadFromApi();
	}
};
</script>
<style lang='less'>
.ix-tree-select-option {
	&.level-1 { padding-left:16px;}
	&.level-2 { padding-left:32px;}
	&.level-3 { padding-left:48px;}
	&.level-4 { padding-left:64px;}
	&.level-5 { padding-left:80px;}
	&.level-6 { padding-left:96px;}
}
</style>