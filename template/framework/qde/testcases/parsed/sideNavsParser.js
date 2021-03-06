module.exports = { sideNavs: 
   [ { isReferTo: true,
       name: 'orgTree',
       target: 'Entity.name',
       type: 'tree',
       entity: 'Org',
       apiName: 'Entity.apiNames.selectLoader' },
     { isReferTo: true,
       name: 'cdtypeTree',
       target: 'Entity.name',
       type: 'tree',
       entity: 'CDType',
       apiName: 'Entity.apiNames.selectLoader' },
     { isReferTo: false,
       name: 'funcList',
       target: 'Func',
       type: 'list',
       dataItems: '[\n\t{ \'id\': 21, \'name\': \'基本功能\', \'nodeType\': \'Func\' },\n\t{ \'id\': 11, \'name\': \'数据管理类\', \'nodeType\': \'Category\', \'children\': [\n\t\t{ \'id\': 22, \'name\': \'客户数据类型\', \'nodeType\': \'Func\' },\n\t\t{ \'id\': 23, \'name\': \'客户数据项\', \'nodeType\': \'Func\' }\n\t] },\n\t{ \'id\': 22, \'name\': \'系统管理类\', \'nodeType\': \'Category\', \'children\': [\n\t\t{ \'id\': 24, \'name\': \'组织管理\', \'nodeType\': \'Func\' },\n\t\t{ \'id\': 25, \'name\': \'配置管理\', \'nodeType\': \'Func\' }\n\t] }\n]' } ],
  apiNames: [],
  entityAttrs: { Org: { enableSelect: true }, CDType: { enableSelect: true } } };