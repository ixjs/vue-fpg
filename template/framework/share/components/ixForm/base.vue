<template>
	<el-form ref="form" :model="form" :inline='isInlineForm' :label-width="labelWidth">
		<el-form-item v-for="field in formFields" class="field"
				:class="field.type == 'text' ? 'text-field' : ''"
				:key="field.name" :label="field.label + '：'" :prop="field.name">
			<component :is="field.component" :field="field" :form="form" 
					@change="change"></component>
		</el-form-item>
		<el-form-item v-if="btns && btns.length > 0" class="btns">
			<el-button v-for="btn in btns" :key="btn.name"
					:type="btn.name != 'cancel' ? 'primary' : 'cancel'" 
					@click="btnClick(btn)">{{btn.label}}</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
import formFactory from './formFactory';

export default {
	name: 'IXForm',
	props: {
		isInlineForm: { type: Boolean, default: false },
		autoSubmit: { type: Boolean, default: false },
		labelWidth: { type: String, default: '100px' },
		form: { type: Object },
		fields: { type: Array },
		btns: { type: Array, default: () => { 
			return [
				{ name: 'submit', label: '确认' },
				{ name: 'cancel', label: '取消' }
			];
		} }
	},
	computed: {
		formFields() {
			return IX.map(this.fields, (item) => {
				return IX.inherit(item, { component: formFactory.get(item.type) });
			});
		}
	},
	methods: {
		change(fieldName, value) {
			// console.log('chage:' , fieldName, value);
			this.form[fieldName] = value;
			if (this.autoSubmit)
				this.$emit('submit', IXW.dup(this.form));
			else
				this.$emit('change', fieldName, value);
		},
		btnClick(btn) {
			if (btn.name == 'submit')
				this.$emit(btn.name, IXW.dup(this.form)); 
			else
				this.$emit('btnClick', btn.name, IXW.dup(this.form));
		}
	},
	mounted() {
		if (this.autoSubmit) {
			// console.log('Do autoSubmit');
			setTimeout(() => {
				this.$emit('submit', IXW.dup(this.form));
			}, 10);
		}
	}
};
</script>
<style lang='less'>
.el-form {
	.el-form-item__content {text-align:left;}
	.btns { text-align:left;}
}
.compact-form {
	&.el-form {text-align:left;}
	.el-form-item.field {display:inline-block;}
	.el-form-item.text-field {display: block;}
}
</style>