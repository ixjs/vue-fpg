IX.ns("IXW.Service");

localStorage['service-token'] = 'f0df7414507bcb57e07e18555821228a';

IXW.Service.entries = [
["loginService", function (name, params, cbFn, failFn){
	switch(name) {
	case "session":
		d3.json('static/sim/login.json', function(ret) {
			cbFn(ret.data);
		});
		break;
	}
}]
];
