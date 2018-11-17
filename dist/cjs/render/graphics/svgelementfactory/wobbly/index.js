"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var curvestringfactory_1 = require("./curvestringfactory");
var helpers_1 = require("./helpers");
var round_1 = __importDefault(require("../round"));
var svgprimitives = __importStar(require("../svgprimitives"));
var variationhelpers = __importStar(require("../variationhelpers"));
function createSingleLine(pLine, pOptions) {
    if (pOptions === void 0) { pOptions = {}; }
    var lDir = variationhelpers.getDirection(pLine);
    return svgprimitives.createPath(svgprimitives.pathPoint2String("M", pLine.xFrom, pLine.yFrom) +
        // Workaround; gecko and webkit treat markers slapped on the
        // start of a path with 'auto' different from each other when
        // there's not a line at the start and the path is not going
        // from exactly left to right (gecko renders the marker
        // correctly, whereas webkit will ignore auto and show the
        // marker in its default position)
        //
        // Adding a little stubble at the start of the line solves
        // all that.
        svgprimitives.pathPoint2String("L", round_1["default"](pLine.xFrom + lDir.signX * Math.sqrt(1 / (1 + Math.pow(lDir.dy, 2))), 2), pLine.yFrom + lDir.signY * (Math.abs(lDir.dy) === Infinity
            ? 1
            : round_1["default"](Math.sqrt(Math.pow(lDir.dy, 2) / (1 + Math.pow(lDir.dy, 2))), 2))) +
        helpers_1.line2CurveString(pLine), pOptions);
}
exports.createSingleLine = createSingleLine;
function createNote(pBBox, pOptions) {
    var lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
    var lFoldSize = Math.max(9, Math.min(4.5 * lLineWidth, pBBox.height / 2));
    var lGroup = svgprimitives.createGroup();
    lGroup.appendChild(svgprimitives.createPath(curvestringfactory_1.renderNotePathString(pBBox, lFoldSize), pOptions));
    pOptions.bgColor = "transparent";
    lGroup.appendChild(svgprimitives.createPath(curvestringfactory_1.renderNoteCornerString(pBBox, lFoldSize), pOptions));
    return lGroup;
}
exports.createNote = createNote;
function createRect(pBBox, pOptions) {
    return svgprimitives.createPath(curvestringfactory_1.rbox2CurveString(pBBox, 0), pOptions);
}
exports.createRect = createRect;
function createABox(pBBox, pOptions) {
    var lSlopeOffset = 3;
    return svgprimitives.createPath(curvestringfactory_1.abox2CurveString(pBBox, lSlopeOffset), pOptions);
}
exports.createABox = createABox;
function createRBox(pBBox, pOptions) {
    return svgprimitives.createPath(curvestringfactory_1.rbox2CurveString(pBBox, 6), pOptions);
}
exports.createRBox = createRBox;
function createEdgeRemark(pBBox, pOptions) {
    var lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
    var lGroup = svgprimitives.createGroup();
    var lFoldSize = pOptions && pOptions.foldSize ? pOptions.foldSize : 7;
    var lLineColor = pOptions && pOptions.color ? pOptions.color : "black";
    pOptions.color = "transparent!important"; /* :blush: */
    var lBackground = svgprimitives.createPath(svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + (lLineWidth / 2)) +
        // top line:
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + (lLineWidth / 2)) +
        // down:
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - lFoldSize) +
        // fold:
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - lFoldSize, pBBox.y + pBBox.height) +
        // bottom line:
        svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
        "z", pOptions);
    pOptions.bgColor = "transparent";
    pOptions.color = lLineColor;
    var lLine = svgprimitives.createPath(
    // start:
    curvestringfactory_1.edgeRemark2CurveString(pBBox, lFoldSize), pOptions);
    lGroup.appendChild(lBackground);
    lGroup.appendChild(lLine);
    return lGroup;
}
exports.createEdgeRemark = createEdgeRemark;
function createDoubleLine(pLine, pOptions) {
    return svgprimitives.createPath(curvestringfactory_1.doubleLine2CurveString(pLine, pOptions), { "class": pOptions["class"] });
}
exports.createDoubleLine = createDoubleLine;
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
