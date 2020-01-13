<template>
	<ix-ssf :class='"ssf-" + pageName' 
			:layout='layout' :topbar='topbar' :panels='panels' 
			:data='data'/>
</template>

<script>
import ixSsf from '@/components/ixSsf/ssf';
import ssfFactory from 'src/ssf';

var serviceFactory = IXW.ns('serviceFactory');

export default {
	name: 'superScreenFrontPage',
	data() {
		return {
			pageName: 'a',
			layout: null,
			topbar: null,
			panels: [],
			data: {}
		};
	},
	watch: {
		'$route'(to) {
			if (to.params.id !== this.pageName)
				this.loadPage();
		}
	},
	methods: {
		loadPanelData(acc, panelName, data) {
			if (panelName in data)
				acc[panelName] = IX.inherit(data[panelName], { name: panelName });
			return acc;
		},
		loadData() {
			serviceFactory.dataService(this.pageName + '-data', {}, (data) => {
				this.data = IX.loop(this.panels, {}, (acc, panel) => {
					return this.loadPanelData(acc, panel.name, data);
				});
				if (this.topbar && 'topbar' in data)
					this.data.topbar = IX.inherit({
						title: this.topbarTitle
					}, data.topbar);
			});
		},
		resetData() {
			if (this.loopIntv)
				clearInterval(this.loopIntv);
			this.loopIntv = setInterval(() => { this.loadData(); }, 20000);
			this.loadData();
		},
		loadPage() {
			this.pageName = this.$route.params.id || 'a';
			serviceFactory.dataService(this.pageName, {}, (data) => {
				this.layout = ssfFactory.getLayout($XP(data, 'layout', 'default'));
				var topbar = $XP(data, 'topbar', null);
				this.topbar = null;
				this.topbarTitle = '';
				if (topbar) {
					this.topbar = ssfFactory.getTopbar($XP(topbar, 'type', 'default'));
					this.topbarTitle = $XP(topbar, 'title', 'TESTING SYSTEM');
				}
				this.panels = ssfFactory.getPanels($XP(data, 'panels', []));
				this.resetData();
			});
		}
	},
	components: {
		ixSsf
	},
	mounted() {
		this.loadPage();
	},
	beforeDestroy() {
		if (this.loopIntv)
			clearInterval(this.loopIntv);
	}
};
</script>