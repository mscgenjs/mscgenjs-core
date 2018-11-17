"use strict";
exports.__esModule = true;
exports.SVGNS = "http://www.w3.org/2000/svg";
exports.XLINKNS = "http://www.w3.org/1999/xlink";
var gDocument = {};
/**
 * Takes an element, adds the passed attribute and value to it
 * if the value is truthy and returns the element again
 *
 * @param {element} pElement
 * @param {string} pAttribute
 * @param {string} pValue
 * @return {element}
 */
function setAttribute(pElement, pKey, pValue) {
    if (Boolean(pValue)) {
        pElement.setAttribute(pKey, pValue);
    }
    return pElement;
}
exports.setAttribute = setAttribute;
function setAttributeNS(pElement, pNS, pKey, pValue) {
    if (Boolean(pValue)) {
        pElement.setAttributeNS(pNS, pKey, pValue);
    }
    return pElement;
}
exports.setAttributeNS = setAttributeNS;
/**
 * Takes an element, adds the passed attributes to it if they have
 * a value and returns it.
 *
 * @param {element} pElement
 * @param {object} pAttributes - names/ values object
 * @return {element}
 */
function setAttributes(pElement, pAttributes) {
    Object.keys(pAttributes || {}).forEach(function (pKey) {
        setAttribute(pElement, pKey, pAttributes[pKey]);
    });
    return pElement;
}
exports.setAttributes = setAttributes;
/**
 * Takes an element, adds the passed attributes to it if they have
 * a value and returns it.
 *
 * @param {element} pElement
 * @param {string} pNS - the namespace to use for the attributes
 * @param {object} pAttributes - names/ values object
 * @return {element}
 */
function setAttributesNS(pElement, pNS, pAttributes) {
    Object.keys(pAttributes || {}).forEach(function (pKey) {
        setAttributeNS(pElement, pNS, pKey, pAttributes[pKey]);
    });
    return pElement;
}
exports.setAttributesNS = setAttributesNS;
/**
 * creates the element of type pElementType in the SVG namespace,
 * adds the passed pAttributes to it (see setAttributes)
 * and returns the newly created element
 *
 * @param {string} pElementType
 * @param {object} pAttributes - names/ values object
 * @return {element}
 */
function createElement(pElementType, pAttributes) {
    return setAttributes(gDocument.createElementNS(exports.SVGNS, pElementType), pAttributes);
}
exports.createElement = createElement;
/**
 * creates a textNode, initialized with the pText passed
 *
 * @param {string} pText
 * @return {textNode}
 */
function createTextNode(pText) {
    return gDocument.createTextNode(pText);
}
exports.createTextNode = createTextNode;
/**
 * Function to set the document to use. Introduced to enable use of the
 * rendering utilities under node.js (using the jsdom module)
 *
 * @param {document} pDocument
 */
function init(pDocument) {
    gDocument = pDocument;
}
exports.init = init;
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
