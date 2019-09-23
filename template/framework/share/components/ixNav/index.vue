<template>
	<nav>
		<nav-base mode="horizontal" :activeIndex="activeIndex" :items="items"
				@select="selectNavItem" />
	</nav>	
</template>

<script>
import navMixin from './mixin';
import navBase from './base';

export default {
	name: 'IXNav',
	mixins: [navMixin],
	components: {
		navBase
	}
};
</script>
