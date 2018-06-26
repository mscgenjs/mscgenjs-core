import * as geotypes from "../geotypes";
import svgprimitives from "../svgprimitives";
import variationhelpers from "../variationhelpers";

const SEGMENT_LENGTH = 70; // 70
const WOBBLE_FACTOR  = 3; // 1.4?

function points2CurveString(pCurveSections: geotypes.ICurveSection[]): string {
    return pCurveSections.map((pCurveSection: geotypes.ICurveSection) =>
        `${svgprimitives.pathPoint2String("S", pCurveSection.controlX, pCurveSection.controlY)} ` +
        `${svgprimitives.point2String(pCurveSection as geotypes.IPoint)}`).join(" ");
}

export function line2CurveString(pLine: geotypes.ILine): string {
    return points2CurveString(
        variationhelpers.getBetweenPoints(
            pLine, SEGMENT_LENGTH, WOBBLE_FACTOR,
        ),
    );
}

export function renderNotePathString(
    pBBox: geotypes.IBBox,
    pFoldSize: number,
): string {
    return svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y) +
    // top line:
    line2CurveString({
        xFrom: pBBox.x,
        yFrom: pBBox.y,
        xTo: pBBox.x + pBBox.width - pFoldSize,
        yTo: pBBox.y,
    }) +
    svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +

    // fold:
    line2CurveString({
        xFrom: pBBox.x + pBBox.width - pFoldSize,
        yFrom: pBBox.y,
        xTo: pBBox.x + pBBox.width,
        yTo: pBBox.y + pFoldSize,
    }) +
    svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize) +

    // down:
    line2CurveString({
        xFrom: pBBox.x + pBBox.width,
        yFrom: pBBox.y + pFoldSize,
        xTo: pBBox.x + pBBox.width,
        yTo: pBBox.y + pBBox.height,
    }) +
    svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height) +

    // bottom line:
    line2CurveString({
        xFrom: pBBox.x + pBBox.width,
        yFrom: pBBox.y + pBBox.height,
        xTo: pBBox.x,
        yTo: pBBox.y + pBBox.height,
    }) +
    svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +

    // home:
    line2CurveString({
        xFrom: pBBox.x,
        yFrom: pBBox.y + pBBox.height,
        xTo: pBBox.x,
        yTo: pBBox.y,
    }) +
    svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y) +
    "z";
}

export function renderNoteCornerString(
    pBBox: geotypes.IBBox,
    pFoldSize: number,
): string {
    return svgprimitives.pathPoint2String("M", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +
        // down
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pFoldSize,
            yTo: pBBox.y + pFoldSize,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y + pFoldSize) +
        // right
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y + pFoldSize,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pFoldSize,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize);
}

export function abox2CurveString(pBBox: geotypes.IBBox, pSlopeOffset: number): string {
    return svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + (pBBox.height / 2)) +
        line2CurveString({
            xFrom: pBBox.x,
            yFrom: pBBox.y + (pBBox.height / 2),
            xTo: pBBox.x + pSlopeOffset,
            yTo: pBBox.y,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pSlopeOffset, pBBox.y) +
        // top line
        line2CurveString({
            xFrom: pBBox.x + pSlopeOffset,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pSlopeOffset,
            yTo: pBBox.y,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pSlopeOffset, pBBox.y) +
        // right wedge
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pSlopeOffset,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height / 2,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height / 2) +
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height / 2,
            xTo: pBBox.x + pBBox.width - pSlopeOffset,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pSlopeOffset, pBBox.y + pBBox.height) +
        // bottom line:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pSlopeOffset,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x + pSlopeOffset,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pSlopeOffset, pBBox.y + pBBox.height) +
        // home:
        line2CurveString({
            xFrom: pBBox.x + pSlopeOffset,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y + (pBBox.height / 2),
        }) +
        "z";
}

export function rbox2CurveString(pBBox: geotypes.IBBox, pRBoxCornerRadius?: number): string {
    pRBoxCornerRadius = pRBoxCornerRadius || 6; // px

    return svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + pRBoxCornerRadius) +
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
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pRBoxCornerRadius, pBBox.y) +
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
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - pRBoxCornerRadius) +
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
        svgprimitives.pathPoint2String("L", pBBox.x + pRBoxCornerRadius, pBBox.y + pBBox.height) +
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

export function rect2CurveString(pBBox: geotypes.IBBox): string {
    if (!Boolean(pBBox.y)) {
        pBBox.y = 0;
    }
    return rbox2CurveString(pBBox, 0);
}

export function doubleLine2CurveString(pLine: geotypes.ILine, pOptions): string {
    const lLineWidth = pOptions.lineWidth || 1;
    const lSpace = lLineWidth;
    const lClass = pOptions ? pOptions.class : "";

    const lDir = variationhelpers.getDirection(pLine);
    const lEndCorr = variationhelpers.determineEndCorrection(pLine, lClass, lLineWidth);
    const lStartCorr = variationhelpers.determineStartCorrection(pLine, lClass, lLineWidth);

    return svgprimitives.pathPoint2String("M", pLine.xFrom, (pLine.yFrom - 7.5 * lLineWidth * lDir.dy)) +
        // left stubble:
        svgprimitives.pathPoint2String("l", lDir.signX, lDir.dy) +
        svgprimitives.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom - lSpace) +
        // upper line:
        line2CurveString({
            xFrom: pLine.xFrom + lStartCorr,
            yFrom: pLine.yFrom - lSpace,
            xTo: pLine.xTo + lEndCorr,
            yTo: pLine.yTo - lSpace,
        }) +
        svgprimitives.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom + lSpace) +
        // lower line
        line2CurveString({
            xFrom: pLine.xFrom + lStartCorr,
            yFrom: pLine.yFrom + lSpace,
            xTo: pLine.xTo + lEndCorr,
            yTo: pLine.yTo + lSpace,
        }) +
        svgprimitives.pathPoint2String("M", pLine.xTo - lDir.signX, pLine.yTo + 7.5 * lLineWidth * lDir.dy) +
        // right stubble
        svgprimitives.pathPoint2String("l", lDir.signX, lDir.dy);
}

export function edgeRemark2CurveString(pBBox: geotypes.IBBox, pFoldSize: number): string {
    return svgprimitives.pathPoint2String("M", pBBox.x + pBBox.width, pBBox.y) +
        // down:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height - pFoldSize,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - pFoldSize) +
        // fold:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height - pFoldSize,
            xTo: pBBox.x + pBBox.width - pFoldSize,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y + pBBox.height) +
        // bottom line:
        line2CurveString({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x - 1,
            yTo: pBBox.y + pBBox.height,
        }) +
        svgprimitives.pathPoint2String("L", pBBox.x - 1, pBBox.y + pBBox.height);
}
