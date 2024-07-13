"use strict";
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
exports.createSingleLine = createSingleLine;
exports.createNote = createNote;
exports.createRect = createRect;
exports.createABox = createABox;
exports.createRBox = createRBox;
exports.createEdgeRemark = createEdgeRemark;
exports.createDoubleLine = createDoubleLine;
var curvestringfactory_1 = require("./curvestringfactory");
var helpers_1 = require("./helpers");
var round_1 = __importDefault(require("../round"));
var svgprimitives = __importStar(require("../svgprimitives"));
var variationhelpers = __importStar(require("../variationhelpers"));
function createSingleLine(pLine, pOptions) {
	if (pOptions === void 0) {
		pOptions = {};
	}
	var lDir = variationhelpers.getDirection(pLine);
	return svgprimitives.createPath(
		svgprimitives.pathPoint2String("M", pLine.xFrom, pLine.yFrom) +
			// Workaround; gecko and webkit treat markers slapped on the
			// start of a path with 'auto' different from each other when
			// there's not a line at the start and the path is not going
			// from exactly left to right (gecko renders the marker
			// correctly, whereas webkit will ignore auto and show the
			// marker in its default position)
			//
			// Adding a little stubble at the start of the line solves
			// all that.
			svgprimitives.pathPoint2String(
				"L",
				(0, round_1.default)(
					pLine.xFrom + lDir.signX * Math.sqrt(1 / (1 + Math.pow(lDir.dy, 2))),
					2,
				),
				pLine.yFrom +
					lDir.signY *
						(Math.abs(lDir.dy) === Infinity
							? 1
							: (0, round_1.default)(
									Math.sqrt(Math.pow(lDir.dy, 2) / (1 + Math.pow(lDir.dy, 2))),
									2,
								)),
			) +
			(0, helpers_1.line2CurveString)(pLine),
		pOptions,
	);
}
function createNote(pBBox, pOptions) {
	var lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
	var lFoldSize = Math.max(9, Math.min(4.5 * lLineWidth, pBBox.height / 2));
	var lGroup = svgprimitives.createGroup();
	lGroup.appendChild(
		svgprimitives.createPath(
			(0, curvestringfactory_1.renderNotePathString)(pBBox, lFoldSize),
			pOptions,
		),
	);
	pOptions.bgColor = "transparent";
	lGroup.appendChild(
		svgprimitives.createPath(
			(0, curvestringfactory_1.renderNoteCornerString)(pBBox, lFoldSize),
			pOptions,
		),
	);
	return lGroup;
}
function createRect(pBBox, pOptions) {
	return svgprimitives.createPath(
		(0, curvestringfactory_1.rbox2CurveString)(pBBox, 0),
		pOptions,
	);
}
function createABox(pBBox, pOptions) {
	var lSlopeOffset = 3;
	return svgprimitives.createPath(
		(0, curvestringfactory_1.abox2CurveString)(pBBox, lSlopeOffset),
		pOptions,
	);
}
function createRBox(pBBox, pOptions) {
	return svgprimitives.createPath(
		(0, curvestringfactory_1.rbox2CurveString)(pBBox, 6),
		pOptions,
	);
}
function createEdgeRemark(pBBox, pOptions) {
	var lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
	var lGroup = svgprimitives.createGroup();
	var lFoldSize = pOptions && pOptions.foldSize ? pOptions.foldSize : 7;
	var lLineColor = pOptions && pOptions.color ? pOptions.color : "black";
	pOptions.color = "transparent!important"; /* :blush: */
	var lBackground = svgprimitives.createPath(
		svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + lLineWidth / 2) +
			// top line:
			svgprimitives.pathPoint2String(
				"L",
				pBBox.x + pBBox.width,
				pBBox.y + lLineWidth / 2,
			) +
			// down:
			svgprimitives.pathPoint2String(
				"L",
				pBBox.x + pBBox.width,
				pBBox.y + pBBox.height - lFoldSize,
			) +
			// fold:
			svgprimitives.pathPoint2String(
				"L",
				pBBox.x + pBBox.width - lFoldSize,
				pBBox.y + pBBox.height,
			) +
			// bottom line:
			svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
			"z",
		pOptions,
	);
	pOptions.bgColor = "transparent";
	pOptions.color = lLineColor;
	var lLine = svgprimitives.createPath(
		// start:
		(0, curvestringfactory_1.edgeRemark2CurveString)(pBBox, lFoldSize),
		pOptions,
	);
	lGroup.appendChild(lBackground);
	lGroup.appendChild(lLine);
	return lGroup;
}
function createDoubleLine(pLine, pOptions) {
	return svgprimitives.createPath(
		(0, curvestringfactory_1.doubleLine2CurveString)(pLine, pOptions),
		{
			class: pOptions.class,
		},
	);
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
