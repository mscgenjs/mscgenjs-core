"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const curvestringfactory_1 = require("./curvestringfactory");
const round_1 = __importDefault(require("../round"));
const svgprimitives_1 = __importDefault(require("../svgprimitives"));
const variationhelpers_1 = __importDefault(require("../variationhelpers"));
function createSingleLine(pLine, pOptions = {}) {
    const lDir = variationhelpers_1.default.getDirection(pLine);
    return svgprimitives_1.default.createPath(svgprimitives_1.default.pathPoint2String("M", pLine.xFrom, pLine.yFrom) +
        // Workaround; gecko and webkit treat markers slapped on the
        // start of a path with 'auto' different from each other when
        // there's not a line at the start and the path is not going
        // from exactly left to right (gecko renders the marker
        // correctly, whereas webkit will ignore auto and show the
        // marker in its default position)
        //
        // Adding a little stubble at the start of the line solves
        // all that.
        svgprimitives_1.default.pathPoint2String("L", round_1.default(pLine.xFrom + lDir.signX * Math.sqrt(1 / (1 + Math.pow(lDir.dy, 2))), 2), pLine.yFrom + lDir.signY * (Math.abs(lDir.dy) === Infinity
            ? 1
            : round_1.default(Math.sqrt(Math.pow(lDir.dy, 2) / (1 + Math.pow(lDir.dy, 2))), 2))) +
        curvestringfactory_1.line2CurveString(pLine), pOptions);
}
function createNote(pBBox, pOptions) {
    const lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
    const lFoldSize = Math.max(9, Math.min(4.5 * lLineWidth, pBBox.height / 2));
    const lGroup = svgprimitives_1.default.createGroup();
    lGroup.appendChild(svgprimitives_1.default.createPath(curvestringfactory_1.renderNotePathString(pBBox, lFoldSize), pOptions));
    pOptions.bgColor = "transparent";
    lGroup.appendChild(svgprimitives_1.default.createPath(curvestringfactory_1.renderNoteCornerString(pBBox, lFoldSize), pOptions));
    return lGroup;
}
function createRect(pBBox, pOptions) {
    return svgprimitives_1.default.createPath(curvestringfactory_1.rbox2CurveString(pBBox, 0), pOptions);
}
function createABox(pBBox, pOptions) {
    const lSlopeOffset = 3;
    return svgprimitives_1.default.createPath(curvestringfactory_1.abox2CurveString(pBBox, lSlopeOffset), pOptions);
}
function createRBox(pBBox, pOptions) {
    return svgprimitives_1.default.createPath(curvestringfactory_1.rbox2CurveString(pBBox, 6), pOptions);
}
function createEdgeRemark(pBBox, pOptions) {
    const lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
    const lGroup = svgprimitives_1.default.createGroup();
    const lFoldSize = pOptions && pOptions.foldSize ? pOptions.foldSize : 7;
    const lLineColor = pOptions && pOptions.color ? pOptions.color : "black";
    pOptions.color = "transparent!important"; /* :blush: */
    const lBackground = svgprimitives_1.default.createPath(svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y + (lLineWidth / 2)) +
        // top line:
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + (lLineWidth / 2)) +
        // down:
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - lFoldSize) +
        // fold:
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - lFoldSize, pBBox.y + pBBox.height) +
        // bottom line:
        svgprimitives_1.default.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
        "z", pOptions);
    pOptions.bgColor = "transparent";
    pOptions.color = lLineColor;
    const lLine = svgprimitives_1.default.createPath(
    // start:
    curvestringfactory_1.edgeRemark2CurveString(pBBox, lFoldSize), pOptions);
    lGroup.appendChild(lBackground);
    lGroup.appendChild(lLine);
    return lGroup;
}
function createDoubleLine(pLine, pOptions) {
    return svgprimitives_1.default.createPath(curvestringfactory_1.doubleLine2CurveString(pLine, pOptions), { class: pOptions.class });
}
exports.default = {
    createSingleLine,
    createDoubleLine,
    createNote,
    createRect,
    createABox,
    createRBox,
    createEdgeRemark,
};
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
