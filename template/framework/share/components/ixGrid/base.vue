<template>
	<el-table :data='data' row-key="id"
			default-expand-all :tree-props="{children: 'children'}"
			border stripe style="width:100%;"
			ref="multipleTable" @selection-change="handleSelectionChange"
			@cell-click="cellClick">
		<el-table-column v-if='ifMultiSelection' fixed="left" type="selection" width="55" />
		<el-table-column v-for="(col, idx) in columns" :key="col.name"
				:fixed="col.fixed || idx == 0 || col.name == 'name'" 
				:prop="col.name" 
				:label="col.label" 
				:width="col.width || 200" >
			<template v-if='col.type=="html"' v-slot:default="scope">
				<div v-html="scope.row[scope.column.property]" />
			</template>
		</el-table-column>
		<el-table-column v-if='maxActions > 0' :key='"_actions"'
				fixed="right" 
				:width='maxActions * 140' >
			<template slot-scope="scope">
				<a class="el-action" v-for='btn in scope.row._actions' :key="btn.name"
						@click="actionClick(btn.name, scope.row)">{{btn.label}}</a> 
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
export default {
	name: 'IXGrid',
	props: {
		ifMultiSelection: { type: Boolean, default: false },
		data: { type: Array, default: [] },
		columns: { type: Array, default: [] },
		maxActions: { type: Number, default: 0 }
	},
	methods: {
		cellClick(row, column) {
			// console.log("cell Clicked0:", column, cell, row);
			this.$emit('cellClick', column.property, row);
		},
		actionClick(actName, row) {
			this.$emit('action', actName, row);
		},
		handleSelectionChange(val) {
			this.$emit('selection', val);
		}
	}
};
</script>

<style lang='less'>
.el-table {
	.el-action { display:inline-block; margin-right: 10px;}
}
</style>