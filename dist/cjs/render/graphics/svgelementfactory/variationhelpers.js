"use strict";
exports.__esModule = true;
exports.getDirection = exports.determineEndCorrection = exports.determineStartCorrection = void 0;
function determineStartCorrection(pLine, pClass, pLineWidth) {
    var lRetval = 0;
    if (!pClass.includes("nodi") && pClass.includes("bidi")) {
        if (pLine.xTo > pLine.xFrom) {
            lRetval = 7.5 * pLineWidth;
        }
        else {
            lRetval = -7.5 * pLineWidth;
        }
    }
    return lRetval;
}
exports.determineStartCorrection = determineStartCorrection;
function determineEndCorrection(pLine, pClass, pLineWidth) {
    var lRetval = 0;
    if (!pClass.includes("nodi")) {
        lRetval = pLine.xTo > pLine.xFrom ? -7.5 * pLineWidth : 7.5 * pLineWidth;
    }
    return lRetval;
}
exports.determineEndCorrection = determineEndCorrection;
/**
 * returns the angle (in radials) of the line
 *
 * @param {object} pLine - (xFrom,yFrom, xTo, YTo quadruple)
 * @return {object} the angle of the line in an object:
 *                      signX: the x direction (1 or -1)
 *                      signY: the y direction (1 or -1)
 *                      dy: the angle (in radials)
 */
function getDirection(pLine) {
    var lSignX = pLine.xTo > pLine.xFrom ? 1 : -1;
    return {
        signX: lSignX,
        signY: pLine.yTo > pLine.yFrom ? 1 : -1,
        dy: lSignX * (pLine.yTo - pLine.yFrom) / (pLine.xTo - pLine.xFrom)
    };
}
exports.getDirection = getDirection;
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
