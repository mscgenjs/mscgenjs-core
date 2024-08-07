"use strict";
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
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				var desc = Object.getOwnPropertyDescriptor(m, k);
				if (
					!desc ||
					("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
				) {
					desc = {
						enumerable: true,
						get: function () {
							return m[k];
						},
					};
				}
				Object.defineProperty(o, k2, desc);
			}
		: function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				o[k2] = m[k];
			});
var __setModuleDefault =
	(this && this.__setModuleDefault) ||
	(Object.create
		? function (o, v) {
				Object.defineProperty(o, "default", { enumerable: true, value: v });
			}
		: function (o, v) {
				o["default"] = v;
			});
var __importStar =
	(this && this.__importStar) ||
	function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null)
			for (var k in mod)
				if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
					__createBinding(result, mod, k);
		__setModuleDefault(result, mod);
		return result;
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
exports.bootstrap = bootstrap;
var svgelementfactory = __importStar(require("./svgelementfactory/index"));
var constants_1 = __importDefault(require("./constants"));
var csstemplates = require("./csstemplates.json");
var gDocument = {};
function setupMarkers(pDefs, pMarkerDefs) {
	pMarkerDefs.forEach(function (pMarker) {
		if (pMarker.type === "method") {
			pDefs.appendChild(
				svgelementfactory.createMarkerPolygon(
					pMarker.name,
					pMarker.path,
					pMarker.color,
				),
			);
		} else {
			pDefs.appendChild(
				svgelementfactory.createMarkerPath(
					pMarker.name,
					pMarker.path,
					pMarker.color,
				),
			);
		}
	});
	return pDefs;
}
function setupStyle(pOptions, pSvgElementId) {
	var lStyle = gDocument.createElement("style");
	lStyle.setAttribute("type", "text/css");
	lStyle.appendChild(
		gDocument.createTextNode(setupStyleElement(pOptions, pSvgElementId)),
	);
	return lStyle;
}
function setupDefs(pElementId, pMarkerDefs, pOptions) {
	/*
	 * definitions - which will include style and markers
	 */
	var lDefs = svgelementfactory.createDefs();
	lDefs.appendChild(setupStyle(pOptions, pElementId));
	lDefs = setupMarkers(lDefs, pMarkerDefs);
	return lDefs;
}
function setupBody(pElementId) {
	var lBody = svgelementfactory.createGroup("".concat(pElementId, "_body"));
	lBody.appendChild(
		svgelementfactory.createGroup("".concat(pElementId, "_background")),
	);
	lBody.appendChild(
		svgelementfactory.createGroup("".concat(pElementId, "_arcspans")),
	);
	lBody.appendChild(
		svgelementfactory.createGroup("".concat(pElementId, "_lifelines")),
	);
	lBody.appendChild(
		svgelementfactory.createGroup("".concat(pElementId, "_sequence")),
	);
	lBody.appendChild(
		svgelementfactory.createGroup("".concat(pElementId, "_notes")),
	);
	lBody.appendChild(
		svgelementfactory.createGroup("".concat(pElementId, "_watermark")),
	);
	return lBody;
}
/**
 * Initializes the document to the document associated with the
 * given pWindow and returns it.
 *
 * @param {window} pWindow
 * @return {document}
 */
function init(pWindow) {
	svgelementfactory.init(pWindow.document, {
		LINE_WIDTH: constants_1.default.LINE_WIDTH,
		FONT_SIZE: constants_1.default.FONT_SIZE,
	});
	return pWindow.document;
}
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
function bootstrap(
	pWindow,
	pParentElement,
	pSvgElementId,
	pMarkerDefs,
	pOptions,
) {
	gDocument = init(pWindow);
	var lSkeletonSvg = svgelementfactory.createSVG(
		pSvgElementId,
		pSvgElementId,
		distillRenderMagic(pOptions),
	);
	if (Boolean(pOptions.source)) {
		lSkeletonSvg.appendChild(setupDesc(pWindow, pOptions.source));
	}
	lSkeletonSvg.appendChild(setupDefs(pSvgElementId, pMarkerDefs, pOptions));
	lSkeletonSvg.appendChild(setupBody(pSvgElementId));
	pParentElement.appendChild(lSkeletonSvg);
	return gDocument;
}
function setupDesc(pWindow, pSource) {
	var lDesc = svgelementfactory.createDesc();
	lDesc.appendChild(
		pWindow.document.createTextNode(
			"\n\n# Generated by mscgen_js - https://sverweij.github.io/mscgen_js\n".concat(
				pSource,
			),
		),
	);
	return lDesc;
}
function findNamedStyle(pAdditionalTemplate) {
	return csstemplates.namedStyles.find(function (tpl) {
		return tpl.name === pAdditionalTemplate;
	});
}
function distillRenderMagic(pOptions) {
	var lRetval = "";
	var lNamedStyle = findNamedStyle(pOptions.additionalTemplate);
	if (Boolean(lNamedStyle)) {
		lRetval = lNamedStyle.renderMagic;
	}
	return lRetval;
}
function composeStyleSheetTemplate(pNamedStyle, pStyleAdditions) {
	return (
		(pNamedStyle.cssBefore || "") +
		csstemplates.baseTemplate +
		(pNamedStyle.cssAfter || "") +
		(pStyleAdditions || "")
	);
}
function setupStyleElement(pOptions, pSvgElementId) {
	var lNamedStyle = findNamedStyle(pOptions.additionalTemplate) || {};
	return composeStyleSheetTemplate(lNamedStyle, pOptions.styleAdditions)
		.replace(/<%=fontSize%>/g, constants_1.default.FONT_SIZE)
		.replace(/<%=lineWidth%>/g, constants_1.default.LINE_WIDTH)
		.replace(/<%=id%>/g, pSvgElementId);
}
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
