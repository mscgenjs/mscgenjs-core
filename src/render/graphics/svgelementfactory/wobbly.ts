import svgprimitives from "./svgprimitives";
import variationhelpers from "./variationhelpers";

const SEGMENT_LENGTH = 70; // 70
const WOBBLE_FACTOR  = 3; // 1.4?

function points2CurveString(pPoints) {
    return pPoints.map(
        (pThisPoint) =>
            `${svgprimitives.pathPoint2String("S", pThisPoint.controlX, pThisPoint.controlY)} ` +
            `${svgprimitives.point2String(pThisPoint.x, pThisPoint.y)}`,
    ).join(" ");

}

function createSingleLine(pLine, pOptions) {
    const lDir = variationhelpers.getDirection(pLine);

    return svgprimitives.createPath(
        svgprimitives.pathPoint2String("M", pLine.xFrom, pLine.yFrom) +
        // Workaround; gecko and webkit treat markers slapped on the
        // start of a path with 'auto' different from each other when
        // there's not a line at the start and the path is not going
        // from exactly left to right (gecko renders the marker
        // correctly, whereas webkit will ignore auto and show the
        // marker in its default position)
        //
        // Adding a little stubble at the start of the line solves
        // all that.
        svgprimitives.pathPoint2String(
            "L",
            variationhelpers.round(pLine.xFrom + lDir.signX * Math.sqrt(1 / (1 + Math.pow(lDir.dy, 2)))),
            pLine.yFrom + lDir.signY * (Math.abs(lDir.dy) === Infinity
                ? 1
                : variationhelpers.round(Math.sqrt(Math.pow(lDir.dy, 2) / (1 + Math.pow(lDir.dy, 2))))),
        ) +
        points2CurveString(
            variationhelpers.getBetweenPoints(
                pLine,
                SEGMENT_LENGTH,
                WOBBLE_FACTOR,
            ),
        ),
        {
            class: pOptions ? pOptions.class : null,
        },
    );
}

function renderNotePathString(pBBox, pFoldSize) {
    return `${svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y) +
    // top line:
    points2CurveString(
        variationhelpers.getBetweenPoints({
            xFrom: pBBox.x,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width - pFoldSize,
            yTo: pBBox.y,
        }, SEGMENT_LENGTH, WOBBLE_FACTOR),
    ) +
    svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +

    // fold:
    points2CurveString(
        variationhelpers.getBetweenPoints({
            xFrom: pBBox.x + pBBox.width - pFoldSize,
            yFrom: pBBox.y,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pFoldSize,
        }, SEGMENT_LENGTH, WOBBLE_FACTOR),
    ) +
    svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize) +

    // down:
    points2CurveString(
        variationhelpers.getBetweenPoints({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pFoldSize,
            xTo: pBBox.x + pBBox.width,
            yTo: pBBox.y + pBBox.height,
        }, SEGMENT_LENGTH, WOBBLE_FACTOR),
    ) +
    svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height) +

    // bottom line:
    points2CurveString(
        variationhelpers.getBetweenPoints({
            xFrom: pBBox.x + pBBox.width,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y + pBBox.height,
        }, SEGMENT_LENGTH, WOBBLE_FACTOR),
    ) +
    svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +

    // home:
    points2CurveString(
        variationhelpers.getBetweenPoints({
            xFrom: pBBox.x,
            yFrom: pBBox.y + pBBox.height,
            xTo: pBBox.x,
            yTo: pBBox.y,
        }, SEGMENT_LENGTH, WOBBLE_FACTOR),
    ) +
    svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y)}z`;
}

function renderNoteCornerString(pBBox, pFoldSize) {
    return svgprimitives.pathPoint2String("M", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +
        // down
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pBBox.x + pBBox.width - pFoldSize,
                yFrom: pBBox.y,
                xTo: pBBox.x + pBBox.width - pFoldSize,
                yTo: pBBox.y + pFoldSize,
            }, SEGMENT_LENGTH, WOBBLE_FACTOR),
        ) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y + pFoldSize) +
        // right
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pBBox.x + pBBox.width - pFoldSize,
                yFrom: pBBox.y + pFoldSize,
                xTo: pBBox.x + pBBox.width,
                yTo: pBBox.y + pFoldSize,
            }, SEGMENT_LENGTH, WOBBLE_FACTOR),
        ) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize);
}

function createNote(pBBox, pOptions) {
    const lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
    const lFoldSize = Math.max(9, Math.min(4.5 * lLineWidth, pBBox.height / 2));
    const lGroup = svgprimitives.createGroup();

    lGroup.appendChild(svgprimitives.createPath(renderNotePathString(pBBox, lFoldSize), pOptions));
    pOptions.bgColor = "transparent";
    lGroup.appendChild(svgprimitives.createPath(renderNoteCornerString(pBBox, lFoldSize), pOptions));
    return lGroup;
}

function renderRectString(pBBox) {
    if (!Boolean(pBBox.y)) {
        pBBox.y = 0;
    }
    return `${svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y) +
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x,
        yFrom: pBBox.y,
        xTo: pBBox.x + pBBox.width,
        yTo: pBBox.y,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +
svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y) +
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x + pBBox.width,
        yFrom: pBBox.y,
        xTo: pBBox.x + pBBox.width,
        yTo: pBBox.y + pBBox.height,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +
svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height) +
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x + pBBox.width,
        yFrom: pBBox.y + pBBox.height,
        xTo: pBBox.x,
        yTo: pBBox.y + pBBox.height,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +
svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x,
        yFrom: pBBox.y + pBBox.height,
        xTo: pBBox.x,
        yTo: pBBox.y,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
)}z`;
}

function createRect(pBBox, pOptions) {
    return svgprimitives.createPath(
        renderRectString(pBBox),
        pOptions,
    );
}

function createABox(pBBox, pOptions) {
    const lSlopeOffset = 3;
    return svgprimitives.createPath(
        `${svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + (pBBox.height / 2)) +
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x,
        yFrom: pBBox.y + (pBBox.height / 2),
        xTo: pBBox.x + lSlopeOffset,
        yTo: pBBox.y,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +
svgprimitives.pathPoint2String("L", pBBox.x + lSlopeOffset, pBBox.y) +
// top line
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x + lSlopeOffset,
        yFrom: pBBox.y,
        xTo: pBBox.x + pBBox.width - lSlopeOffset,
        yTo: pBBox.y,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +
svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - lSlopeOffset, pBBox.y) +
// right wedge
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x + pBBox.width - lSlopeOffset,
        yFrom: pBBox.y,
        xTo: pBBox.x + pBBox.width,
        yTo: pBBox.y + pBBox.height / 2,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +
svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height / 2) +
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x + pBBox.width,
        yFrom: pBBox.y + pBBox.height / 2,
        xTo: pBBox.x + pBBox.width - lSlopeOffset,
        yTo: pBBox.y + pBBox.height,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +
svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - lSlopeOffset, pBBox.y + pBBox.height) +
// bottom line:
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x + pBBox.width - lSlopeOffset,
        yFrom: pBBox.y + pBBox.height,
        xTo: pBBox.x + lSlopeOffset,
        yTo: pBBox.y + pBBox.height,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +
svgprimitives.pathPoint2String("L", pBBox.x + lSlopeOffset, pBBox.y + pBBox.height) +
// home:
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x + lSlopeOffset,
        yFrom: pBBox.y + pBBox.height,
        xTo: pBBox.x,
        yTo: pBBox.y + (pBBox.height / 2),
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
)}z`,
        pOptions,
    );
}

function createRBox(pBBox, pOptions) {
    const RBOX_CORNER_RADIUS = 6; // px

    return svgprimitives.createPath(
        `${svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + RBOX_CORNER_RADIUS) +
points2CurveString([{
    controlX: pBBox.x,
    controlY: pBBox.y,
    x: pBBox.x + RBOX_CORNER_RADIUS,
    y: pBBox.y,
}]) +

// top
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x + RBOX_CORNER_RADIUS,
        yFrom: pBBox.y,
        xTo: pBBox.x + pBBox.width - RBOX_CORNER_RADIUS,
        yTo: pBBox.y,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +
svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - RBOX_CORNER_RADIUS, pBBox.y) +

points2CurveString([{
    controlX: pBBox.x + pBBox.width,
    controlY: pBBox.y,
    x: pBBox.x + pBBox.width,
    y: pBBox.y + RBOX_CORNER_RADIUS,
}]) +

// right
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x + pBBox.width,
        yFrom: pBBox.y + RBOX_CORNER_RADIUS,
        xTo: pBBox.x + pBBox.width,
        yTo: pBBox.y + pBBox.height - RBOX_CORNER_RADIUS,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +
svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - RBOX_CORNER_RADIUS) +
points2CurveString([{
    controlX: pBBox.x + pBBox.width,
    controlY: pBBox.y + pBBox.height,
    x: pBBox.x + pBBox.width - RBOX_CORNER_RADIUS,
    y: pBBox.y + pBBox.height,
}]) +

// bottom
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x + pBBox.width - RBOX_CORNER_RADIUS,
        yFrom: pBBox.y + pBBox.height,
        xTo: pBBox.x + RBOX_CORNER_RADIUS,
        yTo: pBBox.y + pBBox.height,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
) +

svgprimitives.pathPoint2String("L", pBBox.x + RBOX_CORNER_RADIUS, pBBox.y + pBBox.height) +
points2CurveString([{
    controlX: pBBox.x,
    controlY: pBBox.y + pBBox.height,
    x: pBBox.x,
    y: pBBox.y + pBBox.height - RBOX_CORNER_RADIUS,
}]) +

// up
points2CurveString(
    variationhelpers.getBetweenPoints({
        xFrom: pBBox.x,
        yFrom: pBBox.y + pBBox.height - RBOX_CORNER_RADIUS,
        xTo: pBBox.x,
        yTo: pBBox.y + RBOX_CORNER_RADIUS,
    }, SEGMENT_LENGTH, WOBBLE_FACTOR),
)}z`,
        pOptions,
    );
}

function createEdgeRemark(pBBox, pOptions) {
    const lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
    const lGroup = svgprimitives.createGroup();

    const lFoldSize = pOptions && pOptions.foldSize ? pOptions.foldSize : 7;
    const lLineColor = pOptions && pOptions.color ? pOptions.color : "black";

    pOptions.color = "transparent!important"; /* :blush: */
    const lBackground = svgprimitives.createPath(
        `${svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + (lLineWidth / 2)) +
// top line:
svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + (lLineWidth / 2)) +
// down:
svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - lFoldSize) +
// fold:
svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width  - lFoldSize, pBBox.y + pBBox.height) +
// bottom line:
svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height)}z`,
        pOptions,
    );

    pOptions.bgColor = "transparent";
    pOptions.color = lLineColor;
    const lLine = svgprimitives.createPath(
        // start:
        svgprimitives.pathPoint2String("M", pBBox.x + pBBox.width, pBBox.y) +
        // down:
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pBBox.x + pBBox.width,
                yFrom: pBBox.y,
                xTo: pBBox.x + pBBox.width,
                yTo: pBBox.y + pBBox.height - lFoldSize,
            }, SEGMENT_LENGTH, WOBBLE_FACTOR),
        ) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - lFoldSize) +
        // fold:
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pBBox.x + pBBox.width,
                yFrom: pBBox.y + pBBox.height - lFoldSize,
                xTo: pBBox.x + pBBox.width - lFoldSize,
                yTo: pBBox.y + pBBox.height,
            }, SEGMENT_LENGTH, WOBBLE_FACTOR),
        ) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width  - lFoldSize, pBBox.y + pBBox.height) +
        // bottom line:
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pBBox.x + pBBox.width - lFoldSize,
                yFrom: pBBox.y + pBBox.height,
                xTo: pBBox.x - 1,
                yTo: pBBox.y + pBBox.height,
            }, SEGMENT_LENGTH, WOBBLE_FACTOR),
        ) +
        svgprimitives.pathPoint2String("L", pBBox.x - 1, pBBox.y + pBBox.height),
        pOptions,
    );
    lGroup.appendChild(lBackground);
    lGroup.appendChild(lLine);
    return lGroup;
}

function createDoubleLine(pLine, pOptions) {
    const lLineWidth = pOptions.lineWidth || 1;
    const lSpace = lLineWidth;
    const lClass = pOptions ? pOptions.class : null;

    const lDir = variationhelpers.getDirection(pLine);
    const lEndCorr = variationhelpers.determineEndCorrection(pLine, lClass, lLineWidth);
    const lStartCorr = variationhelpers.determineStartCorrection(pLine, lClass, lLineWidth);

    return svgprimitives.createPath(
        svgprimitives.pathPoint2String("M", pLine.xFrom, (pLine.yFrom - 7.5 * lLineWidth * lDir.dy)) +
        // left stubble:
        svgprimitives.pathPoint2String("l", lDir.signX, lDir.dy) +
        svgprimitives.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom - lSpace) +
        // upper line:
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pLine.xFrom + lStartCorr,
                yFrom: pLine.yFrom - lSpace,
                xTo: pLine.xTo + lEndCorr,
                yTo: pLine.yTo - lSpace,
            }, SEGMENT_LENGTH, WOBBLE_FACTOR),
        ) +
        svgprimitives.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom + lSpace) +
        // lower line
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pLine.xFrom + lStartCorr,
                yFrom: pLine.yFrom + lSpace,
                xTo: pLine.xTo + lEndCorr,
                yTo: pLine.yTo + lSpace,
            }, SEGMENT_LENGTH, WOBBLE_FACTOR),
        ) +
        svgprimitives.pathPoint2String("M", pLine.xTo - lDir.signX, pLine.yTo + 7.5 * lLineWidth * lDir.dy) +
        // right stubble
        svgprimitives.pathPoint2String("l", lDir.signX, lDir.dy),
        lClass,
    );
}

export default {
    createSingleLine,
    createDoubleLine,
    createNote,
    createRect,
    createABox,
    createRBox,
    createEdgeRemark,

    createDesc: svgprimitives.createDesc,
    createDefs: svgprimitives.createDefs,
    createDiagonalText: svgprimitives.createDiagonalText,
    createTSpan: svgprimitives.createTSpan,
    createText: svgprimitives.createText,
    createUTurn: svgprimitives.createUTurn,
    createGroup: svgprimitives.createGroup,
    createMarkerPath: svgprimitives.createMarkerPath,
    createMarkerPolygon: svgprimitives.createMarkerPolygon,
    createTitle: svgprimitives.createTitle,
    createSVG: svgprimitives.createSVG,
    updateSVG: svgprimitives.updateSVG,
    init: svgprimitives.init,
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
