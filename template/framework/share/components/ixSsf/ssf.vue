<template>
	<div class="ssf">
		<component :is='layout'>
			<component v-if='topbar' :is='topbar' 
					class="ssf-topbar"
					v-bind='data.topbar'/>
			<component v-for="panel in panels" :key='panel.name' class="ssf-panel"
					:is='panel.layout' 
					:style="panel.style"
					:title='panel.title'>
				<component :is='panel.component' class='ssf-panel-content'
						v-bind='data[panel.name]' />
				</component>
		</component>
	</div>
</template>

<script>

export default {
	name: 'superScreenFrontComponent',
	props: {
		layout: { type: Object, default: null },
		topbar: { type: Object, default: null },
		panels: { type: Array, default: [] },
		data: { type: Object, default: {} }
	}
};
</script>

<style lang='less'>
.ssf{
	background: black;
	position: fixed;
	left:0; top:0;width:1920px; height:1080px;

	.ssf-topbar, .ssf-panel { position: absolute; }
}
</style>