export default {
	DefaultPrivs: {<% for (var i=0; i< privs.length; i++) {%>
		'<%- privs[i].fullname %>': { id: <%- privs[i].id 
			%>, parentId: <%- privs[i].pId 
			%>, title: '<%- privs[i].title 
			%>', name: '<%- privs[i].name 
			%>', type: '<%- privs[i].type 
			%>', idx: <%- privs[i].idx %> }<% if (i < privs.length-1) {%>,<%} }%>
	},
	ParentPrivs: {<% for (var j=0; j< treePrivs.length; j++) {%>
		'<%- treePrivs[j].name %>': '<%- treePrivs[j].pname %>'<% if(j<treePrivs.length-1){%>,<%} }%>
	}
};
