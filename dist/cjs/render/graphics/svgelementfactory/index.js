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
exports.createMarkerPolygon = exports.createMarkerPath = exports.createGroup = exports.createUTurn = exports.createLine = exports.createDiagonalText = exports.createText = exports.createEdgeRemark = exports.createNote = exports.createABox = exports.createRBox = exports.createRect = exports.createTSpan = exports.createDefs = exports.createDesc = exports.createTitle = exports.updateSVG = exports.createSVG = exports.init = void 0;
var straight = __importStar(require("./straight"));
var svgprimitives = __importStar(require("./svgprimitives"));
var wobbly = __importStar(require("./wobbly"));
var gRenderMagic = straight;
var gOptions = {};
function determineRenderMagic(pRenderMagic) {
    if (!Boolean(pRenderMagic)) {
        return gRenderMagic;
    }
    /* istanbul ignore if */
    if ("wobbly" === pRenderMagic) {
        return wobbly;
    }
    return straight;
}
/**
 * Function to set the document to use. Introduced to enable use of the
 * rendering utilities under node.js (using the jsdom module)
 *
 * @param {document} pDocument
 */
function init(pDocument, pOptions) {
    svgprimitives.init(pDocument);
    gOptions = Object.assign({
        LINE_WIDTH: 2,
        FONT_SIZE: 12,
    }, pOptions);
}
exports.init = init;
/**
 * Creates a basic SVG with id pId, and size 0x0
 */
function createSVG(pId, pClass, pRenderMagic) {
    gRenderMagic = determineRenderMagic(pRenderMagic);
    return svgprimitives.createSVG(pId, pClass);
}
exports.createSVG = createSVG;
exports.updateSVG = svgprimitives.updateSVG;
exports.createTitle = svgprimitives.createTitle;
/**
 * Creates a desc element with id pId
 *
 * @param {string} pID
 * @returns {SVGDescElement}
 */
exports.createDesc = svgprimitives.createDesc;
/**
 * Creates an empty 'defs' element
 *
 * @returns {SVGDefsElement}
 */
exports.createDefs = svgprimitives.createDefs;
/**
 * creates a tspan with label pLabel, optionally wrapped in a link
 * if the url pURL is passed
 */
exports.createTSpan = svgprimitives.createTSpan;
/**
 * Creates an svg rectangle of width x height, with the top left
 * corner at coordinates (x, y). pRX and pRY define the amount of
 * rounding the corners of the rectangle get; when they're left out
 * the function will render the corners as straight.
 *
 * Unit: pixels
 */
var createRect = function (pBBox, pOptions) { return gRenderMagic.createRect(pBBox, pOptions); };
exports.createRect = createRect;
/**
 * Creates rect with 6px rounded corners of width x height, with the top
 * left corner at coordinates (x, y)
 */
var createRBox = function (pBBox, pOptions) { return gRenderMagic.createRBox(pBBox, pOptions); };
exports.createRBox = createRBox;
/**
 * Creates an angled box of width x height, with the top left corner
 * at coordinates (x, y)
 */
var createABox = function (pBBox, pOptions) { return gRenderMagic.createABox(pBBox, pOptions); };
exports.createABox = createABox;
/**
 * Creates a note of pWidth x pHeight, with the top left corner
 * at coordinates (pX, pY). pFoldSize controls the size of the
 * fold in the top right corner.
 */
var createNote = function (pBBox, pOptions) {
    return gRenderMagic.createNote(pBBox, pOptions);
};
exports.createNote = createNote;
/**
 * Creates an edge remark (for use in inline expressions) of width x height,
 * with the top left corner at coordinates (x, y). pFoldSize controls the size of the
 * fold bottom right corner.
 */
function createEdgeRemark(pBBox, pOptions) {
    return gRenderMagic.createEdgeRemark(pBBox, {
        class: pOptions.class,
        color: pOptions.color,
        bgColor: pOptions.bgColor,
        foldSize: pOptions.foldSize,
        lineWidth: gOptions.LINE_WIDTH,
    });
}
exports.createEdgeRemark = createEdgeRemark;
/**
 * Creates a text node with the appropriate tspan & a elements on
 * position pCoords.
 */
exports.createText = svgprimitives.createText;
/**
 * Creates a text node with the given pText fitting diagonally (bottom-left
 *  - top right) in canvas pCanvas
 */
exports.createDiagonalText = svgprimitives.createDiagonalText;
/**
 * Creates a line between to coordinates
 */
function createLine(pLine, pOptions) {
    if (Boolean(pOptions) && Boolean(pOptions.doubleLine)) {
        if (!pOptions.lineWidth) {
            pOptions.lineWidth = gOptions.LINE_WIDTH;
        }
        return gRenderMagic.createDoubleLine(pLine, pOptions);
    }
    else {
        return gRenderMagic.createSingleLine(pLine, pOptions);
    }
}
exports.createLine = createLine;
/**
 * Creates a u-turn, departing on pStartX, pStarty and
 * ending on pStartX, pEndY with a width of pWidth
 *
 * @param {object} pBBox
 * @param {object} pOptions
 * @return {SVGPathElement}
 */
exports.createUTurn = svgprimitives.createUTurn;
/**
 * Creates an svg group, identifiable with id pId
 * @param {string} pId
 * @return {SVGGElement}
 */
exports.createGroup = svgprimitives.createGroup;
/**
 * Create an arrow marker consisting of a path as specified in pD
 *
 * @param {string} pId
 * @param {string} pD - a string containing the path
 * @return {SVGPathElement}
 */
exports.createMarkerPath = svgprimitives.createMarkerPath;
/**
 * Create a (filled) arrow marker consisting of a polygon as specified in pPoints
 *
 * @param {string} pId
 * @param {string} pPoints - a string with the points of the polygon
 * @return {SVGPolygonElement}
 */
exports.createMarkerPolygon = svgprimitives.createMarkerPolygon;
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
