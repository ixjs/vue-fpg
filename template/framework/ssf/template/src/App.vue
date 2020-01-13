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
@import './less/ixwpre.less';

#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	background-color: #777;
}
.nav-item {background:green;color:white;margin:0 10px;}

.links {
	a { color:green;}
	span {width: 18px; height: 17px;}
	.pic-r {.x-pic-btn-fold;}
	a:hover .pic-r {.x-pic-btn-fold-hover; }
	.pic-l {.x-pic-btn-unfold;}
	a:hover .pic-l {.x-pic-btn-unfold-hover; }
}	
</style>
