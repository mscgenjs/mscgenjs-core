"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domprimitives_1 = require("./domprimitives");
const getdiagonalangle_1 = require("./getdiagonalangle");
const round_1 = require("./round");
const PRECISION = 2;
function point2String(pPoint) {
    return `${round_1.default(pPoint.x, PRECISION).toString()},${round_1.default(pPoint.y, PRECISION).toString()} `;
}
function pathPoint2String(pType, pX, pY) {
    return pType + point2String({ x: pX, y: pY });
}
function createMarker(pId, pClass, pOrient, pViewBox) {
    /* so, why not start at refX=0, refY=0? It would simplify reasoning
     * about marker paths significantly...
     *
     * TL;DR: canvg doesn't seem to handle this very well.
     * - Don't know yet why.
     * - Suspicion: with (0,0) the marker paths we use would end up having
     *   negative coordinates (e.g. "M 0 0 L -8 2" for a left to right
     *   signal)
    */
    return domprimitives_1.default.createElement("marker", {
        orient: pOrient,
        id: pId,
        class: pClass,
        viewBox: Boolean(pViewBox) ? pViewBox : "0 0 10 10",
        refX: "9",
        refY: "3",
        markerUnits: "strokeWidth",
        markerWidth: "10",
        markerHeight: "10",
    });
    /* for scaling to the lineWidth of the line the marker is attached to,
    * userSpaceOnUse looks like a good plan, but it is not only the
    * paths that don't scale, it's also the linewidth (which makes sense).
    * We'll have to roll our own path transformation algorithm if we want
    * to change only the linewidth and not the rest
    */
}
function createLink(pURL, pElementToWrap) {
    const lA = domprimitives_1.default.createElement("a");
    domprimitives_1.default.setAttributesNS(lA, domprimitives_1.default.XLINKNS, {
        "xlink:href": pURL,
        "xlink:title": pURL,
    });
    lA.appendChild(pElementToWrap);
    return lA;
}
/* superscript style could also be super or a number (1em) or a % (100%) */
let lSuperscriptStyle = "vertical-align:text-top;";
lSuperscriptStyle += "font-size:0.7em;text-anchor:start;";
function createTSpan(pLabel, pURL) {
    const lTSpanLabel = domprimitives_1.default.createElement("tspan");
    const lContent = domprimitives_1.default.createTextNode(pLabel);
    lTSpanLabel.appendChild(lContent);
    if (pURL) {
        return createLink(pURL, lTSpanLabel);
    }
    else {
        return lTSpanLabel;
    }
}
function createText(pLabel, pCoords, pOptions) {
    const lOptions = Object.assign({
        class: null,
        url: null,
        id: null,
        idurl: null,
    }, pOptions);
    const lText = domprimitives_1.default.createElement("text", {
        x: round_1.default(pCoords.x, PRECISION).toString(),
        y: round_1.default(pCoords.y, PRECISION).toString(),
        class: lOptions.class,
    });
    lText.appendChild(createTSpan(pLabel, lOptions.url));
    if (lOptions.id) {
        const lTSpanID = createTSpan(` [${lOptions.id}]`, lOptions.idurl);
        lTSpanID.setAttribute("style", lSuperscriptStyle);
        lText.appendChild(lTSpanID);
    }
    return lText;
}
/**
 * Creates an svg path element given the path pD, with pClass applied
 * (if provided)
 *
 * @param {string} pD - the path
 * @param {string} pOptions - an object with (optional) keys class, style, color and bgColor
 * @return {SVGElement}
 */
function createPath(pD, pOptions) {
    const lOptions = Object.assign({
        class: null,
        style: null,
        color: null,
        bgColor: null,
    }, pOptions);
    return colorBox(domprimitives_1.default.createElement("path", {
        d: pD,
        class: lOptions.class,
        style: lOptions.style,
    }), lOptions.color, lOptions.bgColor);
}
function colorBox(pElement, pColor, pBgColor) {
    let lStyleString = "";
    if (pBgColor) {
        lStyleString += `fill:${pBgColor};`;
    }
    if (pColor) {
        lStyleString += `stroke:${pColor};`;
    }
    return domprimitives_1.default.setAttribute(pElement, "style", lStyleString);
}
function createSingleLine(pLine, pOptions) {
    return domprimitives_1.default.createElement("line", {
        x1: round_1.default(pLine.xFrom, PRECISION).toString(),
        y1: round_1.default(pLine.yFrom, PRECISION).toString(),
        x2: round_1.default(pLine.xTo, PRECISION).toString(),
        y2: round_1.default(pLine.yTo, PRECISION).toString(),
        class: pOptions ? pOptions.class : null,
    });
}
/**
 * Creates an svg rectangle of width x height, with the top left
 * corner at coordinates (x, y). pRX and pRY define the amount of
 * rounding the corners of the rectangle get; when they're left out
 * the function will render the corners as straight.
 *
 * Unit: pixels
 *
 * @param {object} pBBox
 * @param {string} pClass - reference to the css class to be applied
 * @param {number=} pRX
 * @param {number=} pRY
 * @return {SVGElement}
 */
function createRect(pBBox, pOptions) {
    const lOptions = Object.assign({
        class: null,
        color: null,
        bgColor: null,
        rx: null,
        ry: null,
    }, pOptions);
    return colorBox(domprimitives_1.default.createElement("rect", {
        width: round_1.default(pBBox.width, PRECISION),
        height: round_1.default(pBBox.height, PRECISION),
        x: round_1.default(pBBox.x, PRECISION),
        y: round_1.default(pBBox.y, PRECISION),
        rx: round_1.default(lOptions.rx, PRECISION),
        ry: round_1.default(lOptions.ry, PRECISION),
        class: lOptions.class,
    }), lOptions.color, lOptions.bgColor);
}
/**
 * Creates a u-turn, departing on pPoint.x, pPoint.y and
 * ending on pPoint.x, pEndY with a width of pWidth
 *
 * @param {object} pBBox
 * @param {number} pEndY
 * @param {number} pWidth
 * @param {string} pOptions - reference to the css class to be applied
 * @return {SVGElement}
 */
function createUTurn(pBBox, pEndY, pOptions) {
    const lOptions = Object.assign({
        class: null,
        dontHitHome: false,
        lineWidth: 1,
    }, pOptions);
    const lEndX = lOptions.dontHitHome ? pBBox.x + 7.5 * lOptions.lineWidth : pBBox.x;
    return createPath(
    // point to start from:
    pathPoint2String("M", pBBox.x, pBBox.y - (pBBox.height / 2)) +
        // curve first to:
        pathPoint2String("C", pBBox.x + pBBox.width, pBBox.y - ((7.5 * lOptions.lineWidth) / 2)) +
        // curve back from.:
        point2String({ x: pBBox.x + pBBox.width, y: pEndY + 0 }) +
        // curve end-pont:
        point2String({ x: lEndX, y: pEndY }), { class: lOptions.class });
}
/**
 * Creates an svg group, identifiable with id pId
 * @param {string} pId
 * @return {SVGElement}
 */
function createGroup(pId, pClass) {
    return domprimitives_1.default.createElement("g", {
        id: pId,
        class: pClass,
    });
}
/**
 * Create an arrow marker consisting of a path as specified in pD
 *
 * @param {string} pId
 * @param {string} pD - a string containing the path
 */
function createMarkerPath(pId, pD, pColor) {
    const lMarker = createMarker(pId, "arrow-marker", "auto");
    /* stroke-dasharray: 'none' should work to override any dashes (like in
        * return messages (a >> b;)) and making sure the marker end gets
        * lines
        * This, however, does not work in webkit, hence the curious
        * value for the stroke-dasharray
        */
    lMarker.appendChild(createPath(pD, {
        class: "arrow-style",
        style: `stroke-dasharray:100,1;stroke:${pColor}` || "black",
    }));
    return lMarker;
}
/**
 * Create a (filled) arrow marker consisting of a polygon as specified in pPoints
 *
 * @param {string} pId
 * @param {string} pPoints - a string with the points of the polygon
 * @return {SVGElement}
 */
function createMarkerPolygon(pId, pPoints, pColor) {
    const lMarker = createMarker(pId, "arrow-marker", "auto");
    lMarker.appendChild(domprimitives_1.default.createElement("polygon", {
        points: pPoints,
        class: "arrow-style",
        stroke: pColor || "black",
        fill: pColor || "black",
    }));
    return lMarker;
}
function createTitle(pText) {
    const lTitle = domprimitives_1.default.createElement("title");
    const lText = domprimitives_1.default.createTextNode(pText);
    lTitle.appendChild(lText);
    return lTitle;
}
/**
 * Creates a text node with the given pText fitting diagonally (bottom-left
 *  - top right) in canvas pCanvas
 *
 * @param {string} pText
 * @param {object} pDimension (an object with at least a .width and a .height)
 */
function createDiagonalText(pText, pDimension, pClass) {
    return domprimitives_1.default.setAttributes(createText(pText, { x: pDimension.width / 2, y: pDimension.height / 2 }, { class: pClass }), {
        transform: `rotate(${round_1.default(getdiagonalangle_1.default(pDimension), PRECISION).toString()} ` +
            `${round_1.default((pDimension.width) / 2, PRECISION).toString()} ` +
            `${round_1.default((pDimension.height) / 2, PRECISION).toString()})`,
    });
}
/**
 * Creates a desc element with id pId
 *
 * @param {string} pID
 * @returns {Element}
 */
function createDesc() {
    return domprimitives_1.default.createElement("desc");
}
/**
 * Creates an empty 'defs' element
 *
 * @returns {Element}
 */
function createDefs() {
    return domprimitives_1.default.createElement("defs");
}
/**
 * Creates a basic SVG with id pId, and size 0x0
 * @param {string} pId
 * @return {Element} an SVG element
 */
function createSVG(pId, pClass) {
    return domprimitives_1.default.createElement("svg", {
        "version": "1.1",
        "id": pId,
        "class": pClass,
        "xmlns": domprimitives_1.default.SVGNS,
        "xmlns:xlink": domprimitives_1.default.XLINKNS,
        "width": "0",
        "height": "0",
    });
}
exports.default = {
    init: domprimitives_1.default.init,
    createSVG,
    updateSVG: domprimitives_1.default.setAttributes,
    // straight + internal for createPath => elementfactory, wobbly & straight
    createDesc,
    createDefs,
    createTSpan,
    createText,
    createDiagonalText,
    createSingleLine,
    createRect,
    createUTurn,
    createGroup,
    // elementfactory, wobbly, straight
    createPath,
    createMarkerPath,
    createMarkerPolygon,
    createTitle,
    // elementfactory, wobbly
    point2String,
    // elementfactory, wobbly, straight
    pathPoint2String,
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
