import ssfFactory from '@/components/ixSsf/factory';

import mainPageLayoutCmp from './pageLayouts/main';
import borderPanelLayoutCmp from './panelLayouts/border';
import noborderPanelLayoutCmp from './panelLayouts/noborder';
import stdPanelCmp from './panels/stdPanel';

ssfFactory.register('pageLayout', 'main', mainPageLayoutCmp);
ssfFactory.register('panelLayout', 'border', borderPanelLayoutCmp);
ssfFactory.register('panelLayout', 'noborder', noborderPanelLayoutCmp);
ssfFactory.register('panel', 'std', stdPanelCmp);

export default {
	getLayout: ssfFactory.getLayout,
	getTopbar: ssfFactory.getTopbar,
	getPanels: ssfFactory.getPanels
};