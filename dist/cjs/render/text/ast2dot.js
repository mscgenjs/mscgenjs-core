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
exports.explodeBroadcasts = explodeBroadcasts;
exports.render = render;
var aggregatekind_1 = __importDefault(require("../astmassage/aggregatekind"));
var asttransform_1 = __importDefault(require("../astmassage/asttransform"));
var flatten = __importStar(require("../astmassage/flatten"));
var wrap_1 = __importDefault(require("../textutensils/wrap"));
var dotMappings = __importStar(require("./dotMappings"));
var INDENT = "  ";
var MAX_TEXT_WIDTH = 40;
var gCounter = 0;
/* Attribute handling */
function renderString(pString) {
	var lStringAry = (0, wrap_1.default)(
		pString.replace(/"/g, '\\"'),
		MAX_TEXT_WIDTH,
	);
	var lString = lStringAry.slice(0, -1).reduce(function (pPrev, pLine) {
		return "".concat(pPrev + pLine, "\n");
	}, "");
	lString += lStringAry.slice(-1);
	return lString;
}
function renderAttribute(pAttr, pString) {
	return "".concat(pString, '="').concat(renderString(pAttr), '"');
}
function pushAttribute(pArray, pAttr, pString) {
	if (Boolean(pAttr)) {
		pArray.push(renderAttribute(pAttr, pString));
	}
}
function translateAttributes(pThing) {
	return ["label", "color", "fontcolor", "fillcolor"]
		.filter(function (pSupportedAttr) {
			return Boolean(pThing[pSupportedAttr]);
		})
		.map(function (pSupportedAttr) {
			return renderAttribute(pThing[pSupportedAttr], pSupportedAttr);
		});
}
function renderAttributeBlock(pAttrs) {
	var lRetVal = "";
	// no need to check whether there's > 0 attribute passed here:
	// - entities have a mandatory 'name' attribute,
	// - arcs have a mandatory 'kind' attribute
	lRetVal = pAttrs.slice(0, -1).reduce(function (pPrev, pAttr) {
		return "".concat(pPrev + pAttr, ", ");
	}, " [");
	lRetVal += "".concat(pAttrs.slice(-1), "]");
	return lRetVal;
}
/* Entity handling */
function renderEntityName(pString) {
	return '"'.concat(pString, '"');
}
function renderEntity(pEntity) {
	return (
		renderEntityName(pEntity.name) +
		renderAttributeBlock(translateAttributes(pEntity))
	);
}
function renderEntities(pEntities) {
	return pEntities.reduce(function (pPrev, pEntity) {
		return "".concat(pPrev + INDENT + renderEntity(pEntity), ";\n");
	}, "");
}
/* ArcLine handling */
function counterizeLabel(pCounter, pLabel) {
	if (pLabel) {
		return "(".concat(pCounter, ") ").concat(pLabel);
	} else {
		return "(".concat(pCounter, ")");
	}
}
function renderBoxArc(pArc, pCounter, pIndent) {
	var lRetVal = "";
	var lBoxName = "box".concat(pCounter.toString());
	lRetVal += lBoxName;
	var lAttrs = translateAttributes(pArc);
	pushAttribute(lAttrs, dotMappings.getStyle(pArc.kind), "style");
	pushAttribute(lAttrs, dotMappings.getShape(pArc.kind), "shape");
	lRetVal += ""
		.concat(renderAttributeBlock(lAttrs), "\n")
		.concat(INDENT)
		.concat(pIndent);
	lAttrs = [];
	pushAttribute(lAttrs, "dotted", "style");
	pushAttribute(lAttrs, "none", "dir");
	lRetVal += ""
		.concat(lBoxName, " -- {")
		.concat(renderEntityName(pArc.from), ",")
		.concat(renderEntityName(pArc.to), "}");
	lRetVal += renderAttributeBlock(lAttrs);
	return lRetVal;
}
function renderRegularArc(pArc, pAggregatedKind, pCounter) {
	var lRetVal = "";
	pArc.label = counterizeLabel(pCounter, pArc.label);
	var lAttrs = translateAttributes(pArc);
	pushAttribute(lAttrs, dotMappings.getStyle(pArc.kind), "style");
	switch (pAggregatedKind) {
		case "directional":
			pushAttribute(lAttrs, dotMappings.getArrow(pArc.kind), "arrowhead");
			break;
		case "bidirectional":
			pushAttribute(lAttrs, dotMappings.getArrow(pArc.kind), "arrowhead");
			pushAttribute(lAttrs, dotMappings.getArrow(pArc.kind), "arrowtail");
			pushAttribute(lAttrs, "both", "dir");
			break;
		case "nondirectional":
			pushAttribute(lAttrs, "none", "dir");
			break;
		default:
			break;
	}
	if (!pArc.arcs) {
		lRetVal += "".concat(renderEntityName(pArc.from), " ");
		lRetVal += "--";
		lRetVal += " ".concat(renderEntityName(pArc.to));
		lRetVal += renderAttributeBlock(lAttrs);
	}
	return lRetVal;
}
function renderSingleArc(pArc, pCounter, pIndent) {
	var lRetVal = "";
	var lAggregatedKind = (0, aggregatekind_1.default)(pArc.kind);
	if (lAggregatedKind === "box") {
		lRetVal += renderBoxArc(pArc, pCounter, pIndent);
	} else {
		lRetVal += renderRegularArc(pArc, lAggregatedKind, pCounter);
	}
	return lRetVal;
}
function renderArc(pArc, pIndent) {
	var lRetVal = "";
	if (pArc.from && pArc.to) {
		lRetVal += "".concat(
			INDENT + pIndent + renderSingleArc(pArc, ++gCounter, pIndent),
			"\n",
		);
		if (pArc.arcs) {
			lRetVal += ""
				.concat(INDENT + pIndent, "subgraph cluster_")
				.concat(gCounter.toString(), "{");
			// not checking for pArc.label because there's at least a counter in it
			// at this point
			lRetVal += "\n"
				.concat(INDENT)
				.concat(pIndent, ' label="')
				.concat(pArc.kind, ": ")
				.concat(pArc.label, '" labeljust="l"\n');
			lRetVal += renderArcLines(pArc.arcs, pIndent + INDENT);
			lRetVal += "".concat(INDENT + pIndent, "}\n");
		}
	}
	return lRetVal;
}
function renderArcLines(pArcLines, pIndent) {
	return pArcLines.reduce(function (pPrevArcLine, pNextArcLine) {
		return (
			pPrevArcLine +
			pNextArcLine.reduce(function (pPrevArc, pNextArc) {
				return pPrevArc + renderArc(pNextArc, pIndent);
			}, "")
		);
	}, "");
}
function explodeBroadcastArc(pEntities, pArc) {
	return pEntities
		.filter(function (pEntity) {
			return pArc.from !== pEntity.name;
		})
		.map(function (pEntity) {
			pArc.to = pEntity.name;
			return structuredClone(pArc);
		});
}
/**
 * - Gives each entity a label
 * - Sets arc kinds from left to right where applicable
 * - pre-calculates colors from regular colors and arc*-colors
 */
function flattenMe(pAST) {
	return explodeBroadcasts(
		(0, asttransform_1.default)(
			pAST,
			[flatten.nameAsLabel],
			[flatten.swapRTLArc, flatten.overrideColors],
		),
	);
}
/**
 * expands "broadcast" arcs to its individual counterparts
 * Example in mscgen:
 *     a -> *;
 * output:
 *     a -> b, a -> c, a -> d;
 */
function explodeBroadcasts(pAST) {
	if (pAST.arcs) {
		pAST.arcs.forEach(function (pArcRow, pArcRowIndex) {
			pArcRow
				// this assumes swap has been done already
				// and "*" is in no 'from'  anymore
				.filter(function (pArc) {
					return pArc.to === "*";
				})
				.forEach(function (pArc, pArcIndex) {
					/* save a clone of the broadcast arc attributes
					 * and remove the original bc arc
					 */
					var lOriginalBroadcastArc = structuredClone(pArc);
					delete pAST.arcs[pArcRowIndex][pArcIndex];
					var lExplodedArcsAry = explodeBroadcastArc(
						pAST.entities,
						lOriginalBroadcastArc,
					);
					pArcRow[pArcIndex] = lExplodedArcsAry.shift();
					pAST.arcs[pArcRowIndex] = pArcRow.concat(lExplodedArcsAry);
				});
		});
	}
	return pAST;
}
function render(pAST) {
	var lAST = flattenMe(structuredClone(pAST));
	var lRetVal =
		"/* Sequence chart represented as a directed graph\n" +
		" * in the graphviz dot language (http://graphviz.org/)\n" +
		" *\n" +
		" * Generated by mscgen_js (https://sverweij.github.io/mscgen_js)\n" +
		" */\n" +
		"\n" +
		"graph {\n";
	lRetVal += "".concat(INDENT, "rankdir=LR\n");
	lRetVal += "".concat(INDENT, "splines=true\n");
	lRetVal += "".concat(INDENT, "ordering=out\n");
	lRetVal += "".concat(INDENT, 'fontname="Helvetica"\n');
	lRetVal += "".concat(INDENT, 'fontsize="9"\n');
	lRetVal += "".concat(
		INDENT,
		'node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]\n',
	);
	lRetVal += "".concat(
		INDENT,
		'edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]\n',
	);
	lRetVal += "\n";
	lRetVal += "".concat(renderEntities(lAST.entities), "\n");
	if (lAST.arcs) {
		gCounter = 0;
		lRetVal += renderArcLines(lAST.arcs, "");
	}
	return (lRetVal += "}");
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
