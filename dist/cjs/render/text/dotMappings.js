"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyle = exports.getShape = exports.getArrow = void 0;
/**
 * Defines several mappings of arckinds to agregations
 *
 */
var KIND2ARROW = Object.freeze({
    "->": "rvee",
    "<->": "rvee",
    "=>": "normal",
    "<=>": "normal",
    "-x": "oinvonormal",
});
var KIND2SHAPE = Object.freeze({
    box: "box",
    abox: "hexagon",
    rbox: "box",
    note: "note",
});
var KIND2STYLE = Object.freeze({
    ">>": "dashed",
    "<<>>": "dashed",
    "..": "dashed",
    ":>": "bold",
    "<:>": "bold",
    "::": "bold",
    "rbox": "rounded",
});
function getArrow(pKey) { return KIND2ARROW[pKey]; }
exports.getArrow = getArrow;
function getShape(pKey) { return KIND2SHAPE[pKey]; }
exports.getShape = getShape;
function getStyle(pKey) { return KIND2STYLE[pKey]; }
exports.getStyle = getStyle;
/* The 'generic object injection sink' is to a frozen object,
   attempts to modify it will be moot => we can safely use the []
   notation
*/
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
