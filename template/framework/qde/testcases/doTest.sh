#!/bin/sh

node index.js > /dev/null
echo 'Result diff:'
diff -U4 -r result ../tmp