"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svgprimitives_1 = __importDefault(require("../svgprimitives"));
const variationhelpers_1 = __importDefault(require("../variationhelpers"));
const SEGMENT_LENGTH = 70; // 70
const WOBBLE_FACTOR = 3; // 1.4?
function points2CurveString(pCurveSections) {
    return pCurveSections.map((pCurveSection) => `${svgprimitives_1.default.pathPoint2String("S", pCurveSection.controlX, pCurveSection.controlY)} ` +
        `${svgprimitives_1.default.point2String(pCurveSection)}`).join(" ");
}
function line2CurveString(pLine) {
    return points2CurveString(variationhelpers_1.default.getBetweenPoints(pLine, SEGMENT_LENGTH, WOBBLE_FACTOR));
}
exports.line2CurveString = line2CurveString;
function renderNotePathString(pBBox, pFoldSize) {
    return svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y) +
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
        svgprimitives_1.default.pathPoint2String("L", pBBox.x, pBBox.y) +
        "z";
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
function rbox2CurveString(pBBox, pRBoxCornerRadius) {
    return svgprimitives_1.default.pathPoint2String("M", pBBox.x, pBBox.y + pRBoxCornerRadius) +
        points2CurveString([{
                controlX: pBBox.x,
                controlY: pBBox.y,
                x: pBBox.x + pRBoxCornerRadius,
                y: pBBox.y,
            }]) +
        // top
        line2CurveString({
            xFrom: pBBox.x + pRBoxCornerRadius,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pRBoxCornerRadius,
            yTo: pBBox.y,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width - pRBoxCornerRadius, pBBox.y) +
        points2CurveString([{
                controlX: pBBox.x + pBBox.width,
                controlY: pBBox.y,
                x: pBBox.x + pBBox.width,
                y: pBBox.y + pRBoxCornerRadius,
            }]) +
        // right
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pRBoxCornerRadius,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height - pRBoxCornerRadius,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - pRBoxCornerRadius) +
        points2CurveString([{
                controlX: pBBox.x + pBBox.width,
                controlY: pBBox.y + pBBox.height,
                x: pBBox.x + pBBox.width - pRBoxCornerRadius,
                y: pBBox.y + pBBox.height,
            }]) +
        // bottom
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pRBoxCornerRadius,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x + pRBoxCornerRadius,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives_1.default.pathPoint2String("L", pBBox.x + pRBoxCornerRadius, pBBox.y + pBBox.height) +
        points2CurveString([{
                controlX: pBBox.x,
                controlY: pBBox.y + pBBox.height,
                x: pBBox.x,
                y: pBBox.y + pBBox.height - pRBoxCornerRadius,
            }]) +
        // up
        line2CurveString({
            xFrom: pBBox.x,
            yFrom: pBBox.y + pBBox.height - pRBoxCornerRadius,
            xTo: pBBox.x,
            yTo: pBBox.y + pRBoxCornerRadius,
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
