/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./constants", "./svglowlevelfactory", "./geometry"], function(C, factll, math) {

    var SEGMENT_LENGTH = 70;
    var WOBBLE_FACTOR  = 1.4;

    // Begin Wobble utensils - can be cut out to a separate module if necessary
    function point2String(pX, pY) {
        return pX.toString() + "," + pY.toString() + " ";
    }

    function pathPoint2String(pType, pX, pY) {
        return pType + point2String(pX, pY);
    }

    function points2CurveString(pPoints) {
        return pPoints.reduce(function(pAllPoints, pThisPoint){
            return pAllPoints +
                pathPoint2String("S", pThisPoint.controlX, pThisPoint.controlY) +
                point2String(pThisPoint.x, pThisPoint.y);
        }, "");
    }

    // End Wobble utensils

    function createSingleLine(pLine, pOptions) {
        return factll.createElement(
            "path",
            {
                d:  pathPoint2String("M", pLine.xFrom, pLine.yFrom) +
                    points2CurveString(
                        math.getBetweenPoints(
                            pLine,
                            SEGMENT_LENGTH,
                            WOBBLE_FACTOR
                        )
                    ),
                class: pOptions.class
            }
        );
    }

    return {
        createSingleLine: createSingleLine
    };
});
/*
 This file is part of mscgen_js.

 mscgen_js is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 mscgen_js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
 */
