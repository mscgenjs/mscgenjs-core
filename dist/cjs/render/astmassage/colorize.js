"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyScheme = void 0;
exports.colorize = colorize;
exports.uncolor = uncolor;
var aggregatekind_1 = __importDefault(require("./aggregatekind"));
var asttransform_1 = __importDefault(require("./asttransform"));
var colorizeschemes_1 = __importDefault(require("./colorizeschemes"));
var gColorCombiCount = 0;
function getArcColorCombis(pColorScheme, pKind) {
    var lArcCombi = pColorScheme.arcColors[pKind];
    if (lArcCombi) {
        return lArcCombi;
    }
    else {
        return pColorScheme.aggregateArcColors[(0, aggregatekind_1.default)(pKind)];
    }
}
function colorizeArc(pColorScheme) {
    return function (pArc) {
        if (!hasColors(pArc)) {
            var lColorCombi = getArcColorCombis(pColorScheme, pArc.kind);
            if (lColorCombi) {
                pArc.linecolor = lColorCombi.linecolor;
                if (lColorCombi.textcolor) {
                    pArc.textcolor = lColorCombi.textcolor;
                }
                pArc.textbgcolor = lColorCombi.textbgcolor;
            }
        }
    };
}
function getNextColorCombi(pColorScheme) {
    var lColorCombiCount = gColorCombiCount;
    if (gColorCombiCount < pColorScheme.entityColors.length - 1) {
        gColorCombiCount += 1;
    }
    else {
        gColorCombiCount = 0;
    }
    return pColorScheme.entityColors[lColorCombiCount];
}
function hasColors(pArcOrEntity) {
    return [
        "linecolor",
        "textcolor",
        "textbgcolor",
        "arclinecolor",
        "arctextcolor",
        "arctextbgcolor",
    ].some(function (pColorAttr) { return Boolean(pArcOrEntity[pColorAttr]); });
}
function colorizeEntity(pColorScheme) {
    return function (pEntity) {
        if (!hasColors(pEntity)) {
            var lNextColorCombi = getNextColorCombi(pColorScheme);
            pEntity.linecolor = lNextColorCombi.linecolor;
            pEntity.textbgcolor = lNextColorCombi.textbgcolor;
            if (lNextColorCombi.textcolor) {
                pEntity.textcolor = lNextColorCombi.textcolor;
                pEntity.arctextcolor = lNextColorCombi.textcolor;
            }
            pEntity.arclinecolor = lNextColorCombi.linecolor;
        }
    };
}
function colorize(pAST, pColorScheme, pForce) {
    gColorCombiCount = 0;
    return (0, asttransform_1.default)(pForce ? uncolor(pAST) : pAST, [colorizeEntity(pColorScheme)], [colorizeArc(pColorScheme)]);
}
function uncolorThing(pThing) {
    delete pThing.linecolor;
    delete pThing.textcolor;
    delete pThing.textbgcolor;
    delete pThing.arclinecolor;
    delete pThing.arctextcolor;
    delete pThing.arctextbgcolor;
}
function uncolor(pAST) {
    return (0, asttransform_1.default)(pAST, [uncolorThing], [uncolorThing]);
}
var applyScheme = function (pAST, pColorSchemeName, pForced) {
    return colorize(pAST, colorizeschemes_1.default[pColorSchemeName]
        ? colorizeschemes_1.default[pColorSchemeName]
        : colorizeschemes_1.default.auto, pForced);
};
exports.applyScheme = applyScheme;
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
