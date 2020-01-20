<template>
	<div id="app">
		<transition name="page-fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app'
};
</script>

<style lang='less'>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	background-color: #777;
}
</style>
