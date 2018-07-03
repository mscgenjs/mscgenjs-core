"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines some functions to simplify a given abstract syntax tree.
 */
const asttransform_1 = __importDefault(require("./asttransform"));
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const escape_1 = __importDefault(require("../textutensils/escape"));
const aggregatekind_1 = __importDefault(require("./aggregatekind"));
const normalizekind_1 = __importDefault(require("./normalizekind"));
const normalizeoptions_1 = __importDefault(require("./normalizeoptions"));
let gMaxDepth = 0;
function nameAsLabel(pEntity) {
    if (typeof pEntity.label === "undefined") {
        pEntity.label = pEntity.name;
    }
}
function unescapeLabels(pArcOrEntity) {
    if (!!pArcOrEntity.label) {
        pArcOrEntity.label = escape_1.default.unescapeString(pArcOrEntity.label);
    }
    if (!!pArcOrEntity.id) {
        pArcOrEntity.id = escape_1.default.unescapeString(pArcOrEntity.id);
    }
}
function emptyStringForNoLabel(pArc) {
    pArc.label = Boolean(pArc.label) ? pArc.label : "";
}
function swapRTLArc(pArc) {
    if ((normalizekind_1.default(pArc.kind) !== pArc.kind)) {
        pArc.kind = normalizekind_1.default(pArc.kind);
        const lTmp = pArc.from;
        pArc.from = pArc.to;
        pArc.to = lTmp;
    }
}
function overrideColorsFromThing(pArc, pThing) {
    if (!(pArc.linecolor) && pThing.arclinecolor) {
        pArc.linecolor = pThing.arclinecolor;
    }
    if (!(pArc.textcolor) && pThing.arctextcolor) {
        pArc.textcolor = pThing.arctextcolor;
    }
    if (!(pArc.textbgcolor) && pThing.arctextbgcolor) {
        pArc.textbgcolor = pThing.arctextbgcolor;
    }
}
/*
* assumes arc direction to be either LTR, both, or none
* so arc.from exists.
*/
function overrideColors(pArc, pEntities = []) {
    if (pArc && pArc.from) {
        const lMatchingEntity = pEntities.find((pEntity) => pEntity.name === pArc.from);
        if (!!lMatchingEntity) {
            overrideColorsFromThing(pArc, lMatchingEntity);
        }
    }
}
function calcNumberOfRows(pInlineExpression) {
    return pInlineExpression.arcs.reduce((pSum, pArc) => pSum + (Boolean(pArc[0].arcs) ? calcNumberOfRows(pArc[0]) + 1 : 0), pInlineExpression.arcs.length);
}
function unwindArcRow(pArcRow, pDepth, pFrom, pTo) {
    const lRetval = [];
    const lFlatArcRow = [];
    let lUnWoundSubArcs = [];
    pArcRow.forEach((pArc) => {
        if ("inline_expression" === aggregatekind_1.default(pArc.kind)) {
            pArc.depth = pDepth;
            pArc.isVirtual = true;
            if (!!pArc.arcs) {
                const lInlineExpression = lodash_clonedeep_1.default(pArc);
                lInlineExpression.numberofrows = calcNumberOfRows(lInlineExpression);
                delete lInlineExpression.arcs;
                lFlatArcRow.push(lInlineExpression);
                pArc.arcs.forEach((pSubArcRow) => {
                    lUnWoundSubArcs = lUnWoundSubArcs.concat(unwindArcRow(pSubArcRow, pDepth + 1, lInlineExpression.from, lInlineExpression.to));
                    pSubArcRow.forEach((pSubArc) => {
                        overrideColorsFromThing(pSubArc, lInlineExpression);
                    });
                });
                if (pDepth > gMaxDepth) {
                    gMaxDepth = pDepth;
                }
            }
            else {
                lFlatArcRow.push(pArc);
            }
            lUnWoundSubArcs.push([{
                    kind: "|||",
                    from: pArc.from,
                    to: pArc.to,
                    // label: "",
                    // depth: pDepth,
                    isVirtual: true,
                }]);
        }
        else {
            if ((pFrom && pTo) && ("empty" === aggregatekind_1.default(pArc.kind))) {
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
function unwind(pAST) {
    const lAST = {};
    gMaxDepth = 0;
    if (Boolean(pAST.options)) {
        lAST.options = lodash_clonedeep_1.default(pAST.options);
    }
    lAST.entities = lodash_clonedeep_1.default(pAST.entities);
    lAST.arcs = [];
    if (pAST.arcs) {
        lAST.arcs = pAST.arcs.reduce((pAll, pArcRow) => pAll.concat(unwindArcRow(pArcRow, 0)), []);
    }
    lAST.depth = gMaxDepth + 1;
    return lAST;
}
exports.default = {
    /**
     * If the entity has no label, set the label of the entity to its name
     */
    nameAsLabel,
    /**
     * If the arc is "facing backwards" (right to left) this function sets the arc
     * kind to the left to right variant (e.g. <= becomes =>) and swaps the operands
     * resulting in an equivalent (b << a becomes a >> b).
     *
     * If the arc is facing forwards or is symetrical, it is left alone.
     */
    swapRTLArc,
    /**
     * Flattens any recursion in the arcs of the given abstract syntax tree to make it
     * more easy to render.
     */
    unwind,
    overrideColors,
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
    flatten(pAST) {
        pAST.options = normalizeoptions_1.default(pAST.options);
        return unwind(asttransform_1.default(pAST, [nameAsLabel, unescapeLabels], [swapRTLArc, overrideColors, unescapeLabels, emptyStringForNoLabel]));
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
