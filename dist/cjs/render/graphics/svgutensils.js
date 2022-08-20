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
exports.__esModule = true;
exports.webkitNamespaceBugWorkaround = exports.calculateTextHeight = exports.init = exports.removeRenderedSVGFromElement = exports.getBBox = void 0;
var memoize_1 = __importDefault(require("lodash/memoize"));
var idmanager = __importStar(require("./idmanager"));
var svgelementfactory = __importStar(require("./svgelementfactory/index"));
/**
 * Some SVG specific calculations & workarounds
 */
var gDocument = {};
var gSvgBBoxerId = idmanager.get("bboxer");
/* istanbul ignore next */
function _createBBoxerSVG(pId) {
    var lSvg = svgelementfactory.createSVG(pId, idmanager.get());
    gDocument.body.appendChild(lSvg);
    return lSvg;
}
/* istanbul ignore next */
function getNativeBBox(pElement) {
    /* getNativeBBoxWithCache */
    var lSvg = gDocument.getElementById(gSvgBBoxerId);
    lSvg = lSvg ? lSvg : _createBBoxerSVG(gSvgBBoxerId);
    lSvg.appendChild(pElement);
    var lRetval = pElement.getBBox();
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
    var INSANELYBIG = 100000;
    if (Math.abs(pBBox.height) > INSANELYBIG ||
        Math.abs(pBBox.width) > INSANELYBIG) {
        return {
            height: 0,
            width: 0,
            x: 0,
            y: 0
        };
    }
    else {
        return pBBox;
    }
}
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
function getBBox(pElement) {
    /* istanbul ignore if */
    if (typeof pElement.getBBox === "function") {
        return sanitizeBBox(getNativeBBox(pElement));
    }
    else {
        return {
            height: 15,
            width: 15,
            x: 2,
            y: 2
        };
    }
}
exports.getBBox = getBBox;
function _calculateTextHeight() {
    /* Uses a string with some characters that tend to stick out
     * above/ below the current line and an 'astral codepoint' to
     * determine the text height to use everywhere.
     *
     * The astral \uD83D\uDCA9 codepoint mainly makes a difference in gecko based
     * browsers. The string in readable form: ÁjyÎ9ƒ@💩
     */
    return getBBox(svgelementfactory.createText("\u00C1jy\u00CE9\u0192@\uD83D\uDCA9", {
        x: 0,
        y: 0
    })).height;
}
function removeRenderedSVGFromElement(pElementId) {
    idmanager.setPrefix(pElementId);
    var lChildElement = gDocument.getElementById(idmanager.get());
    if (Boolean(lChildElement)) {
        var lParentElement = gDocument.getElementById(pElementId);
        if (lParentElement) {
            lParentElement.removeChild(lChildElement);
        }
        else {
            gDocument.body.removeChild(lChildElement);
        }
    }
}
exports.removeRenderedSVGFromElement = removeRenderedSVGFromElement;
var init = function (pDocument) {
    gDocument = pDocument;
};
exports.init = init;
/**
 * Returns the height in pixels necessary for rendering characters
 */
exports.calculateTextHeight = (0, memoize_1["default"])(_calculateTextHeight);
// webkit (at least in Safari Version 6.0.5 (8536.30.1) which is
// distibuted with MacOSX 10.8.4) omits the xmlns: and xlink:
// namespace prefixes in front of xlink and all hrefs respectively.
// this function does a crude global replace to circumvent the
// resulting problems. Problem happens for xhtml too
var webkitNamespaceBugWorkaround = function (pText) {
    return pText
        .replace(/ xlink=/g, " xmlns:xlink=")
        .replace(/ href=/g, " xlink:href=");
};
exports.webkitNamespaceBugWorkaround = webkitNamespaceBugWorkaround;
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
