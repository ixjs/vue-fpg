<template>
	<ix-layout :lsideCmp='lsideCmp' @select='select'>
		<template slot='breadcrumb'>配置项管理 : <i>{{ selectedItem && selectedItem.name }}</i></template>
		<sp-sys-setting-form :selectedItem='selectedItem'/>
	</ix-layout>
</template>

<script>
import ixLayout from 'src/layout/default';
import lsideCmp from 'components/sideNav/funcList';
import spSysSettingForm from 'biz-components/spSysSettingForm';

export default {
	name: 'SysSettingPage',
	data() {
		return {
			selectedItem: null,
			lsideCmp: lsideCmp
		};
	},
	methods: {
		select(item) { this.selectedItem = item; }
	},
	components: {
		ixLayout,
		spSysSettingForm
	}
};
</script>

<style lang='less'>
.page-sys-setting {
	
}
</style>