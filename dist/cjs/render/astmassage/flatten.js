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
exports.nameAsLabel = nameAsLabel;
exports.swapRTLArc = swapRTLArc;
exports.overrideColors = overrideColors;
exports.normalize = normalize;
exports.flatten = flatten;
/**
 * Defines some functions to simplify a given abstract syntax tree.
 */
var asttransform_1 = __importDefault(require("./asttransform"));
var escape = __importStar(require("../textutensils/escape"));
var aggregatekind_1 = __importDefault(require("./aggregatekind"));
var normalizekind_1 = __importDefault(require("./normalizekind"));
var normalizeoptions_1 = __importDefault(require("./normalizeoptions"));
var gMaxDepth = 0;
/**
 * If the entity has no label, set the label of the entity to its name
 */
function nameAsLabel(pEntity) {
	if (typeof pEntity.label === "undefined") {
		pEntity.label = pEntity.name;
	}
}
function unescapeLabels(pArcOrEntity) {
	if (!!pArcOrEntity.label) {
		pArcOrEntity.label = escape.unescapeString(pArcOrEntity.label);
	}
	if (!!pArcOrEntity.id) {
		pArcOrEntity.id = escape.unescapeString(pArcOrEntity.id);
	}
}
function emptyStringForNoLabel(pArc) {
	pArc.label = Boolean(pArc.label) ? pArc.label : "";
}
/**
 * If the arc is "facing backwards" (right to left) this function sets the arc
 * kind to the left to right variant (e.g. <= becomes =>) and swaps the operands
 * resulting in an equivalent (b << a becomes a >> b).
 *
 * If the arc is facing forwards or is symetrical, it is left alone.
 */
function swapRTLArc(pArc) {
	if ((0, normalizekind_1.default)(pArc.kind) !== pArc.kind) {
		pArc.kind = (0, normalizekind_1.default)(pArc.kind);
		var lTmp = pArc.from;
		pArc.from = pArc.to;
		pArc.to = lTmp;
	}
}
function overrideColorsFromThing(pArc, pThing) {
	if (!pArc.linecolor && pThing.arclinecolor) {
		pArc.linecolor = pThing.arclinecolor;
	}
	if (!pArc.textcolor && pThing.arctextcolor) {
		pArc.textcolor = pThing.arctextcolor;
	}
	if (!pArc.textbgcolor && pThing.arctextbgcolor) {
		pArc.textbgcolor = pThing.arctextbgcolor;
	}
}
/*
 * assumes arc direction to be either LTR, both, or none
 * so arc.from exists.
 */
function overrideColors(pArc, pEntities) {
	if (pEntities === void 0) {
		pEntities = [];
	}
	if (pArc && pArc.from) {
		var lMatchingEntity = pEntities.find(function (pEntity) {
			return pEntity.name === pArc.from;
		});
		if (!!lMatchingEntity) {
			overrideColorsFromThing(pArc, lMatchingEntity);
		}
	}
}
function calcNumberOfRows(pInlineExpression) {
	return pInlineExpression.arcs.reduce(function (pSum, pArc) {
		return pSum + (Boolean(pArc[0].arcs) ? calcNumberOfRows(pArc[0]) + 1 : 0);
	}, pInlineExpression.arcs.length);
}
function unwindArcRow(pArcRow, pDepth, pFrom, pTo) {
	var lRetval = [];
	var lFlatArcRow = [];
	var lUnWoundSubArcs = [];
	pArcRow.forEach(function (pArc) {
		pArc.isVirtual = false;
		if ("inline_expression" === (0, aggregatekind_1.default)(pArc.kind)) {
			pArc.depth = pDepth;
			pArc.isVirtual = true;
			if (!!pArc.arcs) {
				var lInlineExpression_1 = structuredClone(pArc);
				lInlineExpression_1.numberofrows =
					calcNumberOfRows(lInlineExpression_1);
				delete lInlineExpression_1.arcs;
				lFlatArcRow.push(lInlineExpression_1);
				pArc.arcs.forEach(function (pSubArcRow) {
					lUnWoundSubArcs = lUnWoundSubArcs.concat(
						unwindArcRow(
							pSubArcRow,
							pDepth + 1,
							lInlineExpression_1.from,
							lInlineExpression_1.to,
						),
					);
					pSubArcRow.forEach(function (pSubArc) {
						overrideColorsFromThing(pSubArc, lInlineExpression_1);
					});
				});
				if (pDepth > gMaxDepth) {
					gMaxDepth = pDepth;
				}
			} else {
				lFlatArcRow.push(pArc);
			}
			lUnWoundSubArcs.push([
				{
					kind: "|||",
					from: pArc.from,
					to: pArc.to,
					// label: "",
					// depth: pDepth,
					isVirtual: true,
				},
			]);
		} else {
			if (pFrom && pTo && "empty" === (0, aggregatekind_1.default)(pArc.kind)) {
				pArc.from = pFrom;
				pArc.to = pTo;
				pArc.depth = pDepth;
			}
			lFlatArcRow.push(pArc);
		}
	});
	lRetval.push(lFlatArcRow);
	return lRetval.concat(lUnWoundSubArcs);
}
function unwind(pArcRows) {
	if (pArcRows) {
		return pArcRows.reduce(function (pAll, pArcRow) {
			return pAll.concat(unwindArcRow(pArcRow, 0));
		}, []);
	}
	return [];
}
/**
 * Flattens any recursion in the arcs of the given abstract syntax tree to make it
 * more easy to render.
 */
function normalize(pAST) {
	gMaxDepth = 0;
	return {
		options: (0, normalizeoptions_1.default)(pAST.options),
		// @ts-expect-error whatever
		entities: structuredClone(pAST.entities),
		arcs: unwind(pAST.arcs),
		depth: gMaxDepth + 1,
	};
}
/**
 * Simplifies an AST:
 *    - entities without a label get one (the name of the label)
 *    - arc directions get unified to always go forward
 *      (e.g. for a <- b swap entities and reverse direction so it becomes a -> b)
 *    - explodes broadcast arcs
 *    - flattens any recursion (see the {@linkcode unwind} function in
 *      in this module)
 *    - distributes arc*color from the entities to the affected arcs
 */
function flatten(pAST) {
	return normalize(
		(0, asttransform_1.default)(
			pAST,
			[nameAsLabel, unescapeLabels],
			[swapRTLArc, overrideColors, unescapeLabels, emptyStringForNoLabel],
		),
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
