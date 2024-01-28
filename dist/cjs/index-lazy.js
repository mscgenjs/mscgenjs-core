"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var main = __importStar(require("./main"));
var resolver = __importStar(require("./main/lazy-resolver"));
/**
 * Exactly the same interface as @index.js - the only difference is that the
 * functions only load dependencies at the moment they need them.
 */
module.exports = {
    /**
     * See the function of the same name in @index.js.
     */
    renderMsc: function (pScript, pOptions, pCallBack) {
        main.renderMsc(pScript, pOptions || {}, pCallBack, resolver.getParser, resolver.getGraphicsRenderer);
    },
    /**
     * See the function of the same name in @index.js.
     */
    translateMsc: function (pScript, pOptions) {
        return main.translateMsc(pScript, pOptions || {}, resolver.getParser, resolver.getTextRenderer);
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
    getParser: resolver.getParser,
    /**
     * See the function of the same name in @index.js
     */
    getGraphicsRenderer: resolver.getGraphicsRenderer,
    /**
     * See the function of the same name in @index.js
     */
    getTextRenderer: resolver.getTextRenderer,
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
