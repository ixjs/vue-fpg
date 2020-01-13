IX.ns("IXW.Service");

localStorage['x-token'] = 'f0df7414507bcb57e07e18555821228a';

IXW.Service.entries = [
["loginService", function (name, params, cbFn, failFn){
	switch(name) {
	case "session":
		d3.json('static/sim/login.json', function(ret) {
			cbFn(ret.data);
		});
		break;
	}
}], ["dataService", function (name, params, cbFn, failFn){
	switch(name) {
	case "a":
		d3.json('static/sim/p1.json', function(ret) {
			cbFn(ret.data);
		});
		break;
	case "a-data":
		d3.json('static/sim/p1data.json', function(ret) {
			cbFn(ret.data);
		});
		break;
	case "b":
		d3.json('static/sim/p2.json', function(ret) {
			cbFn(ret.data);
		});
		break;
	case "b-data":
		d3.json('static/sim/p2data.json', function(ret) {
			cbFn(ret.data);
		});
		break;		
	}
}],
];
