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
	(function () {
		var ownKeys = function (o) {
			ownKeys =
				Object.getOwnPropertyNames ||
				function (o) {
					var ar = [];
					for (var k in o)
						if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
					return ar;
				};
			return ownKeys(o);
		};
		return function (mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null)
				for (var k = ownKeys(mod), i = 0; i < k.length; i++)
					if (k[i] !== "default") __createBinding(result, mod, k[i]);
			__setModuleDefault(result, mod);
			return result;
		};
	})();
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLabel = createLabel;
exports.splitLabel = splitLabel;
const aggregatekind_1 = __importDefault(require("../astmassage/aggregatekind"));
const wrap_1 = __importDefault(require("../textutensils/wrap"));
const constants_1 = __importDefault(require("./constants"));
const kind2class = __importStar(require("./kind2class"));
const svgelementfactory = __importStar(require("./svgelementfactory/index"));
const svgutensils = __importStar(require("./svgutensils"));
/**
 * Sets the fill color of the passed pElement to the textcolor of
 * the given pArc
 *
 * @param <svgElement> pElement
 * @param <string> pTextColor
 */
function colorText(pElement, pTextColor) {
	if (pTextColor) {
		pElement.setAttribute("style", `fill:${pTextColor};`);
	}
	return pElement;
}
/**
 * Makes the text color blue if there is an url and no text color
 */
function colorLink(pElement, pUrl, pTextColor) {
	return colorText(pElement, pUrl && !pTextColor ? "blue" : pTextColor);
}
function renderArcLabelLineBackground(lLabelElement, pTextbgcolor) {
	const lRect = svgelementfactory.createRect(
		svgutensils.getBBox(lLabelElement),
		{ class: "label-text-background" },
	);
	if (pTextbgcolor) {
		lRect.setAttribute(
			"style",
			`fill:${pTextbgcolor}; stroke:${pTextbgcolor};`,
		);
	}
	return lRect;
}
function renderLabelText(pLine, pPosition, pCoords, pClass, pArc) {
	const lAttributes =
		pPosition === 0
			? {
					class: pClass,
					url: pArc.url,
					id: pArc.id,
					idurl: pArc.idurl,
				}
			: {
					class: pClass,
					url: pArc.url,
				};
	return svgelementfactory.createText(pLine, pCoords, lAttributes);
}
function determineClasses(pArcKind, pPostFix) {
	const lKind = pArcKind;
	const lClass = kind2class.getClass(lKind);
	const lAggregateClass = kind2class.getAggregateClass(lKind);
	return lClass === lAggregateClass
		? lClass + pPostFix
		: lAggregateClass + pPostFix + lClass + pPostFix;
}
function createLabelLine(pLine, pMiddle, pStartY, pArc, pLineNumber, pOptions) {
	let lY = pStartY + (pLineNumber + 1 / 4) * svgutensils.calculateTextHeight();
	let lClass = determineClasses(pArc.kind, "-text ");
	if (pOptions.alignLeft) {
		lClass += "anchor-start ";
	}
	if (pOptions.alignAround) {
		lY =
			pStartY +
			(pLineNumber + 1 / 4) *
				(svgutensils.calculateTextHeight() + constants_1.default.LINE_WIDTH);
	}
	return colorLink(
		colorText(
			renderLabelText(pLine, pLineNumber, { x: pMiddle, y: lY }, lClass, pArc),
			pArc.textcolor,
		),
		pArc.url,
		pArc.textcolor,
	);
}
function insertEmptyLines(pLines, pOptions) {
	if (pOptions.alignAbove) {
		pLines.forEach(() => {
			pLines.push("");
		});
	}
	if (pOptions.alignAround && pLines.length === 1) {
		pLines.push("");
	}
	return pLines;
}
function determineLabelTop(pLines, pDims, pOptions) {
	if (pOptions.alignAround) {
		return (
			pDims.y -
			((pLines.length - 1) / 2) *
				(svgutensils.calculateTextHeight() + constants_1.default.LINE_WIDTH + 1)
		);
	} else {
		return (
			pDims.y -
			((pLines.length - 1) / 2) * (svgutensils.calculateTextHeight() + 1)
		);
	}
}
/**
 * createLabel() - renders the text (label, id, url) for a given pArc
 * with a bounding box starting at pStartX, pStartY and of a width of at
 * most pWidth (all in pixels)
 *
 * @param <string> - pId - the unique identification of the textlabe (group) within the svg
 * @param <object> - pArc - the arc of which to render the text
 * @param <object> - pDims - x and y to start on and a width
 * @param <object> - pOptions - alignAbove, alignLeft, alignAround, wordWrapArcs, ownBackground, underline
 */
function createLabel(pArc, pDims, pOptions, pId) {
	const lGroup = svgelementfactory.createGroup(pId);
	pOptions = pOptions || {};
	if (pArc.label) {
		const lMiddle = pDims.x + pDims.width / 2;
		const lLines = insertEmptyLines(
			splitLabel(
				pArc.label,
				pArc.kind,
				pDims.width,
				constants_1.default.FONT_SIZE,
				pOptions,
			),
			pOptions,
		);
		let lLabelTop = determineLabelTop(lLines, pDims, pOptions);
		lLines.forEach((pLine, pLineNumber) => {
			if (pLine !== "") {
				const lText = createLabelLine(
					pLine,
					lMiddle,
					lLabelTop,
					pArc,
					pLineNumber,
					pOptions,
				);
				if (pOptions.ownBackground) {
					lGroup.appendChild(
						renderArcLabelLineBackground(lText, pArc.textbgcolor),
					);
				}
				lGroup.appendChild(lText);
			}
			lLabelTop++;
		});
	}
	return lGroup;
}
/**
 * Determine the number characters that fit within pWidth amount
 * of pixels.
 *
 * Uses heuristics that work for 9pt/12px Helvetica in svg's.
 * TODO: make more generic, or use an algorithm that
 *       uses the real width of the text under discourse
 *       (e.g. using its BBox; although I fear this
 *        to be expensive)
 * @param {string} pWidth - the amount to calculate the # characters
 *        to fit in for
 * @param {number} - pFontSize (in px)
 * @return {number} - The maxumum number of characters that'll fit
 */
function _determineMaxTextWidthInChars(pWidth, pFontSize) {
	const lAbsWidth = Math.abs(pWidth);
	const REFERENCE_FONT_SIZE = 12; // px
	if (lAbsWidth <= 160) {
		return lAbsWidth / ((pFontSize / REFERENCE_FONT_SIZE) * 8);
	}
	if (lAbsWidth <= 320) {
		return lAbsWidth / ((pFontSize / REFERENCE_FONT_SIZE) * 6.4);
	}
	if (lAbsWidth <= 480) {
		return lAbsWidth / ((pFontSize / REFERENCE_FONT_SIZE) * 5.9);
	}
	return lAbsWidth / ((pFontSize / REFERENCE_FONT_SIZE) * 5.6);
}
function isWrappableBox(pKind, pWordWrapBoxes) {
	return "box" === (0, aggregatekind_1.default)(pKind) && pWordWrapBoxes;
}
function isWrappableEntity(pKind, pWordWrapEntites) {
	return "entity" === pKind && pWordWrapEntites;
}
function isWrappableArc(pKind, pWordWrapArcs) {
	return (
		"box" !== (0, aggregatekind_1.default)(pKind) &&
		"entity" !== pKind &&
		pWordWrapArcs
	);
}
function labelIsWrappable(pKind /*ArcKindType*/, pOptions) {
	return (
		isWrappableBox(pKind, pOptions.wordwrapboxes) ||
		isWrappableEntity(pKind, pOptions.wordwrapentities) ||
		isWrappableArc(pKind, pOptions.wordwraparcs) ||
		typeof pKind === "undefined"
	);
}
/**
 * splitLabel () - splits the given pLabel into an array of strings
 * - if the arc kind passed is a box the split occurs regardless
 * - if the arc kind passed is something else, the split occurs
 *   only if the _word wrap arcs_ option is true.
 *
 * @param <string> - pLabel
 * @param <string> - pKind
 * @param <number> - pWidth
 * @param <number> - pFontSize (in px)
 * @param <object> - options (the one ones heeded: wordwraparcs, wordwrapentities, wordwrapboxes)
 * @return <array of strings> - lLines
 */
function splitLabel(pLabel, pKind, pWidth, pFontSize, pOptions) {
	if (labelIsWrappable(pKind, pOptions)) {
		return (0, wrap_1.default)(
			pLabel,
			_determineMaxTextWidthInChars(pWidth, pFontSize),
		);
	} else {
		return pLabel.split("\\n");
	}
}
