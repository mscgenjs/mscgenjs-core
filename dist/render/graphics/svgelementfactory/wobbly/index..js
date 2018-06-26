"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svgprimitives_1 = require("./svgprimitives");
const variationhelpers_1 = require("./variationhelpers");
const SEGMENT_LENGTH = 70; // 70
const WOBBLE_FACTOR = 3; // 1.4?
function points2CurveString(pCurveSections) {
    return pCurveSections.map((pCurveSection) => `${svgprimitives_1.default.pathPoint2String("S", pCurveSection.controlX, pCurveSection.controlY)} ` +
        `${svgprimitives_1.default.point2String(pCurveSection)}`).join(" ");
}
function line2CurveString(pLine) {
    return points2CurveString(variationhelpers_1.default.getBetweenPoints(pLine, SEGMENT_LENGTH, WOBBLE_FACTOR));
}
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
        svgprimitives_1.default.pathPoint2String("L", variationhelpers_1.default.round(pLine.xFrom + lDir.signX * Math.sqrt(1 / (1 + Math.pow(lDir.dy, 2)))), pLine.yFrom + lDir.signY * (Math.abs(lDir.dy) === Infinity
            ? 1
            : variationhelpers_1.default.round(Math.sqrt(Math.pow(lDir.dy, 2) / (1 + Math.pow(lDir.dy, 2)))))) +
        line2CurveString(pLine), pOptions);
}
function renderNotePathString(pBBox, pFoldSize) {
    return `${svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y) +
        // top line:
        line2CurveString({
            xFrom: pBBox.x,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pFoldSize,
            yTo: pBBox.y,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +
        // fold:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pFoldSize,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize) +
        // down:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pFoldSize,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height) +
        // bottom line:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
        // home:
        line2CurveString({
            xFrom: pBBox.x,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x, pBBox.y)}z`;
}
function renderNoteCornerString(pBBox, pFoldSize) {
    return svgprimitives_1.default.pathPoint2String("M", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +
        // down
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pFoldSize,
            yTo: pBBox.y + pFoldSize,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y + pFoldSize) +
        // right
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y + pFoldSize,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pFoldSize,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize);
}
function createNote(pBBox, pOptions) {
    const lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
    const lFoldSize = Math.max(9, Math.min(4.5 * lLineWidth, pBBox.height / 2));
    const lGroup = svgprimitives_1.default.createGroup();
    lGroup.appendChild(svgprimitives_1.default.createPath(renderNotePathString(pBBox, lFoldSize), pOptions));
    pOptions.bgColor = "transparent";
    lGroup.appendChild(svgprimitives_1.default.createPath(renderNoteCornerString(pBBox, lFoldSize), pOptions));
    return lGroup;
}
function renderRectString(pBBox) {
    if (!Boolean(pBBox.y)) {
        pBBox.y = 0;
    }
    return svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y) +
        line2CurveString({
            xFrom: pBBox.x,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y) +
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height) +
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
        line2CurveString({
            xFrom: pBBox.x,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y,
        }) +
        "z";
}
function createRect(pBBox, pOptions) {
    return svgprimitives_1.default.createPath(renderRectString(pBBox), pOptions);
}
function createABox(pBBox, pOptions) {
    const lSlopeOffset = 3;
    return svgprimitives_1.default.createPath(svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y + (pBBox.height / 2)) +
        line2CurveString({
            xFrom: pBBox.x,
            yFrom: pBBox.y + (pBBox.height / 2),
            xTo: pBBox.x + lSlopeOffset,
            yTo: pBBox.y,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + lSlopeOffset, pBBox.y) +
        // top line
        line2CurveString({
            xFrom: pBBox.x + lSlopeOffset,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - lSlopeOffset,
            yTo: pBBox.y,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - lSlopeOffset, pBBox.y) +
        // right wedge
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - lSlopeOffset,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height / 2,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height / 2) +
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height / 2,
            xTo: pBBox.x + pBBox.width - lSlopeOffset,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - lSlopeOffset, pBBox.y + pBBox.height) +
        // bottom line:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - lSlopeOffset,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x + lSlopeOffset,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + lSlopeOffset, pBBox.y + pBBox.height) +
        // home:
        line2CurveString({
            xFrom: pBBox.x + lSlopeOffset,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y + (pBBox.height / 2),
        }) +
        "z", pOptions);
}
function createRBox(pBBox, pOptions) {
    const RBOX_CORNER_RADIUS = 6; // px
    return svgprimitives_1.default.createPath(svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y + RBOX_CORNER_RADIUS) +
        points2CurveString([{
                controlX: pBBox.x,
                controlY: pBBox.y,
                x: pBBox.x + RBOX_CORNER_RADIUS,
                y: pBBox.y,
            }]) +
        // top
        line2CurveString({
            xFrom: pBBox.x + RBOX_CORNER_RADIUS,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - RBOX_CORNER_RADIUS,
            yTo: pBBox.y,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - RBOX_CORNER_RADIUS, pBBox.y) +
        points2CurveString([{
                controlX: pBBox.x + pBBox.width,
                controlY: pBBox.y,
                x: pBBox.x + pBBox.width,
                y: pBBox.y + RBOX_CORNER_RADIUS,
            }]) +
        // right
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + RBOX_CORNER_RADIUS,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height - RBOX_CORNER_RADIUS,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - RBOX_CORNER_RADIUS) +
        points2CurveString([{
                controlX: pBBox.x + pBBox.width,
                controlY: pBBox.y + pBBox.height,
                x: pBBox.x + pBBox.width - RBOX_CORNER_RADIUS,
                y: pBBox.y + pBBox.height,
            }]) +
        // bottom
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - RBOX_CORNER_RADIUS,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x + RBOX_CORNER_RADIUS,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + RBOX_CORNER_RADIUS, pBBox.y + pBBox.height) +
        points2CurveString([{
                controlX: pBBox.x,
                controlY: pBBox.y + pBBox.height,
                x: pBBox.x,
                y: pBBox.y + pBBox.height - RBOX_CORNER_RADIUS,
            }]) +
        // up
        line2CurveString({
            xFrom: pBBox.x,
            yFrom: pBBox.y + pBBox.height - RBOX_CORNER_RADIUS,
            xTo: pBBox.x,
            yTo: pBBox.y + RBOX_CORNER_RADIUS,
        }) +
        "z", pOptions);
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
    svgprimitives_1.default.pathPoint2String("M", pBBox.x + pBBox.width, pBBox.y) +
        // down:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height - lFoldSize,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - lFoldSize) +
        // fold:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height - lFoldSize,
            xTo: pBBox.x + pBBox.width - lFoldSize,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - lFoldSize, pBBox.y + pBBox.height) +
        // bottom line:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - lFoldSize,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x - 1,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x - 1, pBBox.y + pBBox.height), pOptions);
    lGroup.appendChild(lBackground);
    lGroup.appendChild(lLine);
    return lGroup;
}
function createDoubleLine(pLine, pOptions) {
    const lLineWidth = pOptions.lineWidth || 1;
    const lSpace = lLineWidth;
    const lClass = pOptions ? pOptions.class : "";
    const lDir = variationhelpers_1.default.getDirection(pLine);
    const lEndCorr = variationhelpers_1.default.determineEndCorrection(pLine, lClass, lLineWidth);
    const lStartCorr = variationhelpers_1.default.determineStartCorrection(pLine, lClass, lLineWidth);
    return svgprimitives_1.default.createPath(svgprimitives_1.default.pathPoint2String("M", pLine.xFrom, (pLine.yFrom - 7.5 * lLineWidth * lDir.dy)) +
        // left stubble:
        svgprimitives_1.default.pathPoint2String("l", lDir.signX, lDir.dy) +
        svgprimitives_1.default.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom - lSpace) +
        // upper line:
        line2CurveString({
            xFrom: pLine.xFrom + lStartCorr,
            yFrom: pLine.yFrom - lSpace,
            xTo: pLine.xTo + lEndCorr,
            yTo: pLine.yTo - lSpace,
        }) +
        svgprimitives_1.default.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom + lSpace) +
        // lower line
        line2CurveString({
            xFrom: pLine.xFrom + lStartCorr,
            yFrom: pLine.yFrom + lSpace,
            xTo: pLine.xTo + lEndCorr,
            yTo: pLine.yTo + lSpace,
        }) +
        svgprimitives_1.default.pathPoint2String("M", pLine.xTo - lDir.signX, pLine.yTo + 7.5 * lLineWidth * lDir.dy) +
        // right stubble
        svgprimitives_1.default.pathPoint2String("l", lDir.signX, lDir.dy), { class: lClass });
}
exports.default = {
    createSingleLine,
    createDoubleLine,
    createNote,
    createRect,
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
