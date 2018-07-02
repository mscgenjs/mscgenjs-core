
/**
 * Defines some functions to simplify a given abstract syntax tree.
 *
 */
import asttransform from "./asttransform";

import _cloneDeep from "lodash.clonedeep";
import * as mscgenjsast from "../../parse/mscgenjsast";
import escape from "../textutensils/escape";

import aggregatekind from "./aggregatekind";
import normalizekind from "./normalizekind";
import normalizeoptions from "./normalizeoptions";

let gMaxDepth = 0;

function nameAsLabel(pEntity: mscgenjsast.IEntity) {
    if (typeof pEntity.label === "undefined") {
        pEntity.label = pEntity.name;
    }
}

function unescapeLabels(pArcOrEntity) {
    if (Boolean(pArcOrEntity.label)) {
        pArcOrEntity.label = escape.unescapeString(pArcOrEntity.label);
    }
    if (Boolean(pArcOrEntity.id)) {
        pArcOrEntity.id = escape.unescapeString(pArcOrEntity.id);
    }
}

function emptyStringForNoLabel(pArc) {
    pArc.label = Boolean(pArc.label) ? pArc.label : "";
}

function swapRTLArc(pArc) {
    if ((normalizekind(pArc.kind) !== pArc.kind)) {
        pArc.kind = normalizekind(pArc.kind);

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
        const lMatchingEntity = pEntities.find((pEntity) => pEntity.name === pArc.from);
        if (Boolean(lMatchingEntity)) {
            overrideColorsFromThing(pArc, lMatchingEntity);
        }
    }
}
function calcNumberOfRows(pInlineExpression) {
    return pInlineExpression.arcs.reduce(
        (pSum, pArc) => pSum + (Boolean(pArc[0].arcs) ? calcNumberOfRows(pArc[0]) + 1 : 0),
        pInlineExpression.arcs.length,
    );
}

function unwindArcRow(pArcRow, pDepth, pFrom?, pTo?) {
    const lRetval: any[] = [];
    const lArcRowToPush: any[] = [];
    let lUnWoundSubArcs: any[] = [];

    pArcRow.forEach(
        (pArc) => {
            if ("inline_expression" === aggregatekind(pArc.kind)) {
                pArc.depth = pDepth;
                pArc.isVirtual = true;
                if (Boolean(pArc.arcs)) {
                    const lInlineExpression = _cloneDeep(pArc);
                    lInlineExpression.numberofrows = calcNumberOfRows(lInlineExpression);
                    delete lInlineExpression.arcs;
                    lArcRowToPush.push(lInlineExpression);

                    pArc.arcs.forEach(
                        (pSubArcRow) => {
                            lUnWoundSubArcs = lUnWoundSubArcs.concat(
                                unwindArcRow(
                                    pSubArcRow,
                                    pDepth + 1,
                                    lInlineExpression.from,
                                    lInlineExpression.to,
                                ),
                            );
                            pSubArcRow.forEach((pSubArc) => {
                                overrideColorsFromThing(pSubArc, lInlineExpression);
                            });
                        },
                    );
                    if (pDepth > gMaxDepth) {
                        gMaxDepth = pDepth;
                    }
                } else {
                    lArcRowToPush.push(pArc);
                }
                lUnWoundSubArcs.push([{
                    kind : "|||",
                    from : pArc.from,
                    to : pArc.to,
                    isVirtual : true,
                }]);
            } else {
                if ((pFrom && pTo) && ("empty" === aggregatekind(pArc.kind))) {
                    pArc.from = pFrom;
                    pArc.to = pTo;
                    pArc.depth = pDepth;
                }
                lArcRowToPush.push(pArc);
            }
        },
    );
    lRetval.push(lArcRowToPush);
    return lRetval.concat(lUnWoundSubArcs);
}

function unwind(pAST) {
    const lAST: any = {};
    gMaxDepth = 0;

    if (Boolean(pAST.options)) {
        lAST.options = _cloneDeep(pAST.options);
    }
    lAST.entities = _cloneDeep(pAST.entities);
    lAST.arcs = [];

    if (pAST.arcs) {
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

function explodeBroadcastArc(pEntities: mscgenjsast.IEntity[], pArc: mscgenjsast.IArc): mscgenjsast.IArc[] {
    return pEntities
        .filter((pEntity) => pArc.from !== pEntity.name)
        .map(
            (pEntity) => {
                pArc.to = pEntity.name;
                return _cloneDeep(pArc);
        });
}

function explodeBroadcasts(pAST) {
    if (pAST.arcs) {
        pAST.arcs.forEach((pArcRow, pArcRowIndex) => {
            pArcRow
                // this assumes swap has been done already
                // and "*" is in no 'from'  anymore
                .filter((pArc) => pArc.to === "*")
                .forEach((pArc: mscgenjsast.IArc, pArcIndex: number) => {
                   /* save a clone of the broadcast arc attributes
                    * and remove the original bc arc
                    */
                    const lOriginalBroadcastArc = _cloneDeep(pArc);

                    delete pAST.arcs[pArcRowIndex][pArcIndex];
                    const lExplodedArcsAry = explodeBroadcastArc(pAST.entities, lOriginalBroadcastArc);

                    pArcRow[pArcIndex] = lExplodedArcsAry.shift();
                    pAST.arcs[pArcRowIndex] = pArcRow.concat(lExplodedArcsAry);
                });
        });
    }
    return pAST;
}

export default {
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
    explodeBroadcasts,
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
    flatten(pAST: mscgenjsast.ISequenceChart): any {
        pAST.options = normalizeoptions(pAST.options);
        return asttransform(
            unwind(pAST),
            [nameAsLabel, unescapeLabels],
            [swapRTLArc, overrideColors, unescapeLabels, emptyStringForNoLabel],
        );
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
