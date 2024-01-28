"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeString = exports.unescapeString = void 0;
/**
 * takes pString and replaces all escaped double quotes with
 * regular double quotes
 * @param {string} pString
 * @return {string}
 */
function unescapeString(pString) {
    return pString.replace(/\\"/g, '"');
}
exports.unescapeString = unescapeString;
/**
 * takes pString and replaces all double quotes with
 * escaped double quotes
 * @param {string} pString
 * @return {string}
 */
function escapeString(pString) {
    return pString.replace(/\\"/g, "\"").replace(/"/g, "\\\"");
}
exports.escapeString = escapeString;
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
