"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svgprimitives_1 = require("../svgprimitives");
const variationhelpers_1 = require("../variationhelpers");
const SEGMENT_LENGTH = 70; // 70
const WOBBLE_FACTOR = 3; // 1.4?
function points2CurveString(pCurveSections) {
    return pCurveSections.map((pCurveSection) => `${svgprimitives_1.default.pathPoint2String("S", pCurveSection.controlX, pCurveSection.controlY)} ` +
        `${svgprimitives_1.default.point2String(pCurveSection)}`).join(" ");
}
exports.points2CurveString = points2CurveString;
function line2CurveString(pLine) {
    return points2CurveString(variationhelpers_1.default.getBetweenPoints(pLine, SEGMENT_LENGTH, WOBBLE_FACTOR));
}
exports.line2CurveString = line2CurveString;
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
exports.renderNotePathString = renderNotePathString;
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
exports.renderNoteCornerString = renderNoteCornerString;
function rect2CurveString(pBBox) {
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
exports.rect2CurveString = rect2CurveString;
function abox2CurveString(pBBox, pSlopeOffset) {
    return svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y + (pBBox.height / 2)) +
        line2CurveString({
            xFrom: pBBox.x,
            yFrom: pBBox.y + (pBBox.height / 2),
            xTo: pBBox.x + pSlopeOffset,
            yTo: pBBox.y,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pSlopeOffset, pBBox.y) +
        // top line
        line2CurveString({
            xFrom: pBBox.x + pSlopeOffset,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pSlopeOffset,
            yTo: pBBox.y,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - pSlopeOffset, pBBox.y) +
        // right wedge
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pSlopeOffset,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height / 2,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height / 2) +
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height / 2,
            xTo: pBBox.x + pBBox.width - pSlopeOffset,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - pSlopeOffset, pBBox.y + pBBox.height) +
        // bottom line:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pSlopeOffset,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x + pSlopeOffset,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pSlopeOffset, pBBox.y + pBBox.height) +
        // home:
        line2CurveString({
            xFrom: pBBox.x + pSlopeOffset,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y + (pBBox.height / 2),
        }) +
        "z";
}
exports.abox2CurveString = abox2CurveString;
function rbox2CurveString(pBBox) {
    const RBOX_CORNER_RADIUS = 6; // px
    return svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y + RBOX_CORNER_RADIUS) +
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
        "z";
}
exports.rbox2CurveString = rbox2CurveString;
function doubleLine2CurveString(pLine, pOptions) {
    const lLineWidth = pOptions.lineWidth || 1;
    const lSpace = lLineWidth;
    const lClass = pOptions ? pOptions.class : "";
    const lDir = variationhelpers_1.default.getDirection(pLine);
    const lEndCorr = variationhelpers_1.default.determineEndCorrection(pLine, lClass, lLineWidth);
    const lStartCorr = variationhelpers_1.default.determineStartCorrection(pLine, lClass, lLineWidth);
    return svgprimitives_1.default.pathPoint2String("M", pLine.xFrom, (pLine.yFrom - 7.5 * lLineWidth * lDir.dy)) +
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
        svgprimitives_1.default.pathPoint2String("l", lDir.signX, lDir.dy);
}
exports.doubleLine2CurveString = doubleLine2CurveString;
function edgeRemark2CurveString(pBBox, pFoldSize) {
    return svgprimitives_1.default.pathPoint2String("M", pBBox.x + pBBox.width, pBBox.y) +
        // down:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height - pFoldSize,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - pFoldSize) +
        // fold:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height - pFoldSize,
            xTo: pBBox.x + pBBox.width - pFoldSize,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y + pBBox.height) +
        // bottom line:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x - 1,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x - 1, pBBox.y + pBBox.height);
}
exports.edgeRemark2CurveString = edgeRemark2CurveString;
