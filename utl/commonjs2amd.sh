#!/bin/sh
echo "/* istanbul ignore else */"
echo "if (typeof define !== 'function') {"
echo "    var define = require('amdefine')(module);"
echo "}"
echo ""
sed s/module\.exports\ =\ \(/define\ \([],\ /g | sed s/\}\)\(\)\;/\}\)\;/g
