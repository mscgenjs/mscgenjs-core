"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memoize = require("lodash.memoize");
const idmanager_1 = require("./idmanager");
const index_1 = require("./svgelementfactory/index");
/**
 * Some SVG specific calculations & workarounds
 */
let gDocument = {};
const gSvgBBoxerId = idmanager_1.default.get("bboxer");
/* istanbul ignore next */
function _createBBoxerSVG(pId) {
    const lSvg = index_1.default.createSVG(pId, idmanager_1.default.get());
    gDocument.body.appendChild(lSvg);
    return lSvg;
}
/* istanbul ignore next */
function getNativeBBox(pElement) {
    /* getNativeBBoxWithCache */
    let lSvg = gDocument.getElementById(gSvgBBoxerId);
    lSvg = lSvg ? lSvg : _createBBoxerSVG(gSvgBBoxerId);
    lSvg.appendChild(pElement);
    const lRetval = pElement.getBBox();
    lSvg.removeChild(pElement);
    return lRetval;
}
/*
    * workaround for Opera browser quirk: if the dimensions
    * of an element are 0x0, Opera's getBBox() implementation
    * returns -Infinity (which is a kind of impractical value
    * to actually render, even for Opera)
    * To counter this, manually set the return value to 0x0
    * if height or width has a wacky value:
    */
/* istanbul ignore next */
function sanitizeBBox(pBBox) {
    const INSANELYBIG = 100000;
    if (Math.abs(pBBox.height) > INSANELYBIG || Math.abs(pBBox.width) > INSANELYBIG) {
        return {
            height: 0,
            width: 0,
            x: 0,
            y: 0,
        };
    }
    else {
        return pBBox;
    }
}
function _getBBox(pElement) {
    /* istanbul ignore if */
    if (typeof (pElement.getBBox) === "function") {
        return sanitizeBBox(getNativeBBox(pElement));
    }
    else {
        return {
            height: 15,
            width: 15,
            x: 2,
            y: 2,
        };
    }
}
function _calculateTextHeight() {
    /* Uses a string with some characters that tend to stick out
        * above/ below the current line and an 'astral codepoint' to
        * determine the text height to use everywhere.
        *
        * The astral \uD83D\uDCA9 codepoint mainly makes a difference in gecko based
        * browsers. The string in readable form: ÁjyÎ9ƒ@💩
        */
    return _getBBox(index_1.default.createText("\u00C1jy\u00CE9\u0192@\uD83D\uDCA9", {
        x: 0,
        y: 0,
    })).height;
}
function _removeRenderedSVGFromElement(pElementId) {
    idmanager_1.default.setPrefix(pElementId);
    const lChildElement = gDocument.getElementById(idmanager_1.default.get());
    if (Boolean(lChildElement)) {
        const lParentElement = gDocument.getElementById(pElementId);
        if (lParentElement) {
            lParentElement.removeChild(lChildElement);
        }
        else {
            gDocument.body.removeChild(lChildElement);
        }
    }
}
exports.default = {
    init(pDocument) {
        gDocument = pDocument;
    },
    removeRenderedSVGFromElement: _removeRenderedSVGFromElement,
    /**
     * Returns the bounding box of the passed element.
     *
     * Note: to be able to calculate the actual bounding box of an element it has
     * to be in a DOM tree first. Hence this function temporarily creates the element,
     * calculates the bounding box and removes the temporarily created element again.
     *
     * @param {SVGElement} pElement - the element to calculate the bounding box for
     * @return {boundingbox} an object with properties height, width, x and y. If
     * the function cannot determine the bounding box  be determined, returns 15,15,2,2
     * as "reasonable default"
     */
    getBBox: _getBBox,
    /**
     * Returns the height in pixels necessary for rendering characters
     */
    calculateTextHeight: memoize(_calculateTextHeight),
    // webkit (at least in Safari Version 6.0.5 (8536.30.1) which is
    // distibuted with MacOSX 10.8.4) omits the xmlns: and xlink:
    // namespace prefixes in front of xlink and all hrefs respectively.
    // this function does a crude global replace to circumvent the
    // resulting problems. Problem happens for xhtml too
    webkitNamespaceBugWorkaround(pText) {
        return pText.replace(/ xlink=/g, " xmlns:xlink=")
            .replace(/ href=/g, " xlink:href=");
    },
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
