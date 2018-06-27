"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines some functions to simplify a given abstract syntax tree.
 *
 * @exports node/flatten
 * @author {@link https://github.com/sverweij | Sander Verweij}
 */
const asttransform_1 = __importDefault(require("./asttransform"));
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const escape_1 = __importDefault(require("../textutensils/escape"));
const aggregatekind_1 = __importDefault(require("./aggregatekind"));
const normalizekind_1 = __importDefault(require("./normalizekind"));
const normalizeoptions_1 = __importDefault(require("./normalizeoptions"));
let gMaxDepth = 0;
// makes an IEntity into an IEntityNormalized as a side effect
function nameAsLabel(pEntity) {
    if (typeof pEntity.label === "undefined") {
        pEntity.label = pEntity.name;
    }
}
function unescapeLabels(pArcOrEntity) {
    if (Boolean(pArcOrEntity.label)) {
        pArcOrEntity.label = escape_1.default.unescapeString(pArcOrEntity.label);
    }
    if (Boolean(pArcOrEntity.id)) {
        pArcOrEntity.id = escape_1.default.unescapeString(pArcOrEntity.id);
    }
}
function emptyStringForNoLabel(pArc) {
    pArc.label = Boolean(pArc.label) ? pArc.label : "";
}
function _swapRTLArc(pArc) {
    if (pArc.kind && (normalizekind_1.default(pArc.kind) !== pArc.kind)) {
        pArc.kind = normalizekind_1.default(pArc.kind);
        const lTmp = pArc.from;
        pArc.from = pArc.to;
        pArc.to = lTmp;
    }
    return pArc;
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
function overrideColors(pArc, pEntities) {
    if (pArc && pArc.from) {
        const lMatchingEntities = pEntities.filter((pEntity) => pEntity.name === pArc.from);
        if (lMatchingEntities.length > 0) {
            overrideColorsFromThing(pArc, lMatchingEntities[0]);
        }
    }
}
function calcNumberOfRows(pInlineExpression) {
    return pInlineExpression.arcs.reduce((pSum, pArc) => pSum + (Boolean(pArc[0].arcs) ? calcNumberOfRows(pArc[0]) + 1 : 0), pInlineExpression.arcs.length);
}
function unwindArcRow(pArcRow, pDepth, pFrom, pTo) {
    const lRetval = [];
    const lArcRowToPush = [];
    let lUnWoundSubArcs = [];
    pArcRow.forEach((pArc) => {
        if ("inline_expression" === aggregatekind_1.default(pArc.kind)) {
            pArc.depth = pDepth;
            pArc.isVirtual = true;
            if (Boolean(pArc.arcs)) {
                const lInlineExpression = lodash_clonedeep_1.default(pArc);
                lInlineExpression.numberofrows = calcNumberOfRows(lInlineExpression);
                delete lInlineExpression.arcs;
                lArcRowToPush.push(lInlineExpression);
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
                lArcRowToPush.push(pArc);
            }
            lUnWoundSubArcs.push([{
                    kind: "|||",
                    from: pArc.from,
                    to: pArc.to,
                    isVirtual: true,
                }]);
        }
        else {
            if ((pFrom && pTo) && ("empty" === aggregatekind_1.default(pArc.kind))) {
                pArc.from = pFrom;
                pArc.to = pTo;
                pArc.depth = pDepth;
            }
            lArcRowToPush.push(pArc);
        }
    });
    lRetval.push(lArcRowToPush);
    return lRetval.concat(lUnWoundSubArcs);
}
function _unwind(pAST) {
    const lAST = {};
    gMaxDepth = 0;
    if (Boolean(pAST.options)) {
        lAST.options = lodash_clonedeep_1.default(pAST.options);
    }
    if (Boolean(pAST.entities)) {
        lAST.entities = lodash_clonedeep_1.default(pAST.entities);
    }
    lAST.arcs = [];
    if (pAST && pAST.arcs) {
        pAST.arcs
            .forEach((pArcRow) => {
            unwindArcRow(pArcRow, 0)
                .forEach((pUnwoundArcRow) => {
                lAST.arcs.push(pUnwoundArcRow);
            });
        });
    }
    lAST.depth = gMaxDepth + 1;
    return lAST;
}
function explodeBroadcastArc(pEntities, pArc) {
    return pEntities.filter((pEntity) => pArc.from !== pEntity.name).map((pEntity) => {
        pArc.to = pEntity.name;
        return lodash_clonedeep_1.default(pArc);
    });
}
function _explodeBroadcasts(pAST) {
    if (pAST.entities && pAST.arcs) {
        let lExplodedArcsAry = [];
        let lOriginalBroadcastArc = {};
        pAST.arcs.forEach((pArcRow, pArcRowIndex) => {
            pArcRow
                .filter((pArc) => /* assuming swap has been done already and "*"
            is in no 'from'  anymore */ pArc.to === "*")
                .forEach((pArc, pArcIndex) => {
                /* save a clone of the broadcast arc attributes
                    * and remove the original bc arc
                    */
                lOriginalBroadcastArc = lodash_clonedeep_1.default(pArc);
                delete pAST.arcs[pArcRowIndex][pArcIndex];
                lExplodedArcsAry = explodeBroadcastArc(pAST.entities, lOriginalBroadcastArc);
                pArcRow[pArcIndex] = lExplodedArcsAry.shift();
                pAST.arcs[pArcRowIndex] = pArcRow.concat(lExplodedArcsAry);
            });
        });
    }
    return pAST;
}
exports.default = {
    /**
     * If the arc is "facing backwards" (right to left) this function sets the arc
     * kind to the left to right variant (e.g. <= becomes =>) and swaps the operands
     * resulting in an equivalent (b << a becomes a >> b).
     *
     * If the arc is facing forwards or is symetrical, it is left alone.
     *
     * @param {arc} pArc
     * @return {arc}
     */
    swapRTLArc: _swapRTLArc,
    /**
     * Flattens any recursion in the arcs of the given abstract syntax tree to make it
     * more easy to render.
     *
     * @param {ast} pAST
     * @return {ast}
     */
    unwind: _unwind,
    /**
     * expands "broadcast" arcs to its individual counterparts
     * Example in mscgen:
     * msc{
     *     a,b,c,d;
     *     a -> *;
     * }
     * output:
     * msc {
     *     a,b,c,d;
     *     a -> b, a -> c, a -> d;
     * }
     */
    explodeBroadcasts: _explodeBroadcasts,
    /**
     * Simplifies an AST:
     *    - entities without a label get one (the name of the label)
     *    - arc directions get unified to always go forward
     *      (e.g. for a <- b swap entities and reverse direction so it becomes a -> b)
     *    - explodes broadcast arcs
     *    - flattens any recursion (see the {@linkcode unwind} function in
     *      in this module)
     *    - distributes arc*color from the entities to the affected arcs
     * @param {ast} pAST
     * @return {ast}
     */
    flatten(pAST) {
        pAST.options = normalizeoptions_1.default(pAST.options);
        return asttransform_1.default(_unwind(pAST), [nameAsLabel, unescapeLabels], [_swapRTLArc, overrideColors, unescapeLabels, emptyStringForNoLabel]);
    },
    /**
     * Simplifies an AST same as the @link {flatten} function, but without flattening the recursion
     *
     * @param {ast} pAST
     * @return {ast}
     */
    dotFlatten(pAST) {
        return _explodeBroadcasts(asttransform_1.default(pAST, [nameAsLabel], [_swapRTLArc, overrideColors]));
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
