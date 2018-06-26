"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svgprimitives_1 = require("../svgprimitives");
const variationhelpers_1 = require("../variationhelpers");
function createDoubleLine(pLine, pOptions) {
    const lLineWidth = pOptions.lineWidth || 1;
    const lSpace = lLineWidth;
    const lClass = pOptions ? pOptions.class : "";
    const lDir = variationhelpers_1.default.getDirection(pLine);
    const lEndCorr = variationhelpers_1.default.determineEndCorrection(pLine, lClass, lLineWidth);
    const lStartCorr = variationhelpers_1.default.determineStartCorrection(pLine, lClass, lLineWidth);
    const lLenX = (pLine.xTo - pLine.xFrom + lEndCorr - lStartCorr).toString();
    const lLenY = (pLine.yTo - pLine.yFrom).toString();
    const lStubble = svgprimitives_1.default.pathPoint2String("l", lDir.signX, lDir.dy);
    const lLine = svgprimitives_1.default.pathPoint2String("l", lLenX, lLenY);
    return svgprimitives_1.default.createPath(svgprimitives_1.default.pathPoint2String("M", pLine.xFrom, (pLine.yFrom - 7.5 * lLineWidth * lDir.dy)) +
        // left stubble:
        lStubble +
        svgprimitives_1.default.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom - lSpace) +
        // upper line:
        lLine +
        svgprimitives_1.default.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom + lSpace) +
        // lower line
        lLine +
        svgprimitives_1.default.pathPoint2String("M", pLine.xTo - lDir.signX, pLine.yTo + 7.5 * lLineWidth * lDir.dy) +
        // right stubble
        lStubble, pOptions);
}
/**
 * Creates a note of pWidth x pHeight, with the top left corner
 * at coordinates (pX, pY). pFoldSize controls the size of the
 * fold in the top right corner.
 * @param {object} pBBox
 * @param {string} pClass - reference to the css class to be applied
 * @param {number=} [pFoldSize=9]
 *
 * @return {SVGElement}
 */
function createNote(pBBox, pOptions) {
    const lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
    const lFoldSizeN = Math.max(9, Math.min(4.5 * lLineWidth, pBBox.height / 2));
    const lFoldSize = lFoldSizeN.toString(10);
    return svgprimitives_1.default.createPath(svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y) +
        // top line:
        svgprimitives_1.default.pathPoint2String("l", pBBox.width - lFoldSizeN, 0) +
        // fold:
        // we lift the pen of the paper here to make sure the fold
        // gets the fill color as well when such is specified
        svgprimitives_1.default.pathPoint2String("l", 0, lFoldSize) +
        svgprimitives_1.default.pathPoint2String("l", lFoldSize, 0) +
        svgprimitives_1.default.pathPoint2String("m", -lFoldSize, -lFoldSize) +
        svgprimitives_1.default.pathPoint2String("l", lFoldSize, lFoldSize) +
        // down:
        svgprimitives_1.default.pathPoint2String("l", 0, pBBox.height - lFoldSizeN) +
        // bottom line:
        svgprimitives_1.default.pathPoint2String("l", -(pBBox.width), 0) +
        svgprimitives_1.default.pathPoint2String("l", 0, -(pBBox.height)) +
        "z", pOptions);
}
/**
 * Creates rect with 6px rounded corners of width x height, with the top
 * left corner at coordinates (x, y)
 *
 * @param {object} pBBox
 * @param {string} pClass - reference to the css class to be applied
 * @return {SVGElement}
 */
function createRBox(pBBox, pOptions) {
    const RBOX_CORNER_RADIUS = 6; // px
    const lOptions = Object.assign({
        rx: RBOX_CORNER_RADIUS,
        ry: RBOX_CORNER_RADIUS,
    }, pOptions);
    return svgprimitives_1.default.createRect(pBBox, lOptions);
}
/**
 * Creates an angled box of width x height, with the top left corner
 * at coordinates (x, y)
 *
 * @param {object} pBBox
 * @param {string} pClass - reference to the css class to be applied
 * @return {SVGElement}
 */
function createABox(pBBox, pOptions) {
    const lSlopeOffset = 3;
    return svgprimitives_1.default.createPath(svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y + (pBBox.height / 2)) +
        svgprimitives_1.default.pathPoint2String("l", lSlopeOffset, -(pBBox.height / 2)) +
        // top line
        svgprimitives_1.default.pathPoint2String("l", pBBox.width - 2 * lSlopeOffset, 0) +
        // right wedge
        svgprimitives_1.default.pathPoint2String("l", lSlopeOffset, pBBox.height / 2) +
        svgprimitives_1.default.pathPoint2String("l", -lSlopeOffset, pBBox.height / 2) +
        // bottom line:
        svgprimitives_1.default.pathPoint2String("l", -(pBBox.width - 2 * lSlopeOffset), 0) +
        "z", pOptions);
}
/**
 * Creates an edge remark (for use in inline expressions) of width x height,
 * with the top left corner at coordinates (x, y). pFoldSize controls the size of the
 * fold bottom right corner.
 * @param {object} pBBox
 * @param {string} pClass - reference to the css class to be applied
 * @param {number=} [pFoldSize=7]
 *
 * @return {SVGElement}
 */
function createEdgeRemark(pBBox, pOptions) {
    const lFoldSize = pOptions && pOptions.foldSize ? pOptions.foldSize : 7;
    const lOptions = Object.assign({
        class: null,
        color: null,
        bgColor: null,
    }, pOptions);
    return svgprimitives_1.default.createPath(
    // start:
    svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y) +
        // top line:
        svgprimitives_1.default.pathPoint2String("l", pBBox.width, 0) +
        // down:
        svgprimitives_1.default.pathPoint2String("l", 0, pBBox.height - lFoldSize) +
        // fold:
        svgprimitives_1.default.pathPoint2String("l", -lFoldSize, lFoldSize) +
        // bottom line:
        svgprimitives_1.default.pathPoint2String("l", -(pBBox.width - lFoldSize), 0), lOptions);
}
exports.default = {
    createSingleLine: svgprimitives_1.default.createSingleLine,
    createDoubleLine,
    createNote,
    createRect: svgprimitives_1.default.createRect,
    createABox,
    createRBox,
    createEdgeRemark,
    createDesc: svgprimitives_1.default.createDesc,
    createDefs: svgprimitives_1.default.createDefs,
    createDiagonalText: svgprimitives_1.default.createDiagonalText,
    createTSpan: svgprimitives_1.default.createTSpan,
    createText: svgprimitives_1.default.createText,
    createUTurn: svgprimitives_1.default.createUTurn,
    createGroup: svgprimitives_1.default.createGroup,
    createMarkerPath: svgprimitives_1.default.createMarkerPath,
    createMarkerPolygon: svgprimitives_1.default.createMarkerPolygon,
    createTitle: svgprimitives_1.default.createTitle,
    createSVG: svgprimitives_1.default.createSVG,
    updateSVG: svgprimitives_1.default.updateSVG,
    init: svgprimitives_1.default.init,
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
