
/**
 * Defines some functions to simplify a given abstract syntax tree.
 */
import asttransform from "./asttransform";

import _cloneDeep from "lodash.clonedeep";
import * as mscgenjsast from "../../parse/mscgenjsast";
import escape from "../textutensils/escape";

import aggregatekind from "./aggregatekind";
import normalizekind from "./normalizekind";
import normalizeoptions from "./normalizeoptions";

export interface IEntityNormalized extends mscgenjsast.IEntity {
    label: string;
}

export interface IFlatArc {
    kind: mscgenjsast.ArcKindNormalizedType;
    from?: string;
    to?: string;
    // nested arcs explicityly removed during flattening
    // arcs?: IArc[][];
    label: string;
    id?: string;
    idurl?: string;
    url?: string;
    linecolor?: string;
    textcolor?: string;
    textbgcolor?: string;
    // arc*color might be there but should be ignored as they have
    // no meaning for arcs:
    // arclinecolor?: string;
    // arctextcolor?: string;
    // arctextbgcolor?: string;
    arcskip?: number;
    title?: string;

    depth: number;
    isVirtual: boolean;
    numberofrows?: number; // for inline expression arcs => maybe father a child for this
}

export interface IFlatSequenceChart {
    options: mscgenjsast.IOptionsNormalized;
    entities: IEntityNormalized[];
    arcs: IFlatArc[][];
    depth: number;
}

let gMaxDepth = 0;

function nameAsLabel(pEntity: mscgenjsast.IEntity) {
    if (typeof pEntity.label === "undefined") {
        pEntity.label = pEntity.name;
    }
}

function unescapeLabels(pArcOrEntity: mscgenjsast.IArc|mscgenjsast.IEntity): void {
    if (!!pArcOrEntity.label) {
        pArcOrEntity.label = escape.unescapeString(pArcOrEntity.label);
    }
    if (!!pArcOrEntity.id) {
        pArcOrEntity.id = escape.unescapeString(pArcOrEntity.id);
    }
}

function emptyStringForNoLabel(pArc: mscgenjsast.IArc): void {
    pArc.label = Boolean(pArc.label) ? pArc.label : "";
}

function swapRTLArc(pArc: mscgenjsast.IArc): void {
    if ((normalizekind(pArc.kind) !== pArc.kind)) {
        pArc.kind = normalizekind(pArc.kind);

        const lTmp = pArc.from;
        pArc.from = pArc.to;
        pArc.to = lTmp;
    }
}

function overrideColorsFromThing(pArc: mscgenjsast.IArc, pThing: mscgenjsast.IArc|mscgenjsast.IEntity) {
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
function overrideColors(pArc: mscgenjsast.IArc, pEntities: mscgenjsast.IEntity[] = []) {
    if (pArc && pArc.from) {
        const lMatchingEntity = pEntities.find((pEntity) => pEntity.name === pArc.from);
        if (!!lMatchingEntity) {
            overrideColorsFromThing(pArc, lMatchingEntity);
        }
    }
}
function calcNumberOfRows(pInlineExpression): number {
    return pInlineExpression.arcs.reduce(
        (pSum, pArc) => pSum + (Boolean(pArc[0].arcs) ? calcNumberOfRows(pArc[0]) + 1 : 0),
        pInlineExpression.arcs.length,
    );
}

function unwindArcRow(pArcRow: mscgenjsast.IArc[]|any, pDepth: number, pFrom?: string, pTo?: string): any {
    const lRetval: any[] = [];
    const lFlatArcRow: IFlatArc[] = [];
    let lUnWoundSubArcs: Array<Array<IFlatArc|any>> = [];

    pArcRow.forEach(
        (pArc: mscgenjsast.IArc|any) => {
            pArc.isVirtual = false;
            if ("inline_expression" === aggregatekind(pArc.kind)) {
                pArc.depth = pDepth;
                pArc.isVirtual = true;
                if (!!pArc.arcs) {
                    const lInlineExpression = _cloneDeep(pArc);
                    lInlineExpression.numberofrows = calcNumberOfRows(lInlineExpression);
                    delete lInlineExpression.arcs;
                    lFlatArcRow.push(lInlineExpression);

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
                    lFlatArcRow.push(pArc);
                }
                lUnWoundSubArcs.push([{
                    kind : "|||",
                    from : pArc.from,
                    to : pArc.to,
                    // label: "",
                    // depth: pDepth,
                    isVirtual : true,
                }]);
            } else {
                if ((pFrom && pTo) && ("empty" === aggregatekind(pArc.kind))) {
                    pArc.from = pFrom;
                    pArc.to = pTo;
                    pArc.depth = pDepth;
                }
                lFlatArcRow.push(pArc);
            }
        },
    );
    lRetval.push(lFlatArcRow);
    return lRetval.concat(lUnWoundSubArcs);
}

function unwind(pArcRows?: mscgenjsast.IArc[][]): IFlatArc[][] {
    if (pArcRows) {
        return pArcRows.reduce(
            (pAll: IFlatArc[][], pArcRow: mscgenjsast.IArc[]) => pAll.concat(unwindArcRow(pArcRow, 0))
            , [],
        );
    }
    return [];
}

function normalize(pAST: mscgenjsast.ISequenceChart): IFlatSequenceChart {
    gMaxDepth = 0;
    return {
        options: normalizeoptions(pAST.options),
        entities: _cloneDeep(pAST.entities),
        arcs: unwind(pAST.arcs),
        depth: gMaxDepth + 1,
    };
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
    normalize,
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
    flatten(pAST: mscgenjsast.ISequenceChart): IFlatSequenceChart {
        return normalize(
            asttransform(
                pAST,
                [nameAsLabel, unescapeLabels],
                [swapRTLArc, overrideColors, unescapeLabels, emptyStringForNoLabel],
            ),
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
