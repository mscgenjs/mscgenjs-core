/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(
    ["./constants",
    "./svglowlevelfactory",
    "./geometry",
    "../../lib/lodash/lodash.custom"], function(C, factll, math, _) {

    var SEGMENT_LENGTH = 70;
    var WOBBLE_FACTOR  = 1.4;

    // Begin Wobble utensils - can be moved to a separate module if necessary
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

    /**
     * Creates an svg path element given the path pD, with pClass applied
     * (if provided)
     * @param {string} pD - the path
     * @param {options} pOptions - options:
     *                           class: the class name to use when rendering
     *                           color: color
     *                           bgColor: background color
     * @return {SVGElement}
     */
    function _createPath(pD, pOptions) {
        var lOptions = _.defaults(
            pOptions,
            {
                class: null,
                color: null,
                bgColor: null
            }
        );
        return colorBox(
            factll.createElement(
                "path",
                {
                    d: pD,
                    class: lOptions.class
                }
            ),
            lOptions.color,
            lOptions.bgColor
        );
    }

    function colorBox(pElement, pColor, pBgColor){
        var lStyleString = "";
        if (pBgColor) {
            lStyleString += "fill:" + pBgColor + ";";
        }
        if (pColor) {
            lStyleString += "stroke:" + pColor + ";";
        }
        return factll.setAttribute(pElement, "style", lStyleString);
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

    function renderPathString(pBBox, pFoldSize) {
        return pathPoint2String("M", pBBox.x, pBBox.y) +
            // top line:
            points2CurveString(
                math.getBetweenPoints({
                    xFrom: pBBox.x,
                    yFrom: pBBox.y,
                    xTo: pBBox.x + pBBox.width - pFoldSize,
                    yTo: pBBox.y
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +

            // fold:
            points2CurveString(
                math.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width - pFoldSize,
                    yFrom: pBBox.y,
                    xTo: pBBox.x + pBBox.width,
                    yTo: pBBox.y + pFoldSize
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize) +

            // down:
            points2CurveString(
                math.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width,
                    yFrom: pBBox.y + pFoldSize,
                    xTo: pBBox.x + pBBox.width,
                    yTo: pBBox.y + pBBox.height
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height) +

            // bottom line:
            points2CurveString(
                math.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width,
                    yFrom: pBBox.y + pBBox.height,
                    xTo: pBBox.x,
                    yTo: pBBox.y + pBBox.height
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +

            // home:
            points2CurveString(
                math.getBetweenPoints({
                    xFrom: pBBox.x,
                    yFrom: pBBox.y + pBBox.height,
                    xTo: pBBox.x,
                    yTo: pBBox.y
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            pathPoint2String("L", pBBox.x, pBBox.y) +
            "z";
    }

    function renderCornerString(pBBox, pFoldSize) {
        return pathPoint2String("M", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +
            // down
            points2CurveString(
                math.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width - pFoldSize,
                    yFrom: pBBox.y,
                    xTo: pBBox.x + pBBox.width - pFoldSize,
                    yTo: pBBox.y + pFoldSize
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y + pFoldSize) +
            // right
            points2CurveString(
                math.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width - pFoldSize,
                    yFrom: pBBox.y + pFoldSize,
                    xTo: pBBox.x + pBBox.width,
                    yTo: pBBox.y + pFoldSize
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize);
    }

    function createNote(pBBox, pOptions) {
        var lFoldSize = Math.max(9, Math.min(4.5 * C.LINE_WIDTH, pBBox.height / 2));
        var lGroup = factll.createElement("g");

        lGroup.appendChild(_createPath(renderPathString(pBBox, lFoldSize), pOptions));
        pOptions.bgColor = "transparent";
        lGroup.appendChild(_createPath(renderCornerString(pBBox, lFoldSize), pOptions));
        return lGroup;
    }

    function renderRectString(pBBox) {
        if (!Boolean(pBBox.y)){
            pBBox.y = 0;
        }
        return pathPoint2String("M", pBBox.x, pBBox.y) +
        points2CurveString(
            math.getBetweenPoints({
                xFrom: pBBox.x,
                yFrom: pBBox.y,
                xTo: pBBox.x + pBBox.width,
                yTo: pBBox.y
            }, SEGMENT_LENGTH, WOBBLE_FACTOR)
        ) +
        pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y) +
        points2CurveString(
            math.getBetweenPoints({
                xFrom: pBBox.x + pBBox.width,
                yFrom: pBBox.y,
                xTo: pBBox.x + pBBox.width,
                yTo: pBBox.y + pBBox.height
            }, SEGMENT_LENGTH, WOBBLE_FACTOR)
        ) +
        pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height) +
        points2CurveString(
            math.getBetweenPoints({
                xFrom: pBBox.x + pBBox.width,
                yFrom: pBBox.y + pBBox.height,
                xTo: pBBox.x,
                yTo: pBBox.y + pBBox.height
            }, SEGMENT_LENGTH, WOBBLE_FACTOR)
        ) +
        pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
        points2CurveString(
            math.getBetweenPoints({
                xFrom: pBBox.x,
                yFrom: pBBox.y + pBBox.height,
                xTo: pBBox.x,
                yTo: pBBox.y
            }, SEGMENT_LENGTH, WOBBLE_FACTOR)
        ) +
        "z";
    }

    function createRect(pBBox, pOptions) {
        return _createPath(
            renderRectString(pBBox, pOptions),
            pOptions
        );
    }

    return {
        createSingleLine: createSingleLine,
        createNote: createNote,
        createRect: createRect
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
