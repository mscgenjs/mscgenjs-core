"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var main = __importStar(require("./main"));
var lazy_resolver_1 = __importDefault(require("./main/lazy-resolver"));
/**
 * Exactly the same interface as @index.js - the only difference is that the
 * functions only load dependencies at the moment they need them.
 */
module.exports = {
    /**
     * See the function of the same name in @index.js.
     */
    renderMsc: function (pScript, pOptions, pCallBack) {
        main.renderMsc(pScript, pOptions || {}, pCallBack, lazy_resolver_1["default"].getParser, lazy_resolver_1["default"].getGraphicsRenderer);
    },
    /**
     * See the function of the same name in @index.js.
     */
    translateMsc: function (pScript, pOptions) {
        return main.translateMsc(pScript, pOptions || {}, lazy_resolver_1["default"].getParser, lazy_resolver_1["default"].getTextRenderer);
    },
    /**
     * See the variable of the same name in @index.js.
     */
    version: main.version,
    /**
     * See the variable of the same name in @index.js.
     */
    getAllowedValues: main.getAllowedValues,
    /**
     * See the function of the same name in @index.js
     */
    getParser: lazy_resolver_1["default"].getParser,
    /**
     * See the function of the same name in @index.js
     */
    getGraphicsRenderer: lazy_resolver_1["default"].getGraphicsRenderer,
    /**
     * See the function of the same name in @index.js
     */
    getTextRenderer: lazy_resolver_1["default"].getTextRenderer
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
