<template>
	<editor :id='editorId' :value="content" @input="change" :init="init"></editor>
</template>

<script>
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/silver';
// import 'tinymce/plugins/image'; // 插入上传图片插件
// import 'tinymce/plugins/media'; // 插入视频插件
import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/wordcount'; // 字数统计插件

const EditorConfig = {
	language_url: 'static/tinymce/langs/zh_CN.js',// 语言包的路径
	language: 'zh_CN',//语言
	content_css: 'static/tinymce/skins/content/default/content.css',// 
	skin_url: 'static/tinymce/skins/ui/oxide',// skin路径
	height: 300,//编辑器高度
	branding: false,//是否禁用“Powered by TinyMCE”
	menubar: false,//顶部菜单栏显示

	plugins: 'lists table wordcount',// 'lists image media table wordcount',
	toolbar: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
};

export default {
	name: 'IXHtmlEditor',
	props: {
		content: { type: String, default: '' },
		height: { type: Number, default: 200 },
		disabled: { type: Boolean, default: false },
		placeholder: { type: String, default: '请输入内容' }
	},
	data() {
		return {
			editorId: IX.id(),
			init: IX.inherit(EditorConfig)
		};
	},
	methods: {
		change(content) { this.$emit('input', content); }
	},
	components: {
		Editor
	},
	mounted() {
		tinymce.init({
			mode: 'extra',
			elements: [this.editorId]
		});
		console.log('mounted: ', this.editorId);
	}
};
</script>

<style lang='less'>
.tox.tox-tinymce-aux { z-index: 4000;}
</style>

