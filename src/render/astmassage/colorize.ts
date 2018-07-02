import { IArc, IEntity, ISequenceChart } from "../../parse/mscgenjsast";
import aggregatekind from "./aggregatekind";
import asttransform from "./asttransform";
import colorizeschemes from "./colorizeschemes";

let gColorCombiCount = 0;

function getArcColorCombis(pColorScheme, pKind) {
    const lArcCombi = pColorScheme.arcColors[pKind];
    if (lArcCombi) {
        return lArcCombi;
    } else {
        return pColorScheme.aggregateArcColors[aggregatekind(pKind)];
    }
}
function colorizeArc(pColorScheme) {
    return (pArc) => {
        if (!hasColors(pArc)) {
            const lColorCombi = getArcColorCombis(pColorScheme, pArc.kind);
            if (lColorCombi) {
                pArc.linecolor = lColorCombi.linecolor;
                if (lColorCombi.textcolor) {
                    pArc.textcolor = lColorCombi.textcolor;
                }
                pArc.textbgcolor = lColorCombi.textbgcolor;
            }
        }
        return pArc;
    };
}

function getNextColorCombi(pColorScheme) {
    const lColorCombiCount = gColorCombiCount;
    if (gColorCombiCount < pColorScheme.entityColors.length - 1) {
        gColorCombiCount += 1;
    } else {
        gColorCombiCount = 0;
    }

    return pColorScheme.entityColors[lColorCombiCount];
}

function hasColors(pArcOrEntity: IArc|IEntity) {
    return ["linecolor", "textcolor", "textbgcolor", "arclinecolor", "arctextcolor", "arctextbgcolor"]
        .some((pColorAttr) => Boolean(pArcOrEntity[pColorAttr]));
}

function colorizeEntity(pColorScheme) {
    return (pEntity) => {
        if (!hasColors(pEntity)) {
            const lNextColorCombi = getNextColorCombi(pColorScheme);
            pEntity.linecolor = lNextColorCombi.linecolor;
            pEntity.textbgcolor = lNextColorCombi.textbgcolor;
            if (lNextColorCombi.textcolor) {
                pEntity.textcolor = lNextColorCombi.textcolor;
                pEntity.arctextcolor = lNextColorCombi.textcolor;
            }
            pEntity.arclinecolor = lNextColorCombi.linecolor;
        }
        return pEntity;
    };
}

function _colorize(pAST: ISequenceChart, pColorScheme, pForce: boolean): ISequenceChart {
    gColorCombiCount = 0;

    return asttransform(
        pForce ? _uncolor(pAST) : pAST,
        [colorizeEntity(pColorScheme)],
        [colorizeArc(pColorScheme)],
    );
}

function uncolorThing(pThing: IEntity|IArc) {
    delete pThing.linecolor;
    delete pThing.textcolor;
    delete pThing.textbgcolor;
    delete pThing.arclinecolor;
    delete pThing.arctextcolor;
    delete pThing.arctextbgcolor;
    return pThing;
}

function _uncolor(pAST: ISequenceChart): ISequenceChart {
    return asttransform(pAST, [uncolorThing], [uncolorThing]);
}

export default {
    uncolor: _uncolor,
    colorize: _colorize,
    applyScheme(pAST: ISequenceChart, pColorSchemeName, pForced: boolean) {
        return _colorize(pAST, colorizeschemes[pColorSchemeName]
            ? colorizeschemes[pColorSchemeName]
            : colorizeschemes.auto, pForced);
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
