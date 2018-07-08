"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SVGNS = "http://www.w3.org/2000/svg";
const XLINKNS = "http://www.w3.org/1999/xlink";
let gDocument = {};
function _setAttribute(pElement, pKey, pValue) {
    if (Boolean(pValue)) {
        pElement.setAttribute(pKey, pValue);
    }
    return pElement;
}
function _setAttributeNS(pElement, pNS, pKey, pValue) {
    if (Boolean(pValue)) {
        pElement.setAttributeNS(pNS, pKey, pValue);
    }
    return pElement;
}
function _setAttributes(pElement, pAttributes) {
    Object.keys(pAttributes || {}).forEach((pKey) => {
        _setAttribute(pElement, pKey, pAttributes[pKey]);
    });
    return pElement;
}
function _setAttributesNS(pElement, pNS, pAttributes) {
    Object.keys(pAttributes || {}).forEach((pKey) => {
        _setAttributeNS(pElement, pNS, pKey, pAttributes[pKey]);
    });
    return pElement;
}
function _createElement(pElementType, pAttributes) {
    return _setAttributes(gDocument.createElementNS(SVGNS, pElementType), pAttributes);
}
function _createTextNode(pText) {
    return gDocument.createTextNode(pText);
}
exports.default = {
    SVGNS,
    XLINKNS,
    /**
     * Function to set the document to use. Introduced to enable use of the
     * rendering utilities under node.js (using the jsdom module)
     *
     * @param {document} pDocument
     */
    init(pDocument) {
        gDocument = pDocument;
    },
    /**
     * Takes an element, adds the passed attribute and value to it
     * if the value is truthy and returns the element again
     *
     * @param {element} pElement
     * @param {string} pAttribute
     * @param {string} pValue
     * @return {element}
     */
    setAttribute: _setAttribute,
    /**
     * Takes an element, adds the passed attributes to it if they have
     * a value and returns it.
     *
     * @param {element} pElement
     * @param {object} pAttributes - names/ values object
     * @return {element}
     */
    setAttributes: _setAttributes,
    /**
     * Takes an element, adds the passed attributes to it if they have
     * a value and returns it.
     *
     * @param {element} pElement
     * @param {string} pNS - the namespace to use for the attributes
     * @param {object} pAttributes - names/ values object
     * @return {element}
     */
    setAttributesNS: _setAttributesNS,
    /**
     * creates the element of type pElementType in the SVG namespace,
     * adds the passed pAttributes to it (see setAttributes)
     * and returns the newly created element
     *
     * @param {string} pElementType
     * @param {object} pAttributes - names/ values object
     * @return {element}
     */
    createElement: _createElement,
    /**
     * creates a textNode, initialized with the pText passed
     *
     * @param {string} pText
     * @return {textNode}
     */
    createTextNode: _createTextNode,
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
