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

# rm -rf cda
# cp -r $ROOTDIR/cdb cda
# node $BASEDIR/bin/qde.js cda
# exit 0

if [[ -d $ROOTDIR/$1 ]]
then
	echo "project $1 existed, command ignored!\n"
else
	echo "checking qde config file: $ROOTDIR/$1.js ..."
	if [ ! -f "$ROOTDIR/$1.js" ]
	then
		echo "NO qde config file: $ROOTDIR/$1.js \nPlease create such file."
		exit 0
	fi

	echo "Start to create for $1 \n vue init $ROOTDIR/base $1"
	vue init $ROOTDIR/framework/base $1	
	node $BASEDIR/bin/qde.js $1
fi

node $BASEDIR/bin/create-extra.js $1
