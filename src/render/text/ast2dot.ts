import _cloneDeep from "lodash.clonedeep";
import { ArcKindAggregatedType, IArc, IEntity, ISequenceChart } from "../../parse/mscgenjsast";
import aggregatekind from "../astmassage/aggregatekind";
import asttransform from "../astmassage/asttransform";
import * as flatten from "../astmassage/flatten";
import wrap from "../textutensils/wrap";
import * as dotMappings from "./dotMappings";

const INDENT = "  ";
const MAX_TEXT_WIDTH = 40;
let gCounter = 0;

/* Attribute handling */
function renderString(pString: string): string {
    const lStringAry = wrap(pString.replace(/"/g, "\\\""), MAX_TEXT_WIDTH);
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

function translateAttributes(pThing: IEntity|IArc): string[] {
    return ["label", "color", "fontcolor", "fillcolor"]
        .filter((pSupportedAttr) => Boolean(pThing[pSupportedAttr]))
        .map((pSupportedAttr) => renderAttribute(pThing[pSupportedAttr], pSupportedAttr));
}

function renderAttributeBlock(pAttrs): string {
    let lRetVal = "";
    // no need to check whether there's > 0 attribute passed here:
    // - entities have a mandatory 'name' attribute,
    // - arcs have a mandatory 'kind' attribute
    lRetVal = pAttrs.slice(0, -1).reduce((pPrev, pAttr) => `${pPrev + pAttr}, `, " [");
    lRetVal += `${pAttrs.slice(-1)}]`;
    return lRetVal;
}

/* Entity handling */
function renderEntityName(pString: string): string {
    return `"${pString}"`;
}

function renderEntity(pEntity: IEntity): string {
    return renderEntityName(pEntity.name) +
            renderAttributeBlock(translateAttributes(pEntity));
}

function renderEntities(pEntities: IEntity[]): string {
    return pEntities.reduce((pPrev, pEntity) => `${pPrev + INDENT + renderEntity(pEntity)};\n`, "");
}

/* ArcLine handling */
function counterizeLabel(pCounter: number, pLabel?: string): string {
    if (pLabel) {
        return `(${pCounter}) ${pLabel}`;
    } else {
        return `(${pCounter})`;
    }
}

function renderBoxArc(pArc: any, pCounter: number, pIndent: string): string {
    let lRetVal = "";
    const lBoxName = `box${pCounter.toString()}`;
    lRetVal += lBoxName;
    let lAttrs = translateAttributes(pArc);
    pushAttribute(lAttrs, dotMappings.getStyle(pArc.kind), "style");
    pushAttribute(lAttrs, dotMappings.getShape(pArc.kind), "shape");

    lRetVal += `${renderAttributeBlock(lAttrs)}\n${INDENT}${pIndent}`;

    lAttrs = [];
    pushAttribute(lAttrs, "dotted", "style");
    pushAttribute(lAttrs, "none", "dir");

    lRetVal += `${lBoxName} -- {${renderEntityName(pArc.from)},${renderEntityName(pArc.to)}}`;
    lRetVal += renderAttributeBlock(lAttrs);

    return lRetVal;
}

function renderRegularArc(pArc: any, pAggregatedKind: ArcKindAggregatedType, pCounter: number): string {
    let lRetVal = "";
    pArc.label = counterizeLabel(pCounter, pArc.label);
    const lAttrs = translateAttributes(pArc);

    pushAttribute(lAttrs, dotMappings.getStyle(pArc.kind), "style");
    switch (pAggregatedKind) {
    case ("directional") :
        pushAttribute(lAttrs, dotMappings.getArrow(pArc.kind), "arrowhead");
        break;
    case ("bidirectional"):
        pushAttribute(lAttrs, dotMappings.getArrow(pArc.kind), "arrowhead");
        pushAttribute(lAttrs, dotMappings.getArrow(pArc.kind), "arrowtail");
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

function renderSingleArc(pArc: IArc, pCounter: number, pIndent: string): string {
    let lRetVal = "";
    const lAggregatedKind = aggregatekind(pArc.kind);

    if (lAggregatedKind === "box") {
        lRetVal += renderBoxArc(pArc, pCounter, pIndent);
    } else {
        lRetVal += renderRegularArc(pArc, lAggregatedKind, pCounter);
    }
    return lRetVal;
}

function renderArc(pArc: IArc, pIndent: string): string {
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

function renderArcLines(pArcLines: IArc[][], pIndent: string): string {
    return pArcLines
        .reduce(
            (pPrevArcLine, pNextArcLine) =>
                pPrevArcLine + pNextArcLine
                    .reduce(
                        (pPrevArc, pNextArc) => pPrevArc + renderArc(pNextArc, pIndent),
                        "",
                    ),
            "",
        );
}

function explodeBroadcastArc(pEntities: IEntity[], pArc: IArc): IArc[] {
    return pEntities
        .filter((pEntity) => pArc.from !== pEntity.name)
        .map(
            (pEntity) => {
                pArc.to = pEntity.name;
                return _cloneDeep(pArc);
        });
}

/**
 * - Gives each entity a label
 * - Sets arc kinds from left to right where applicable
 * - pre-calculates colors from regular colors and arc*-colors
 */
function flattenMe(pAST: ISequenceChart): ISequenceChart {
    return explodeBroadcasts(
        asttransform(
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
export function explodeBroadcasts(pAST): ISequenceChart {
    if (pAST.arcs) {
        pAST.arcs.forEach((pArcRow, pArcRowIndex) => {
            pArcRow
                // this assumes swap has been done already
                // and "*" is in no 'from'  anymore
                .filter((pArc) => pArc.to === "*")
                .forEach((pArc: IArc, pArcIndex: number) => {
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

export function render(pAST: ISequenceChart): string {
    const lAST: ISequenceChart = flattenMe(_cloneDeep(pAST));
    let lRetVal =
        "/* Sequence chart represented as a directed graph\n" +
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

    lRetVal += `${renderEntities(lAST.entities)}\n`;
    if (lAST.arcs) {
        gCounter = 0;
        lRetVal += renderArcLines(lAST.arcs, "");
    }
    return lRetVal += "}";
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
