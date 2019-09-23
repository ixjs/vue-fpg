<template>
	<ix-form class="entity-form" labelWidth="160px" :form='form' :fields='fields' :btns='btns'
			@submit="doSubmit" @btnClick='btnClick' @change='change'/>
</template>

<script>
import ixForm from './base';

var serviceFactory = IXW.ns('serviceFactory');
var nsEntity = IXW.ns('Entity');

export default {
	name: 'IXEntityForm',
	props: {
		entityName: { type: String, default: null },
		entity: { type: [Number, String], default: null }, // entityId
		columns: { type: [String, Array], default: null },
		buttons: { type: Array, default: null }
	},
	data() {
		return {
			form: {},
			fields: [],
			btns: this.buttons || [{ name: 'submit', label: '确认' }]
		};
	},
	watch: {
		entity() { this.loadForm(); }
	},
	methods: {
		ifAddEntity() {
			return (!this.entity && (isNaN(this.entity) || this.entity === null));
		},
		loadForm() {
			// console.log("load: ", this.entity, this.form);
			if (this.ifAddEntity())
				return;
			serviceFactory.apiService(this.apiName4Get, {
				id: this.entity
			}, (item) => {
				this.originForm = item;
				this.form = IXW.dup(item);
			});
		},
		change(fieldName, value) {
			this.form[fieldName] = value;
		},
		btnClick(btnName, form) {
			this.$emit(btnName, form);
		},
		checkFormValid(form) {
			var reason = null;
			var isSame = IX.loopbreak(this.fields, true, (acc, field) => {
				var value = form[field.name];
				if (value == null || value == '') {
					reason = 'Form not valid, please input fully';
					throw new Error('Break');
				}
				return acc && value == this.originForm[field.name]; 
			});
			if (reason) {
				console.error(reason, form);
				return false;
			}
			if (isSame)
				console.error('Form not changed, no submitting.', form);
			return !isSame;
		},
		doSubmit(form) {
			if (!this.checkFormValid(form) || this.inSubmit)
				return;
			this.inSubmit = true;
			var toAdd = this.ifAddEntity();
			var params = IX.inherit(toAdd ? {} : { id: this.entity }, form);
			var apiName = toAdd ? this.apiName4Add : this.apiName4Edit;
			serviceFactory.apiService(apiName, params, (item) => {
				this.originForm = IX.inherit(params, {
					id: item.id
				});
				this.$emit('submitDone', IX.inherit(params, item));
				this.inSubmit = false;
			});
		}
	},
	components: {
		ixForm
	},
	mounted() {
		var model = nsEntity[this.entityName];
		if (!model) {
			console.error('Can\'t find Entity: ', this.entityName);
			return;
		}
		this.fields = model.getColumns(this.columns);
		this.form = IX.loop(this.fields, {}, (acc, field) => {
			acc[field.name] = null;
			return acc;
		});
		this.apiName4Get = model.apiNames.get;
		this.apiName4Add = model.apiNames.add;
		this.apiName4Edit = model.apiNames.edit;

		this.loadForm();
	}
};
</script>
<style lang='less'>
.entity-form {
	.el-button {float:left; margin-right: 10px;}
}
</style>