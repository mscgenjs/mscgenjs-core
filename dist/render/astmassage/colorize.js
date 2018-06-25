"use strict";
/* Automatically adds colors to an AST:
 *    - any entity without a color(linecolor, textcolor,
 *      textbgcolor or their arc* variants) get assigned a
 *      - linecolor
 *      - textbgcolor
 *      - arclinecolor
 *    - colors picked rom from an array (possibly random w no repeat?)
 *    - notes without any color get a
 *      - black linecolor
 *      - light yellow textbgcolor
 */
Object.defineProperty(exports, "__esModule", { value: true });
const asttransform_1 = require("./asttransform");
const aggregatekind_1 = require("./aggregatekind");
const gSchemes = {
    minimal: {
        entityColors: [
            {},
        ],
        arcColors: {
            "note": {
                linecolor: "black",
                textbgcolor: "#FFFFCC",
            },
            "---": {
                linecolor: "grey",
                textbgcolor: "white",
            },
            ">>": {
                linecolor: "#555",
            },
            "<<": {
                linecolor: "#555",
            },
            "-x": {
                linecolor: "#500",
            },
            "x-": {
                linecolor: "#500",
            },
        },
        aggregateArcColors: {
            inline_expression: {
                linecolor: "grey",
            },
            box: {
                linecolor: "black",
                textbgcolor: "white",
            },
        },
    },
    rosy: {
        entityColors: [
            {
                linecolor: "maroon",
                textbgcolor: "#FFFFCC",
            },
        ],
        arcColors: {
            "note": {
                linecolor: "maroon",
                textbgcolor: "#FFFFCC",
            },
            "---": {
                linecolor: "grey",
                textbgcolor: "white",
            },
        },
        aggregateArcColors: {
            inline_expression: {
                linecolor: "maroon",
                textcolor: "maroon",
            },
            box: {
                linecolor: "maroon",
                textbgcolor: "#FFFFCC",
            },
        },
    },
    bluey: {
        entityColors: [
            {
                linecolor: "#00A1DE",
                textbgcolor: "#00A1DE",
                textcolor: "white",
            },
        ],
        arcColors: {
            "note": {
                linecolor: "white",
                textbgcolor: "#E77B2F",
                textcolor: "white",
            },
            "---": {
                linecolor: "#00A1DE",
                textcolor: "#005B82",
                textbgcolor: "white",
            },
        },
        aggregateArcColors: {
            inline_expression: {
                linecolor: "#00A1DE",
                textcolor: "#005B82",
            },
            box: {
                linecolor: "#00A1DE",
                textbgcolor: "white",
                textcolor: "#005B82",
            },
            emptyarc: {
                textcolor: "#005B82",
                linecolor: "#005B82",
            },
            directional: {
                textcolor: "#005B82",
                linecolor: "#005B82",
            },
            bidirectional: {
                textcolor: "#005B82",
                linecolor: "#005B82",
            },
            nondirectional: {
                textcolor: "#005B82",
                linecolor: "#005B82",
            },
        },
    },
    auto: {
        entityColors: [
            {
                linecolor: "#008800",
                textbgcolor: "#CCFFCC",
            },
            {
                linecolor: "#FF0000",
                textbgcolor: "#FFCCCC",
            },
            {
                linecolor: "#0000FF",
                textbgcolor: "#CCCCFF",
            },
            {
                linecolor: "#FF00FF",
                textbgcolor: "#FFCCFF",
            },
            {
                linecolor: "black",
                textbgcolor: "#DDDDDD",
            },
            {
                linecolor: "orange",
                textbgcolor: "#FFFFCC",
            },
            {
                linecolor: "#117700",
                textbgcolor: "#00FF00",
            },
            {
                linecolor: "purple",
                textbgcolor: "violet",
            },
            {
                linecolor: "grey",
                textbgcolor: "white",
            },
        ],
        arcColors: {
            "note": {
                linecolor: "black",
                textbgcolor: "#FFFFCC",
            },
            "---": {
                linecolor: "grey",
                textbgcolor: "white",
            },
        },
        aggregateArcColors: {
            inline_expression: {
                linecolor: "grey",
                textbgcolor: "white",
            },
            box: {
                linecolor: "black",
                textbgcolor: "white",
            },
        },
    },
};
let gColorCombiCount = 0;
function getArcColorCombis(pColorScheme, pKind) {
    const lArcCombi = pColorScheme.arcColors[pKind];
    if (lArcCombi) {
        return lArcCombi;
    }
    else {
        return pColorScheme.aggregateArcColors[aggregatekind_1.default(pKind)];
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
    }
    else {
        gColorCombiCount = 0;
    }
    return pColorScheme.entityColors[lColorCombiCount];
}
function hasColors(pArcOrEntity) {
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
function _colorize(pAST, pColorScheme, pForce) {
    gColorCombiCount = 0;
    return asttransform_1.default(pForce ? _uncolor(pAST) : pAST, [colorizeEntity(pColorScheme)], [colorizeArc(pColorScheme)]);
}
function uncolorThing(pThing) {
    delete pThing.linecolor;
    delete pThing.textcolor;
    delete pThing.textbgcolor;
    delete pThing.arclinecolor;
    delete pThing.arctextcolor;
    delete pThing.arctextbgcolor;
    return pThing;
}
function _uncolor(pAST) {
    return asttransform_1.default(pAST, [uncolorThing], [uncolorThing]);
}
exports.default = {
    uncolor: _uncolor,
    colorize: _colorize,
    applyScheme(pAST, pColorSchemeName, pForced) {
        return _colorize(pAST, gSchemes[pColorSchemeName]
            ? gSchemes[pColorSchemeName]
            : gSchemes.auto, pForced);
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
