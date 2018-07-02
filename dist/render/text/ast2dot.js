"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const aggregatekind_1 = __importDefault(require("../astmassage/aggregatekind"));
const asttransform_1 = __importDefault(require("../astmassage/asttransform"));
const flatten_1 = __importDefault(require("../astmassage/flatten"));
const wrap_1 = __importDefault(require("../textutensils/wrap"));
const dotMappings_1 = __importDefault(require("./dotMappings"));
const INDENT = "  ";
const MAX_TEXT_WIDTH = 40;
let gCounter = 0;
function render(pAST) {
    let lRetVal = "/* Sequence chart represented as a directed graph\n" +
        " * in the graphviz dot language (http://graphviz.org/)\n" +
        " *\n" +
        " * Generated by mscgen_js (https://sverweij.github.io/mscgen_js)\n" +
        " */\n" +
        "\n" +
        "graph {\n";
    lRetVal += `${INDENT}rankdir=LR\n`;
    lRetVal += `${INDENT}splines=true\n`;
    lRetVal += `${INDENT}ordering=out\n`;
    lRetVal += `${INDENT}fontname="Helvetica"\n`;
    lRetVal += `${INDENT}fontsize="9"\n`;
    lRetVal += `${INDENT}node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]\n`;
    lRetVal += `${INDENT}edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]\n`;
    lRetVal += "\n";
    lRetVal += `${renderEntities(pAST.entities)}\n`;
    if (pAST.arcs) {
        gCounter = 0;
        lRetVal += renderArcLines(pAST.arcs, "");
    }
    return lRetVal += "}";
}
/* Attribute handling */
function renderString(pString) {
    const lStringAry = wrap_1.default(pString.replace(/"/g, "\\\""), MAX_TEXT_WIDTH);
    let lString = lStringAry.slice(0, -1).reduce((pPrev, pLine) => `${pPrev + pLine}\n`, "");
    lString += lStringAry.slice(-1);
    return lString;
}
function renderAttribute(pAttr, pString) {
    return `${pString}="${renderString(pAttr)}"`;
}
function pushAttribute(pArray, pAttr, pString) {
    if (Boolean(pAttr)) {
        pArray.push(renderAttribute(pAttr, pString));
    }
}
function translateAttributes(pThing) {
    return ["label", "color", "fontcolor", "fillcolor"]
        .filter((pSupportedAttr) => Boolean(pThing[pSupportedAttr]))
        .map((pSupportedAttr) => renderAttribute(pThing[pSupportedAttr], pSupportedAttr));
}
function renderAttributeBlock(pAttrs) {
    let lRetVal = "";
    // no need to check whether there's > 0 attribute passed here:
    // - entities have a mandatory 'name' attribute,
    // - arcs have a mandatory 'kind' attribute
    lRetVal = pAttrs.slice(0, -1).reduce((pPrev, pAttr) => `${pPrev + pAttr}, `, " [");
    lRetVal += `${pAttrs.slice(-1)}]`;
    return lRetVal;
}
/* Entity handling */
function renderEntityName(pString) {
    return `"${pString}"`;
}
function renderEntity(pEntity) {
    return renderEntityName(pEntity.name) +
        renderAttributeBlock(translateAttributes(pEntity));
}
function renderEntities(pEntities) {
    return pEntities.reduce((pPrev, pEntity) => `${pPrev + INDENT + renderEntity(pEntity)};\n`, "");
}
/* ArcLine handling */
function counterizeLabel(pCounter, pLabel) {
    if (pLabel) {
        return `(${pCounter}) ${pLabel}`;
    }
    else {
        return `(${pCounter})`;
    }
}
function renderBoxArc(pArc, pCounter, pIndent) {
    let lRetVal = "";
    const lBoxName = `box${pCounter.toString()}`;
    lRetVal += lBoxName;
    let lAttrs = translateAttributes(pArc);
    pushAttribute(lAttrs, dotMappings_1.default.getStyle(pArc.kind), "style");
    pushAttribute(lAttrs, dotMappings_1.default.getShape(pArc.kind), "shape");
    lRetVal += `${renderAttributeBlock(lAttrs)}\n${INDENT}${pIndent}`;
    lAttrs = [];
    pushAttribute(lAttrs, "dotted", "style");
    pushAttribute(lAttrs, "none", "dir");
    lRetVal += `${lBoxName} -- {${renderEntityName(pArc.from)},${renderEntityName(pArc.to)}}`;
    lRetVal += renderAttributeBlock(lAttrs);
    return lRetVal;
}
function renderRegularArc(pArc, pAggregatedKind, pCounter) {
    let lRetVal = "";
    pArc.label = counterizeLabel(pCounter, pArc.label);
    const lAttrs = translateAttributes(pArc);
    pushAttribute(lAttrs, dotMappings_1.default.getStyle(pArc.kind), "style");
    switch (pAggregatedKind) {
        case ("directional"):
            pushAttribute(lAttrs, dotMappings_1.default.getArrow(pArc.kind), "arrowhead");
            break;
        case ("bidirectional"):
            pushAttribute(lAttrs, dotMappings_1.default.getArrow(pArc.kind), "arrowhead");
            pushAttribute(lAttrs, dotMappings_1.default.getArrow(pArc.kind), "arrowtail");
            pushAttribute(lAttrs, "both", "dir");
            break;
        case ("nondirectional"):
            pushAttribute(lAttrs, "none", "dir");
            break;
        default:
            break;
    }
    if (!pArc.arcs) {
        lRetVal += `${renderEntityName(pArc.from)} `;
        lRetVal += "--";
        lRetVal += ` ${renderEntityName(pArc.to)}`;
        lRetVal += renderAttributeBlock(lAttrs);
    }
    return lRetVal;
}
function renderSingleArc(pArc, pCounter, pIndent) {
    let lRetVal = "";
    const lAggregatedKind = aggregatekind_1.default(pArc.kind);
    if (lAggregatedKind === "box") {
        lRetVal += renderBoxArc(pArc, pCounter, pIndent);
    }
    else {
        lRetVal += renderRegularArc(pArc, lAggregatedKind, pCounter);
    }
    return lRetVal;
}
function renderArc(pArc, pIndent) {
    let lRetVal = "";
    if (pArc.from && pArc.to) {
        lRetVal += `${INDENT + pIndent + renderSingleArc(pArc, ++gCounter, pIndent)}\n`;
        if (pArc.arcs) {
            lRetVal += `${INDENT + pIndent}subgraph cluster_${gCounter.toString()}{`;
            // not checking for pArc.label because there's at least a counter in it
            // at this point
            lRetVal += `\n${INDENT}${pIndent} label="${pArc.kind}: ${pArc.label}" labeljust="l"\n`;
            lRetVal += renderArcLines(pArc.arcs, pIndent + INDENT);
            lRetVal += `${INDENT + pIndent}}\n`;
        }
    }
    return lRetVal;
}
function renderArcLines(pArcLines, pIndent) {
    return pArcLines
        .reduce((pPrevArcLine, pNextArcLine) => pPrevArcLine + pNextArcLine
        .reduce((pPrevArc, pNextArc) => pPrevArc + renderArc(pNextArc, pIndent), ""), "");
}
/**
 * - Gives each entity a label
 * - Sets arc kinds from left to right where applicable
 * - pre-calculates colors from regular colors and arc*-colors
 */
function flattenMe(pAST) {
    return flatten_1.default.explodeBroadcasts(asttransform_1.default(pAST, [flatten_1.default.nameAsLabel], [flatten_1.default.swapRTLArc, flatten_1.default.overrideColors]));
}
exports.default = {
    render(pAST) {
        return render(flattenMe(lodash_clonedeep_1.default(pAST)));
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
