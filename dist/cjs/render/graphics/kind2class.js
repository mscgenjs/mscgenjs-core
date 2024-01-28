"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAggregateClass = exports.getClass = void 0;
var aggregatekind_1 = __importDefault(require("../astmassage/aggregatekind"));
var KIND2CLASS = Object.freeze({
    "|||": "empty-row",
    "...": "omitted-row",
    "---": "comment-row",
    "->": "signal",
    "=>": "method",
    "=>>": "callback",
    ">>": "return",
    ":>": "emphasised",
    "-x": "lost",
    "<-": "signal",
    "<=": "method",
    "<<=": "callback",
    "<<": "return",
    "<:": "emphasised",
    "x-": "lost",
    "<->": "signal",
    "<=>": "method",
    "<<=>>": "callback",
    "<<>>": "return",
    "<:>": "emphasised",
    "--": "signal",
    "==": "method",
    "..": "return",
    "::": "emphasised",
});
function getClass(pKey) {
    return KIND2CLASS[pKey] || pKey;
}
exports.getClass = getClass;
function getAggregateClass(pKey) {
    return (0, aggregatekind_1.default)(pKey) || pKey;
}
exports.getAggregateClass = getAggregateClass;
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
