import Vue from 'vue';

import '@/engine';
import pageSession from '@/session/enhance';

import App from './App';
import pageRouters from './router';

var nsPrj = IXW.ns();
var nsRoute = nsPrj.Route;
var sessionFactory = nsPrj.SessionFactory;

nsPrj.misc.init(Vue);
nsPrj.$ele.init(Vue);
nsPrj.serviceFactory.init(Vue, IXW.Service.entries);

sessionFactory.register(pageSession.BackendSession);
nsRoute.init(Vue, pageRouters);

/* eslint-disable no-new */
sessionFactory.loadSession(() => {
	// console.log("loadsession");
	new Vue({
		router: nsRoute.getInstance(),
		render: (h) => { return h(App); }
	}).$mount('#app');
});