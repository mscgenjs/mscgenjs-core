import domprimitives from "./domprimitives";
import getDiagonalAngle from "./getdiagonalangle";
import round from "./round";
const PRECISION        = 2;

function point2String(pX, pY) {
    return `${round(pX, PRECISION).toString()},${round(pY, PRECISION).toString()} `;
}

function pathPoint2String(pType, pX, pY) {
    return pType + point2String(pX, pY);
}

function createMarker(pId, pClass, pOrient, pViewBox?) {
    /* so, why not start at refX=0, refY=0? It would simplify reasoning
        * about marker paths significantly...
        *
        * TL;DR: canvg doesn't seem to handle this very well.
        * - Don't know yet why.
        * - Suspicion: with (0,0) the marker paths we use would end up having
        *   negative coordinates (e.g. "M 0 0 L -8 2" for a left to right
        *   signal)
        */
    return domprimitives.createElement(
        "marker",
        {
            orient: pOrient,
            id: pId,
            class: pClass,
            viewBox: Boolean(pViewBox) ? pViewBox : "0 0 10 10",
            refX: "9",
            refY: "3",
            markerUnits: "strokeWidth",
            markerWidth: "10",
            markerHeight: "10",
        },
    );
    /* for scaling to the lineWidth of the line the marker is attached to,
        * userSpaceOnUse looks like a good plan, but it is not only the
        * paths that don't scale, it's also the linewidth (which makes sense).
        * We'll have to roll our own path transformation algorithm if we want
        * to change only the linewidth and not the rest
        */

}

function createLink(pURL, pElementToWrap) {
    const lA = domprimitives.createElement("a");
    domprimitives.setAttributesNS(
        lA,
        domprimitives.XLINKNS,
        {
            "xlink:href"  : pURL,
            "xlink:title" : pURL,
        },
    );
    lA.appendChild(pElementToWrap);
    return lA;
}

/* superscript style could also be super or a number (1em) or a % (100%) */
let lSuperscriptStyle = "vertical-align:text-top;";
lSuperscriptStyle += "font-size:0.7em;text-anchor:start;";

function createTSpan(pLabel, pURL) {
    const lTSpanLabel = domprimitives.createElement("tspan");
    const lContent = domprimitives.createTextNode(pLabel);
    lTSpanLabel.appendChild(lContent);
    if (pURL) {
        return createLink(pURL, lTSpanLabel);
    } else {
        return lTSpanLabel;
    }
}

function createText(pLabel, pCoords, pOptions?) {
    const lOptions = Object.assign(
        {
            class: null,
            url: null,
            id: null,
            idurl: null,
        },
        pOptions,
    );
    const lText = domprimitives.createElement(
        "text",
        {
            x: round(pCoords.x, PRECISION).toString(),
            y: round(pCoords.y, PRECISION).toString(),
            class: lOptions.class,
        },
    );

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
    const lOptions = Object.assign(
        {
            class: null,
            style: null,
            color: null,
            bgColor: null,
        },
        pOptions,
    );
    return colorBox(
        domprimitives.createElement(
            "path",
            {
                d: pD,
                class: lOptions.class,
                style: lOptions.style,
            },
        ),
        lOptions.color,
        lOptions.bgColor,
    );
}

function colorBox(pElement, pColor, pBgColor) {
    let lStyleString = "";
    if (pBgColor) {
        lStyleString += `fill:${pBgColor};`;
    }
    if (pColor) {
        lStyleString += `stroke:${pColor};`;
    }
    return domprimitives.setAttribute(pElement, "style", lStyleString);
}

export default {
    /**
     * Function to set the document to use. Introduced to enable use of the
     * rendering utilities under node.js (using the jsdom module)
     *
     * @param {document} pDocument
     */
    init(pDocument) {
        domprimitives.init(pDocument);
    },

    /**
     * Creates a basic SVG with id pId, and size 0x0
     * @param {string} pId
     * @return {Element} an SVG element
     */
    createSVG(pId, pClass) {
        return domprimitives.createElement(
            "svg",
            {
                "version": "1.1",
                "id": pId,
                "class": pClass,
                "xmlns": domprimitives.SVGNS,
                "xmlns:xlink": domprimitives.XLINKNS,
                "width": "0",
                "height": "0",
            },
        );
    },

    updateSVG(pSVGElement, pAttributes) {
        domprimitives.setAttributes(pSVGElement, pAttributes);
    },

    // straight + internal for createPath => elementfactory, wobbly & straight
    colorBox,

    /**
     * Creates a desc element with id pId
     *
     * @param {string} pID
     * @returns {Element}
     */
    createDesc() {
        return domprimitives.createElement("desc");
    },

    /**
     * Creates an empty 'defs' element
     *
     * @returns {Element}
     */
    createDefs() {
        return domprimitives.createElement("defs");
    },

    /**
     * creates a tspan with label pLabel, optionally wrapped in a link
     * if the url pURL is passed
     *
     * @param  {string} pLabel
     * @param  {string} pURL
     * @return {element}
     */
    createTSpan,
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
    createText,

    /**
     * Creates a text node with the given pText fitting diagonally (bottom-left
     *  - top right) in canvas pCanvas
     *
     * @param {string} pText
     * @param {object} pCanvas (an object with at least a .width and a .height)
     */
    createDiagonalText(pText, pCanvas, pClass) {
        return domprimitives.setAttributes(
            createText(pText, {x: pCanvas.width / 2, y: pCanvas.height / 2}, {class: pClass}),
            {
                transform:
                    `rotate(${round(getDiagonalAngle(pCanvas), PRECISION).toString()} ` +
                    `${round((pCanvas.width) / 2, PRECISION).toString()} ` +
                    `${round((pCanvas.height) / 2, PRECISION).toString()})`,
            },
        );
    },

    createSingleLine(pLine, pOptions) {
        return domprimitives.createElement(
            "line",
            {
                x1: round(pLine.xFrom, PRECISION).toString(),
                y1: round(pLine.yFrom, PRECISION).toString(),
                x2: round(pLine.xTo, PRECISION).toString(),
                y2: round(pLine.yTo, PRECISION).toString(),
                class: pOptions ? pOptions.class : null,
            },
        );
    },

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
    createRect(pBBox, pOptions) {
        const lOptions = Object.assign(
            {
                class: null,
                color: null,
                bgColor: null,
                rx: null,
                ry: null,
            },
            pOptions,
        );
        return colorBox(
            domprimitives.createElement(
                "rect",
                {
                    width: round(pBBox.width, PRECISION),
                    height: round(pBBox.height, PRECISION),
                    x: round(pBBox.x, PRECISION),
                    y: round(pBBox.y, PRECISION),
                    rx: round(lOptions.rx, PRECISION),
                    ry: round(lOptions.ry, PRECISION),
                    class: lOptions.class,
                },
            ),
            lOptions.color,
            lOptions.bgColor,
        );
    },

    /**
     * Creates a u-turn, departing on pPoint.x, pPoint.y and
     * ending on pPoint.x, pEndY with a width of pWidth
     *
     * @param {object} pPoint
     * @param {number} pEndY
     * @param {number} pWidth
     * @param {string} pClass - reference to the css class to be applied
     * @return {SVGElement}
     */
    createUTurn(pPoint, pEndY, pWidth, pClass, pOptions, pHeight) {
        const lOptions = Object.assign(
            {
                dontHitHome: false,
                lineWidth: 1,
            },
            pOptions,
        );

        const lEndX = lOptions.dontHitHome ? pPoint.x + 7.5 * pOptions.lineWidth : pPoint.x;

        return createPath(
            // point to start from:
            pathPoint2String("M", pPoint.x, pPoint.y - (pHeight / 2)) +
            // curve first to:
            pathPoint2String("C", pPoint.x + pWidth, pPoint.y - ((7.5 * pOptions.lineWidth) / 2)) +
            // curve back from.:
            point2String(pPoint.x + pWidth, pEndY + 0) +
            // curve end-pont:
            point2String(lEndX, pEndY),
            {class: pClass},
        );
    },

    /**
     * Creates an svg group, identifiable with id pId
     * @param {string} pId
     * @return {SVGElement}
     */
    createGroup(pId?, pClass?) {
        return domprimitives.createElement(
            "g",
            {
                id: pId,
                class: pClass,
            },
        );
    },

    // elementfactory, wobbly, straight
    createPath,

    /**
     * Create an arrow marker consisting of a path as specified in pD
     *
     * @param {string} pId
     * @param {string} pD - a string containing the path
     */
    createMarkerPath(pId, pD, pColor) {
        const lMarker = createMarker(pId, "arrow-marker", "auto");
        /* stroke-dasharray: 'none' should work to override any dashes (like in
            * return messages (a >> b;)) and making sure the marker end gets
            * lines
            * This, however, does not work in webkit, hence the curious
            * value for the stroke-dasharray
            */
        lMarker.appendChild(
            createPath(
                pD,
                {
                    class: "arrow-style",
                    style: `stroke-dasharray:100,1;stroke:${pColor}` || "black",
                },
            ),
        );
        return lMarker;
    },

    /**
     * Create a (filled) arrow marker consisting of a polygon as specified in pPoints
     *
     * @param {string} pId
     * @param {string} pPoints - a string with the points of the polygon
     * @return {SVGElement}
     */
    createMarkerPolygon(pId, pPoints, pColor) {
        const lMarker = createMarker(pId, "arrow-marker", "auto");
        lMarker.appendChild(
            domprimitives.createElement(
                "polygon",
                {
                    points : pPoints,
                    class  : "arrow-style",
                    stroke : pColor || "black",
                    fill   : pColor || "black",
                },
            ),
        );
        return lMarker;
    },

    createTitle(pText) {
        const lTitle = domprimitives.createElement("title");
        const lText = domprimitives.createTextNode(pText);
        lTitle.appendChild(lText);
        return lTitle;
    },

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
