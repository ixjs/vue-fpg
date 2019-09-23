<template>
	<nav-base :activeIndex="activeIndex" :items="items" @select="selectNavItem" />
</template>

<script>
import navMixin from './mixin';
import navBase from './base';

export default {
	name: 'IXNavTree',
	mixins: [navMixin],
	components: {
		navBase
	}
};
</script>
