#!/usr/sh -x

BASEDIR=$(cd "$(dirname "$0")"; pwd)
ROOTDIR=$(cd $BASEDIR/..; pwd)

if [[ -z $1 ]]
then 
	echo "Please assign project name in arguments, ps: npm run create prj"
	exit 0
fi

echo "Under '${ROOTDIR}', try create new project $1...\n\n";
cd $ROOTDIR

if [[ -d $ROOTDIR/$1 ]]
then
	echo "project $1 existed, command ignored!\n"
else

	echo "Start to create for $1 \n vue init $ROOTDIR/base $1"
	vue init $ROOTDIR/framework/base $1
	node $BASEDIR/bin/ssf.js $1
fi

node $BASEDIR/bin/create-extra.js $1
