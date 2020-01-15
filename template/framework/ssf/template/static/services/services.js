/** Comments for CommonJS file
	......
 */
/* Define for each service request;
	1. ["name", "url", "type", preDataHandler, errorhandler]
		// default ["name", "urlPattern", "GET"(POST,DELETE,PUT,JS), IX.selfFn, null]
	2. {name, url, type, preDataHandler:function(jsonObj), errorhandler: function(err)}

 */ 
var loginServices = [
	['session', '/session']
];

IX.ns("IXW.Service");
IXW.Service.entries = [
['dataService', [
	['a', '/api/a'],
	['a-data', '/api/a-data', 'post'],
	['b', '/api/b'],
	['b-data', '/api/b-data', 'post']
]],
// ["someService", [
//	['someApi', './example/{paramKeyName1}','post', function(data){
//		// the response JSON object will be handle before used by caller
//		data.id = data.userId;
//		return data;
//	}, function(err){ 
//		// will be applied in middle priority
//		console.err("entry err:", err);
//	}],
// ]],
// ["someService2", [{
// 	name : 'someApi2', 
// 	url : function(params){
// 		return './example/'+ params.id+ '/report',
// 	},
// 	type : 'post', 
// 	preDataHandler: function(data){
// 		// the response JSON object will be handle before used by caller
// 		data.id = data.userId;
// 		return data;
// 	}, 
// 	errorHandler : function(err){ 
// 		// will be applied in middle priority
// 		console.err("entry err:", err);
// 	}
// }]],
["loginService", loginServices]
];