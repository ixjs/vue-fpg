import Vue from 'vue';

import '@/engine';
import pageSession from '@/session/enhance';

import App from './App';
import './dataStore';
import pageRouters from './router';
import defPrivData from './session/privs';

var nsPrj = IXW.ns();
var nsRoute = nsPrj.Route;
var sessionFactory = nsPrj.SessionFactory;

nsPrj.misc.init(Vue);
nsPrj.$ele.init(Vue);
nsPrj.serviceFactory.init(Vue, IXW.Service.entries);

sessionFactory.resetPrivData(defPrivData.DefaultPrivs, defPrivData.ParentPrivs);
sessionFactory.register(pageSession.FrontendSession);
nsRoute.init(Vue, pageRouters);

/* eslint-disable no-new */
sessionFactory.loadSession(() => {
	// console.log("loadsession");
	new Vue({
		router: nsRoute.getInstance(),
		render: (h) => { return h(App); }
	}).$mount('#app');
});