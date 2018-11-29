#!/usr/sh

BASEDIR=$(cd "$(dirname "$0")"; pwd)
ROOTDIR=$(cd $BASEDIR/..; pwd)

echo "Under '${ROOTDIR}', init environments ...\n\n"

cd $ROOTDIR

ln -sf framework/env/package.json
ln -sf framework/env/.eslintignore
ln -sf framework/env/.eslintrc.js
ln -sf framework/env/.editorconfig
ln -sf framework/env/.babelrc

echo "check base template ..."
if [[ -f $BASEDIR/base/template/src/components/nsSample.vue ]]
then
	node $BASEDIR/bin/init-extra.js

	echo "\tBase template done! It can be shared by each projects!"
else
	echo "\tBase template already works!"
fi

echo "check node-modules ..."
if [[ -d $ROOTDIR/node_modules ]]
then
	echo "\tnode-modules existed, ignore\n"
else
	echo "\tnode-modules unexisting, execute npm install\n"
	npm install > /dev/null
fi

echo "前端多项目组已经初始化完成. "
echo "您可以在 ${ROOTDIR} 下使用命令 'npm run create project-name' 创建独立前端项目."
echo "${ROOTDIR}/package.json 文件不要手动修改；如有必要，请修改${ROOTDIR}/framework/env/package.json"
