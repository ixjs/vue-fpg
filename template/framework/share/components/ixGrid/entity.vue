<template>
	<div class="entity-grid">
		<div class="tools" >
			<el-button v-for="btn in gridButtons" :key="btn.name"
					@click="btnClick(btn.name)">{{btn.label}}</el-button>
		</div>
		<ix-grid :ifMultiSelection="ifMultiSelection" 
				:columns="gridColumns" 
				:data="gridData" 
				:maxActions="maxActions"
				@cellClick="cellClick" 
				@action="actionClick" 
				@selection="doSelect"/>
		<el-pagination v-if="hasPagination" layout="total,sizes,prev,pager,next,jumper" 
				:total="total" :current-page="pageNo"
				:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
				@size-change="sizeChange" @current-change="pageChange"/>
	</div>
</template>

<script>
import ixGrid from './base';
import ixAlert from '../ixModal/alert';
import ixConfirm from '../ixModal/confirm';
import ixFormDialog from '../ixModal/formDialog';

var serviceFactory = IXW.ns('serviceFactory');
var nsEntity = IXW.ns('Entity');

export default {
	name: 'IXEntityGrid',
	props: {
		isManual: { type: Boolean, default: false },
		buttons: { type: String, default: null },
		actions: { type: String, default: null },
		hasPagination: { type: Boolean, defult: false },
		entityName: { type: String, default: null },
		columns: { type: String, default: '' },
		autoLoad: { type: Boolean, default: true },
		apiParams: { type: Object, default: () => { return {}; } } // load api params
	},
	data() {
		return {
			ifMultiSelection: false,
			gridButtons: [],
			gridColumns: [],
			gridData: [],
			maxActions: 0,

			total: 0,
			pageNo: 1,
			pageSize: 20
		};
	},
	watch: {
		apiParams(v) {
			var paramStr = JSON.stringify(v);
			// console.log("grid: ", v, paramStr, this.apiParamsString);
			if (paramStr == this.apiParamsString)
				return;
			// console.log("grid:  do load");
			this.apiParamsString = paramStr;
			this.load();
		}
	},
	methods: {
		parseEntity(item) {
			var row = this.entityParser(item);
			if (this.validActionHT) {
				row._actions =	IX.loop(row._actions, [], (acc, action) => {
					if (action in this.validActionHT)
						acc.push(action);
					return acc;
				});
			}
			return row;
		},
		parseGridData(items) {
			var maxActions = 0;
			var gridData = IX.map(items, (item) => {
				var row = this.parseEntity(item);
				maxActions = Math.max(maxActions, row._actions.length);
				return row;
			});
			this.maxActions = maxActions;

			if (gridData.length > 0)
				this.$emit('first', gridData[0]);
			this.gridData = gridData;
		},
		load() {
			var hasPagination = this.hasPagination;
			if (this.isLoading) {
				this.doMoreLoading = true;
				return;
			}
			this.isLoading = true;
			this.doMoreLoading = false;
			serviceFactory.apiService(this.apiName4GridLoader, IX.inherit(hasPagination ? {
				pageNo: Math.min(this.pageNo, Math.ceil(this.total / this.pageSize)),
				pageSize: this.pageSize
			} : {}, this.apiParams), (data) => {
				this.parseGridData(hasPagination ? data.list : data);
				if (hasPagination) {
					this.total = $XP(data, 'total', 0);
					this.pageNo = $XP(data, 'pageNo', 1);
				}
				this.isLoading = false;
				if (this.doMoreLoading) {
					// console.log('grid: do more loading:');
					this.load();
				}
			}); 
		},
		_refresh() {
			this.load();
		},
		_replace(row, newEntity) {
			var newRow = this.parseEntity(newEntity);
			row._item = newRow._item;
			row._actions = newRow._actions;
			IX.iterate(this.gridColumns, (col) => {
				row[col.name] = newRow[col.name];
			});
		},
		_remove(entityId) {
			if (this.isRemoving)
				return;
			this.isRemoving = true;
			serviceFactory.apiService(this.apiName4Remove, {
				id: entityId
			}, () => {
				this.isRemoving = false;
				this._refresh();
			});
		},
		_removeAll(entityIds) {
			if (this.isRemoving)
				return;
			this.isRemoving = true;
			serviceFactory.apiService(this.apiName4RemoveAll, {
				ids: entityIds
			}, () => {
				this.isRemoving = false;
				this._refresh();
			});
		},
		callDialog(dialog, props) {
			this.$modal.create({
				component: dialog,
				props: IX.inherit({ entityName: this.entityName }, props)
			});
		},
		addEntity() {
			var self = this;
			this.callDialog(ixFormDialog, {
				title: '增加新的' + this.entityLabel,
				okFn() { self._refresh(); }
			});
		},
		editEntity(row) { 
			var self = this;
			this.callDialog(ixFormDialog, {
				title: '修改' + this.entityLabel,
				entityId: row.id,
				okFn(newEntity) { self._replace(row, newEntity); }
			});
		},
		removeEntities(rows) {
			var names = [];
			var ids = IX.map(rows, (row) => {
				names.push(row.name);
				return row.id;
			});
			if (ids.length == 0)
				return this.callDialog(ixAlert, {
					msg: '请先选择要删除的' + this.entityLabel,
					okFn() {}
				});
			var self = this;
			this.callDialog(ixConfirm, {
				title: '删除选中的' + this.entityLabel,
				msg: '请确认是否删除选中的' + this.entityLabel + ':\n\t' + names.join('、'),
				okFn() { self._removeAll(ids); }
			});
		},
		removeEntity(row) {
			var self = this;
			this.callDialog(ixConfirm, {
				title: '删除' + this.entityLabel,
				msg: '请确认是否删除' + row.name,
				okFn() { self._remove(row.id); }
			});
		},
		btnClick(btnName) {
			var name = this.isManual ? 'manual' : btnName;
			switch (name) {
			case 'add': this.addEntity(); break;
			case 'removeAll': this.removeEntities(this.selections); break;
			default: this.$emit('btnClick', btnName, this.selections); break;
			}
		},
		cellClick(colName, row) {
			this.$emit('cellClick', colName, row);
		},
		actionClick(actName, row) {
			var name = this.isManual ? 'manual' : actName;
			switch (name) {
			case 'edit': this.editEntity(row); break;
			case 'remove': this.removeEntity(row); break;
			default: this.$emit('actionClick', actName, row); break;
			}
		},
		doSelect(val) {
			this.selections = val;
		},
		sizeChange(size) {
			if (size == this.pageSize)
				return;
			this.pageSize = size;
			this.load();
		},
		pageChange(no) {
			if (no == this.pageNo)
				return;
			this.pageNo = no;
			this.load();
		}
	},
	components: {
		ixGrid
	},
	mounted() {
		var model = nsEntity[this.entityName];
		if (!model) {
			console.error('Can\'t find Entity: ', this.entityName);
			return;
		}

		// this.model = model;
		this.entityParser = model.parse;
		this.entityLabel = model.label;
		this.apiName4GridLoader = model.apiNames.gridLoader;
		this.apiName4Remove = model.apiNames.remove;
		this.apiName4RemoveAll = model.apiNames.removeAll;
		this.gridButtons = model.getButtons(this.buttons);
		this.gridColumns = model.getColumns(this.columns);
		this.maxActions = model.numOfActions;

		var useCheckBox = false;
		IX.iterate(this.gridButtons, (btn) => {
			useCheckBox = useCheckBox || btn.usingCheckBox;
		});
		this.ifMultiSelection = useCheckBox;

		var actions = IX.isString(this.actions) ? this.actions.split(',') : null;
		this.validActionHT = actions ? IX.loop(actions, {}, (acc, key) => {
			acc[key] = true;
			return acc;
		}) : null;

		if (this.autoLoad)
			this.load();
	}
};
</script>
<style lang='less'>
.entity-grid {
	.el-button {float:left; margin-right: 10px;}
}
</style>