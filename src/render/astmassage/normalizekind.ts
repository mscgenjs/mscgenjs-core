/**
 * Defines several mappings of arckinds to agregations
 *
 * @exports node/arcmappings
 * @author {@link https://github.com/sverweij | Sander Verweij}
 */

const KIND2NORMALIZEDKIND = Object.freeze({
    "<-" : "->",
    "<=" : "=>",
    "<<=" : "=>>",
    "<<" : ">>",
    "<:" : ":>",
    "x-" : "-x",
});

export default (pKey) => KIND2NORMALIZEDKIND[pKey] || pKey;
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
