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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSVG = exports.init = exports.createSVG = exports.createDefs = exports.createDesc = exports.createDiagonalText = exports.createTitle = exports.createMarkerPolygon = exports.createMarkerPath = exports.createGroup = exports.createUTurn = exports.createRect = exports.createSingleLine = exports.createPath = exports.createText = exports.createTSpan = exports.pathPoint2String = exports.point2String = void 0;
var domprimitives = __importStar(require("./domprimitives"));
var getdiagonalangle_1 = __importDefault(require("./getdiagonalangle"));
var round_1 = __importDefault(require("./round"));
var PRECISION = 2;
function point2String(pPoint) {
    return "".concat((0, round_1.default)(pPoint.x, PRECISION).toString(), ",").concat((0, round_1.default)(pPoint.y, PRECISION).toString(), " ");
}
exports.point2String = point2String;
function pathPoint2String(pType, pX, pY) {
    return pType + point2String({ x: pX, y: pY });
}
exports.pathPoint2String = pathPoint2String;
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
    return domprimitives.createElement("marker", {
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
    var lA = domprimitives.createElement("a");
    domprimitives.setAttributesNS(lA, domprimitives.XLINKNS, {
        "xlink:href": pURL,
        "xlink:title": pURL,
    });
    lA.appendChild(pElementToWrap);
    return lA;
}
/* superscript style could also be super or a number (1em) or a % (100%) */
var lSuperscriptStyle = "vertical-align:text-top;";
lSuperscriptStyle += "font-size:0.7em;text-anchor:start;";
function createTSpan(pLabel, pURL) {
    var lTSpanLabel = domprimitives.createElement("tspan");
    var lContent = domprimitives.createTextNode(pLabel);
    lTSpanLabel.appendChild(lContent);
    if (pURL) {
        return createLink(pURL, lTSpanLabel);
    }
    else {
        return lTSpanLabel;
    }
}
exports.createTSpan = createTSpan;
function createText(pLabel, pCoords, pOptions) {
    var lOptions = Object.assign({
        class: null,
        url: null,
        id: null,
        idurl: null,
    }, pOptions);
    var lText = domprimitives.createElement("text", {
        x: (0, round_1.default)(pCoords.x, PRECISION).toString(),
        y: (0, round_1.default)(pCoords.y, PRECISION).toString(),
        class: lOptions.class,
    });
    lText.appendChild(createTSpan(pLabel, lOptions.url));
    if (lOptions.id) {
        var lTSpanID = createTSpan(" [".concat(lOptions.id, "]"), lOptions.idurl);
        lTSpanID.setAttribute("style", lSuperscriptStyle);
        lText.appendChild(lTSpanID);
    }
    return lText;
}
exports.createText = createText;
/**
 * Creates an svg path element given the path pD, with pClass applied
 * (if provided)
 *
 * @param {string} pD - the path
 * @param {string} pOptions - an object with (optional) keys class, style, color and bgColor
 * @return {SVGElement}
 */
function createPath(pD, pOptions) {
    var lOptions = Object.assign({
        class: null,
        style: null,
        color: null,
        bgColor: null,
    }, pOptions);
    return colorBox(domprimitives.createElement("path", {
        d: pD,
        class: lOptions.class,
        style: lOptions.style,
    }), lOptions.color, lOptions.bgColor);
}
exports.createPath = createPath;
function colorBox(pElement, pColor, pBgColor) {
    var lStyleString = "";
    if (pBgColor) {
        lStyleString += "fill:".concat(pBgColor, ";");
    }
    if (pColor) {
        lStyleString += "stroke:".concat(pColor, ";");
    }
    return domprimitives.setAttribute(pElement, "style", lStyleString);
}
function createSingleLine(pLine, pOptions) {
    return domprimitives.createElement("line", {
        x1: (0, round_1.default)(pLine.xFrom, PRECISION).toString(),
        y1: (0, round_1.default)(pLine.yFrom, PRECISION).toString(),
        x2: (0, round_1.default)(pLine.xTo, PRECISION).toString(),
        y2: (0, round_1.default)(pLine.yTo, PRECISION).toString(),
        class: pOptions ? pOptions.class : null,
    });
}
exports.createSingleLine = createSingleLine;
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
    var lOptions = Object.assign({
        class: null,
        color: null,
        bgColor: null,
        rx: null,
        ry: null,
    }, pOptions);
    return colorBox(domprimitives.createElement("rect", {
        width: (0, round_1.default)(pBBox.width, PRECISION),
        height: (0, round_1.default)(pBBox.height, PRECISION),
        x: (0, round_1.default)(pBBox.x, PRECISION),
        y: (0, round_1.default)(pBBox.y, PRECISION),
        rx: (0, round_1.default)(lOptions.rx || 0, PRECISION),
        ry: (0, round_1.default)(lOptions.ry || 0, PRECISION),
        class: lOptions.class,
    }), lOptions.color, lOptions.bgColor);
}
exports.createRect = createRect;
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
    var lOptions = Object.assign({
        class: null,
        dontHitHome: false,
        lineWidth: 1,
    }, pOptions);
    var lEndX = lOptions.dontHitHome
        ? pBBox.x + 7.5 * (lOptions.lineWidth || 1)
        : pBBox.x;
    return createPath(
    // point to start from:
    pathPoint2String("M", pBBox.x, pBBox.y - pBBox.height / 2) +
        // curve first to:
        pathPoint2String("C", pBBox.x + pBBox.width, pBBox.y - (7.5 * (lOptions.lineWidth || 1)) / 2) +
        // curve back from.:
        point2String({ x: pBBox.x + pBBox.width, y: pEndY + 0 }) +
        // curve end-pont:
        point2String({ x: lEndX, y: pEndY }), { class: lOptions.class });
}
exports.createUTurn = createUTurn;
/**
 * Creates an svg group, identifiable with id pId
 * @param {string} pId
 * @return {SVGElement}
 */
function createGroup(pId, pClass) {
    return domprimitives.createElement("g", {
        id: pId,
        class: pClass,
    });
}
exports.createGroup = createGroup;
/**
 * Create an arrow marker consisting of a path as specified in pD
 *
 * @param {string} pId
 * @param {string} pD - a string containing the path
 */
function createMarkerPath(pId, pD, pColor) {
    var lMarker = createMarker(pId, "arrow-marker", "auto");
    /* stroke-dasharray: 'none' should work to override any dashes (like in
     * return messages (a >> b;)) and making sure the marker end gets
     * lines
     * This, however, does not work in webkit, hence the curious
     * value for the stroke-dasharray
     */
    lMarker.appendChild(createPath(pD, {
        class: "arrow-style",
        style: "stroke-dasharray:100,1;stroke:".concat(pColor) || "black",
    }));
    return lMarker;
}
exports.createMarkerPath = createMarkerPath;
/**
 * Create a (filled) arrow marker consisting of a polygon as specified in pPoints
 *
 * @param {string} pId
 * @param {string} pPoints - a string with the points of the polygon
 * @return {SVGElement}
 */
function createMarkerPolygon(pId, pPoints, pColor) {
    var lMarker = createMarker(pId, "arrow-marker", "auto");
    lMarker.appendChild(domprimitives.createElement("polygon", {
        points: pPoints,
        class: "arrow-style",
        stroke: pColor || "black",
        fill: pColor || "black",
    }));
    return lMarker;
}
exports.createMarkerPolygon = createMarkerPolygon;
function createTitle(pText) {
    var lTitle = domprimitives.createElement("title");
    var lText = domprimitives.createTextNode(pText);
    lTitle.appendChild(lText);
    return lTitle;
}
exports.createTitle = createTitle;
/**
 * Creates a text node with the given pText fitting diagonally (bottom-left
 *  - top right) in canvas pCanvas
 *
 * @param {string} pText
 * @param {object} pDimension (an object with at least a .width and a .height)
 */
function createDiagonalText(pText, pDimension, pClass) {
    return domprimitives.setAttributes(createText(pText, { x: pDimension.width / 2, y: pDimension.height / 2 }, { class: pClass }), {
        transform: "rotate(".concat((0, round_1.default)((0, getdiagonalangle_1.default)(pDimension), PRECISION).toString(), " ") +
            "".concat((0, round_1.default)(pDimension.width / 2, PRECISION).toString(), " ") +
            "".concat((0, round_1.default)(pDimension.height / 2, PRECISION).toString(), ")"),
    });
}
exports.createDiagonalText = createDiagonalText;
/**
 * Creates a desc element with id pId
 *
 * @param {string} pID
 * @returns {Element}
 */
function createDesc() {
    return domprimitives.createElement("desc");
}
exports.createDesc = createDesc;
/**
 * Creates an empty 'defs' element
 *
 * @returns {Element}
 */
function createDefs() {
    return domprimitives.createElement("defs");
}
exports.createDefs = createDefs;
/**
 * Creates a basic SVG with id pId, and size 0x0
 * @param {string} pId
 * @return {Element} an SVG element
 */
function createSVG(pId, pClass) {
    return domprimitives.createElement("svg", {
        version: "1.1",
        id: pId,
        class: pClass,
        xmlns: domprimitives.SVGNS,
        "xmlns:xlink": domprimitives.XLINKNS,
        width: "0",
        height: "0",
    });
}
exports.createSVG = createSVG;
exports.init = domprimitives.init;
exports.updateSVG = domprimitives.setAttributes;
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
