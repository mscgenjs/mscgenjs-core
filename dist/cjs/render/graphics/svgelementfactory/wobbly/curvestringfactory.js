"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderNotePathString = renderNotePathString;
exports.renderNoteCornerString = renderNoteCornerString;
exports.abox2CurveString = abox2CurveString;
exports.rbox2CurveString = rbox2CurveString;
exports.doubleLine2CurveString = doubleLine2CurveString;
exports.edgeRemark2CurveString = edgeRemark2CurveString;
var svgprimitives = __importStar(require("../svgprimitives"));
var variationhelpers = __importStar(require("../variationhelpers"));
var helpers_1 = require("./helpers");
function renderNotePathString(pBBox, pFoldSize) {
    return (svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y) +
        // top line:
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pFoldSize,
            yTo: pBBox.y,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +
        // fold:
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pFoldSize,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize) +
        // down:
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pFoldSize,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height) +
        // bottom line:
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
        // home:
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y) +
        "z");
}
function renderNoteCornerString(pBBox, pFoldSize) {
    return (svgprimitives.pathPoint2String("M", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +
        // down
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pFoldSize,
            yTo: pBBox.y + pFoldSize,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y + pFoldSize) +
        // right
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y + pFoldSize,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pFoldSize,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize));
}
function abox2CurveString(pBBox, pSlopeOffset) {
    return (svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + pBBox.height / 2) +
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x,
            yFrom: pBBox.y + pBBox.height / 2,
            xTo: pBBox.x + pSlopeOffset,
            yTo: pBBox.y,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pSlopeOffset, pBBox.y) +
        // top line
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pSlopeOffset,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pSlopeOffset,
            yTo: pBBox.y,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pSlopeOffset, pBBox.y) +
        // right wedge
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width - pSlopeOffset,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height / 2,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height / 2) +
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height / 2,
            xTo: pBBox.x + pBBox.width - pSlopeOffset,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pSlopeOffset, pBBox.y + pBBox.height) +
        // bottom line:
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width - pSlopeOffset,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x + pSlopeOffset,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pSlopeOffset, pBBox.y + pBBox.height) +
        // home:
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pSlopeOffset,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y + pBBox.height / 2,
        }) +
        "z");
}
function rbox2CurveString(pBBox, pRBoxCornerRadius) {
    return (svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + pRBoxCornerRadius) +
        (0, helpers_1.points2CurveString)([
            {
                controlX: pBBox.x,
                controlY: pBBox.y,
                x: pBBox.x + pRBoxCornerRadius,
                y: pBBox.y,
            },
        ]) +
        // top
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pRBoxCornerRadius,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pRBoxCornerRadius,
            yTo: pBBox.y,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pRBoxCornerRadius, pBBox.y) +
        (0, helpers_1.points2CurveString)([
            {
                controlX: pBBox.x + pBBox.width,
                controlY: pBBox.y,
                x: pBBox.x + pBBox.width,
                y: pBBox.y + pRBoxCornerRadius,
            },
        ]) +
        // right
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pRBoxCornerRadius,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height - pRBoxCornerRadius,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - pRBoxCornerRadius) +
        (0, helpers_1.points2CurveString)([
            {
                controlX: pBBox.x + pBBox.width,
                controlY: pBBox.y + pBBox.height,
                x: pBBox.x + pBBox.width - pRBoxCornerRadius,
                y: pBBox.y + pBBox.height,
            },
        ]) +
        // bottom
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width - pRBoxCornerRadius,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x + pRBoxCornerRadius,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pRBoxCornerRadius, pBBox.y + pBBox.height) +
        (0, helpers_1.points2CurveString)([
            {
                controlX: pBBox.x,
                controlY: pBBox.y + pBBox.height,
                x: pBBox.x,
                y: pBBox.y + pBBox.height - pRBoxCornerRadius,
            },
        ]) +
        // up
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x,
            yFrom: pBBox.y + pBBox.height - pRBoxCornerRadius,
            xTo: pBBox.x,
            yTo: pBBox.y + pRBoxCornerRadius,
        }) +
        "z");
}
function doubleLine2CurveString(pLine, pOptions) {
    var lLineWidth = pOptions.lineWidth || 1;
    var lSpace = lLineWidth;
    var lClass = pOptions ? pOptions.class : "";
    var lDir = variationhelpers.getDirection(pLine);
    var lEndCorr = variationhelpers.determineEndCorrection(pLine, lClass, lLineWidth);
    var lStartCorr = variationhelpers.determineStartCorrection(pLine, lClass, lLineWidth);
    return (svgprimitives.pathPoint2String("M", pLine.xFrom, pLine.yFrom - 7.5 * lLineWidth * lDir.dy) +
        // left stubble:
        svgprimitives.pathPoint2String("l", lDir.signX, lDir.dy) +
        svgprimitives.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom - lSpace) +
        // upper line:
        (0, helpers_1.line2CurveString)({
            xFrom: pLine.xFrom + lStartCorr,
            yFrom: pLine.yFrom - lSpace,
            xTo: pLine.xTo + lEndCorr,
            yTo: pLine.yTo - lSpace,
        }) +
        svgprimitives.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom + lSpace) +
        // lower line
        (0, helpers_1.line2CurveString)({
            xFrom: pLine.xFrom + lStartCorr,
            yFrom: pLine.yFrom + lSpace,
            xTo: pLine.xTo + lEndCorr,
            yTo: pLine.yTo + lSpace,
        }) +
        svgprimitives.pathPoint2String("M", pLine.xTo - lDir.signX, pLine.yTo + 7.5 * lLineWidth * lDir.dy) +
        // right stubble
        svgprimitives.pathPoint2String("l", lDir.signX, lDir.dy));
}
function edgeRemark2CurveString(pBBox, pFoldSize) {
    return (svgprimitives.pathPoint2String("M", pBBox.x + pBBox.width, pBBox.y) +
        // down:
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height - pFoldSize,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - pFoldSize) +
        // fold:
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height - pFoldSize,
            xTo: pBBox.x + pBBox.width - pFoldSize,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y + pBBox.height) +
        // bottom line:
        (0, helpers_1.line2CurveString)({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x - 1,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x - 1, pBBox.y + pBBox.height));
}
