import * as geotypes from "./geotypes";
import * as magic from "./magic";
import straight from "./straight";
import svgprimitives from "./svgprimitives";
import wobbly from "./wobbly";

let gRenderMagic  = straight;
let gOptions: any = {};

function determineRenderMagic(pRenderMagic: magic.MagicType): any {
    if (!Boolean(pRenderMagic)) {
        return gRenderMagic;
    }
    /* istanbul ignore if */
    if ("wobbly" === pRenderMagic) {
        return wobbly;
    }
    return straight;
}

export default {
    /**
     * Function to set the document to use. Introduced to enable use of the
     * rendering utilities under node.js (using the jsdom module)
     *
     * @param {document} pDocument
     */
    init(pDocument: Document, pOptions) {
        svgprimitives.init(pDocument);
        gOptions = Object.assign(
            {
                LINE_WIDTH: 2,
                FONT_SIZE: 12,
            },
            pOptions,
        );
    },

    /**
     * Creates a basic SVG with id pId, and size 0x0
     * @param {string} pId
     * @return {Element} an SVG element
     */
    createSVG(pId: string, pClass: string, pRenderMagic?: any): SVGSVGElement {
        gRenderMagic = determineRenderMagic(pRenderMagic);
        return svgprimitives.createSVG(pId, pClass);
    },

    updateSVG: svgprimitives.updateSVG,

    createTitle: svgprimitives.createTitle,

    /**
     * Creates a desc element with id pId
     *
     * @param {string} pID
     * @returns {Element}
     */
    createDesc: svgprimitives.createDesc,

    /**
     * Creates an empty 'defs' element
     *
     * @returns {Element}
     */
    createDefs: svgprimitives.createDefs,

    /**
     * creates a tspan with label pLabel, optionally wrapped in a link
     * if the url pURL is passed
     *
     * @param  {string} pLabel
     * @param  {string} pURL
     * @return {element}
     */
    createTSpan: svgprimitives.createTSpan,

    /**
     * Creates an svg rectangle of width x height, with the top left
     * corner at coordinates (x, y). pRX and pRY define the amount of
     * rounding the corners of the rectangle get; when they're left out
     * the function will render the corners as straight.
     *
     * Unit: pixels
     *
     * @param {object} pBBox
     * @param {string} pOptions - reference to the css class to be applied
     * @return {SVGRectElement}
     */
    createRect: (pBBox: geotypes.IBBox, pOptions: magic.IBoxOptions): SVGRectElement | SVGPathElement =>
        gRenderMagic.createRect (pBBox, pOptions),

    /**
     * Creates rect with 6px rounded corners of width x height, with the top
     * left corner at coordinates (x, y)
     *
     * @param {object} pBBox
     * @param {magic.IBoxOptions} pOptions
     * @return {SVGElement}
     */
    createRBox: (pBBox: geotypes.IBBox, pOptions: magic.IBoxOptions): SVGRectElement | SVGPathElement =>
        gRenderMagic.createRBox (pBBox, pOptions),

    /**
     * Creates an angled box of width x height, with the top left corner
     * at coordinates (x, y)
     */
    createABox: (pBBox: geotypes.IBBox, pOptions: magic.IBoxOptions): SVGPathElement =>
        gRenderMagic.createABox (pBBox, pOptions),

    /**
     * Creates a note of pWidth x pHeight, with the top left corner
     * at coordinates (pX, pY). pFoldSize controls the size of the
     * fold in the top right corner.
     */
    createNote: (pBBox: geotypes.IBBox, pOptions: magic.IOptions): SVGPathElement =>
        gRenderMagic.createNote(pBBox, pOptions),

    /**
     * Creates an edge remark (for use in inline expressions) of width x height,
     * with the top left corner at coordinates (x, y). pFoldSize controls the size of the
     * fold bottom right corner.
     */
    createEdgeRemark(pBBox, pClass, pColor, pBgColor, pFoldSize) {
        return gRenderMagic.createEdgeRemark(
            pBBox,
            {
                class: pClass,
                color: pColor,
                bgColor: pBgColor,
                foldSize: pFoldSize,
                lineWidth: gOptions.LINE_WIDTH,
            },
        );
    },

    /**
     * Creates a text node with the appropriate tspan & a elements on
     * position pCoords.
     *
     * @param {string} pLabel
     * @param {object} pCoords
     * @param {object} pOptions - options to influence rendering
     *                          {string} pClass - reference to the css class to be applied
     *                          {string=} pURL - link to render
     *                          {string=} pID - (small) id text to render
     *                          {string=} pIDURL - link to render for the id text
     * @return {SVGElement}
     */
    createText: svgprimitives.createText,

    /**
     * Creates a text node with the given pText fitting diagonally (bottom-left
     *  - top right) in canvas pCanvas
     *
     * @param {string} pText
     * @param {object} pCanvas (an object with at least a .width and a .height)
     */
    createDiagonalText: svgprimitives.createDiagonalText,

    /**
     * Creates a line between to coordinates
     * @param {object} pLine - an xFrom, yFrom and xTo, yTo pair describing a line
     * @param {object} pOptions - class: reference to the css class to be applied, lineWidth: line width to use
     * @param {boolean=} [pDouble=false] - render a double line
     * @return {SVGElement}
     */
    createLine(pLine: geotypes.ILine, pOptions) {
        if (Boolean(pOptions) && Boolean(pOptions.doubleLine)) {
            if (!pOptions.lineWidth) {
                pOptions.lineWidth = gOptions.LINE_WIDTH;
            }
            return gRenderMagic.createDoubleLine(pLine, pOptions);
        } else {
            return gRenderMagic.createSingleLine(pLine, pOptions);
        }
    },

    /**
     * Creates a u-turn, departing on pStartX, pStarty and
     * ending on pStartX, pEndY with a width of pWidth
     *
     * @param {object} pBBox
     * @param {number} pEndY
     * @param {object} pOptions
     * @return {SVGElement}
     */
    createUTurn: svgprimitives.createUTurn,

    /**
     * Creates an svg group, identifiable with id pId
     * @param {string} pId
     * @return {SVGElement}
     */
    createGroup: svgprimitives.createGroup,

    /**
     * Create an arrow marker consisting of a path as specified in pD
     *
     * @param {string} pId
     * @param {string} pD - a string containing the path
     */
    createMarkerPath: svgprimitives.createMarkerPath,

    /**
     * Create a (filled) arrow marker consisting of a polygon as specified in pPoints
     *
     * @param {string} pId
     * @param {string} pPoints - a string with the points of the polygon
     * @return {SVGElement}
     */
    createMarkerPolygon: svgprimitives.createMarkerPolygon,
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
