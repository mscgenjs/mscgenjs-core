/**
 * sets up a skeleton svg, with the skeleton for rendering an msc ready
 *
 *  desc with id __msc_source - will contain the msc source
 *  defs
 *      a list of markers used as arrow heads (each with an own id)
 *      a stylesheet (without an id)
 *  __body - a stack of layers, from bottom to top:
 *      __background    -
 *      __arcspanlayer  - for inline expressions ("arc spanning arcs")
 *      __lifelinelayer - for the lifelines
 *      __sequencelayer - for arcs and associated text
 *      __notelayer     - for notes and boxes - the labels of arcspanning arcs
 *                        will go in here as well
 *      __watermark     - the watermark. Contra-intuitively this one
 *                        goes on top.
 * @exports renderskeleton
 * @author {@link https://github.com/sverweij | Sander Verweij}
 */
import svgelementfactory from "./svgelementfactory/index";
import constants from "./constants";
const csstemplates = require("./csstemplates.json");
let gDocument = {};
function setupMarkers(pDefs, pMarkerDefs) {
    pMarkerDefs.forEach((pMarker) => {
        if (pMarker.type === "method") {
            pDefs.appendChild(svgelementfactory.createMarkerPolygon(pMarker.name, pMarker.path, pMarker.color));
        }
        else {
            pDefs.appendChild(svgelementfactory.createMarkerPath(pMarker.name, pMarker.path, pMarker.color));
        }
    });
    return pDefs;
}
function setupStyle(pOptions, pSvgElementId) {
    const lStyle = gDocument.createElement("style");
    lStyle.setAttribute("type", "text/css");
    lStyle.appendChild(gDocument.createTextNode(setupStyleElement(pOptions, pSvgElementId)));
    return lStyle;
}
function setupDefs(pElementId, pMarkerDefs, pOptions) {
    /*
        * definitions - which will include style and markers
        */
    let lDefs = svgelementfactory.createDefs();
    lDefs.appendChild(setupStyle(pOptions, pElementId));
    lDefs = setupMarkers(lDefs, pMarkerDefs);
    return lDefs;
}
function setupBody(pElementId) {
    const lBody = svgelementfactory.createGroup(`${pElementId}_body`);
    lBody.appendChild(svgelementfactory.createGroup(`${pElementId}_background`));
    lBody.appendChild(svgelementfactory.createGroup(`${pElementId}_arcspans`));
    lBody.appendChild(svgelementfactory.createGroup(`${pElementId}_lifelines`));
    lBody.appendChild(svgelementfactory.createGroup(`${pElementId}_sequence`));
    lBody.appendChild(svgelementfactory.createGroup(`${pElementId}_notes`));
    lBody.appendChild(svgelementfactory.createGroup(`${pElementId}_watermark`));
    return lBody;
}
function _init(pWindow) {
    svgelementfactory.init(pWindow.document, {
        LINE_WIDTH: constants.LINE_WIDTH,
        FONT_SIZE: constants.FONT_SIZE,
    });
    return pWindow.document;
}
function bootstrap(pWindow, pParentElement, pSvgElementId, pMarkerDefs, pOptions) {
    gDocument = _init(pWindow);
    const lSkeletonSvg = svgelementfactory.createSVG(pSvgElementId, pSvgElementId, distillRenderMagic(pOptions));
    if (Boolean(pOptions.source)) {
        lSkeletonSvg.appendChild(setupDesc(pWindow, pOptions.source));
    }
    lSkeletonSvg.appendChild(setupDefs(pSvgElementId, pMarkerDefs, pOptions));
    lSkeletonSvg.appendChild(setupBody(pSvgElementId));
    pParentElement.appendChild(lSkeletonSvg);
    return gDocument;
}
function setupDesc(pWindow, pSource) {
    const lDesc = svgelementfactory.createDesc();
    lDesc.appendChild(pWindow.document.createTextNode(`\n\n# Generated by mscgen_js - https://sverweij.github.io/mscgen_js\n${pSource}`));
    return lDesc;
}
function findNamedStyle(pAdditionalTemplate) {
    return csstemplates.namedStyles.find((tpl) => tpl.name === pAdditionalTemplate);
}
function distillRenderMagic(pOptions) {
    let lRetval = "";
    const lNamedStyle = findNamedStyle(pOptions.additionalTemplate);
    if (Boolean(lNamedStyle)) {
        lRetval = lNamedStyle.renderMagic;
    }
    return lRetval;
}
function composeStyleSheetTemplate(pNamedStyle, pStyleAdditions) {
    return (pNamedStyle.cssBefore || "") +
        csstemplates.baseTemplate +
        (pNamedStyle.cssAfter || "") +
        (pStyleAdditions || "");
}
function setupStyleElement(pOptions, pSvgElementId) {
    const lNamedStyle = findNamedStyle(pOptions.additionalTemplate) || {};
    return (composeStyleSheetTemplate(lNamedStyle, pOptions.styleAdditions))
        .replace(/<%=fontSize%>/g, constants.FONT_SIZE)
        .replace(/<%=lineWidth%>/g, constants.LINE_WIDTH)
        .replace(/<%=id%>/g, pSvgElementId);
}
export default {
    /**
     * Sets up a skeleton svg document with id pSvgElementId in the dom element
     * pParentElement, both in window pWindow. See the module
     * documentation for details on the structure of the skeleton.
     *
     * @param {string} pParentElement
     * @param {string} pSvgElementId
     * @param {object} pMarkerDefs
     * @param {string} pStyleAdditions
     * @param {window} pWindow
     * @param {options} pOptions
     *        source - the source code (string),
     *        additionalTemplate - string identifying a named style
     *
     */
    bootstrap,
    /**
     * Initializes the document to the document associated with the
     * given pWindow and returns it.
     *
     * @param {window} pWindow
     * @return {document}
     */
    init: _init,
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