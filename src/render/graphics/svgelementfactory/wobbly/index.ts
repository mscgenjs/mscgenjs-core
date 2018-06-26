import {
    abox2CurveString,
    doubleLine2CurveString,
    edgeRemark2CurveString,
    line2CurveString,
    rbox2CurveString,
    rect2CurveString,
    renderNoteCornerString,
    renderNotePathString } from "./curvestringfactory";

import * as geotypes from "../geotypes";
import * as magic from "../magic";
import round from "../round";
import svgprimitives from "../svgprimitives";
import variationhelpers from "../variationhelpers";

function createSingleLine(
    pLine: geotypes.ILine,
    pOptions: {class?: string} = {},
): SVGPathElement {
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
            round(pLine.xFrom + lDir.signX * Math.sqrt(1 / (1 + Math.pow(lDir.dy, 2))), 2),
            pLine.yFrom + lDir.signY * (
                Math.abs(lDir.dy) === Infinity
                ? 1
                : round(Math.sqrt(Math.pow(lDir.dy, 2) / (1 + Math.pow(lDir.dy, 2))), 2)
            ),
        ) +
        line2CurveString(pLine),
        pOptions,
    );
}

function createNote(
    pBBox: geotypes.IBBox,
    pOptions: magic.IOptions,
): SVGGElement {
    const lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
    const lFoldSize = Math.max(9, Math.min(4.5 * lLineWidth, pBBox.height / 2));
    const lGroup = svgprimitives.createGroup();

    lGroup.appendChild(svgprimitives.createPath(renderNotePathString(pBBox, lFoldSize), pOptions));
    pOptions.bgColor = "transparent";
    lGroup.appendChild(svgprimitives.createPath(renderNoteCornerString(pBBox, lFoldSize), pOptions));
    return lGroup;
}

function createRect(pBBox: geotypes.IBBox, pOptions: magic.IBoxOptions): SVGPathElement {
    return svgprimitives.createPath(
        rect2CurveString(pBBox),
        pOptions,
    );
}

function createABox(pBBox: geotypes.IBBox, pOptions: magic.IBoxOptions): SVGPathElement {
    const lSlopeOffset = 3;
    return svgprimitives.createPath(
        abox2CurveString(pBBox, lSlopeOffset),
        pOptions,
    );
}

function createRBox(pBBox: geotypes.IBBox, pOptions: magic.IBoxOptions): SVGPathElement {
    return svgprimitives.createPath(
        rbox2CurveString(pBBox),
        pOptions,
    );
}

function createEdgeRemark(pBBox: geotypes.IBBox, pOptions: magic.IOptions): SVGGElement {
    const lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
    const lGroup = svgprimitives.createGroup();

    const lFoldSize = pOptions && pOptions.foldSize ? pOptions.foldSize : 7;
    const lLineColor = pOptions && pOptions.color ? pOptions.color : "black";

    pOptions.color = "transparent!important"; /* :blush: */
    const lBackground = svgprimitives.createPath(
        svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + (lLineWidth / 2)) +
        // top line:
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + (lLineWidth / 2)) +
        // down:
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - lFoldSize) +
        // fold:
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width  - lFoldSize, pBBox.y + pBBox.height) +
        // bottom line:
        svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
        "z",
        pOptions,
    );

    pOptions.bgColor = "transparent";
    pOptions.color = lLineColor;
    const lLine = svgprimitives.createPath(
        // start:
        edgeRemark2CurveString(pBBox, lFoldSize),
        pOptions,
    );
    lGroup.appendChild(lBackground);
    lGroup.appendChild(lLine);
    return lGroup;
}

function createDoubleLine(pLine: geotypes.ILine, pOptions: magic.IOptions): SVGPathElement {
    return svgprimitives.createPath(
        doubleLine2CurveString(pLine, pOptions),
        {class: pOptions.class},
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
