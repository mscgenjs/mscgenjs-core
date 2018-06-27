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
Object.defineProperty(exports, "__esModule", { value: true });
const mscgenparser = __importStar(require("../parse/mscgenparser"));
const msgennyparser = __importStar(require("../parse/msgennyparser"));
const xuparser = __importStar(require("../parse/xuparser"));
const renderast_1 = __importDefault(require("../render/graphics/renderast"));
const ast2dot_1 = __importDefault(require("../render/text/ast2dot"));
const ast2doxygen_1 = __importDefault(require("../render/text/ast2doxygen"));
const ast2mscgen_1 = __importDefault(require("../render/text/ast2mscgen"));
const ast2msgenny_1 = __importDefault(require("../render/text/ast2msgenny"));
const ast2xu_1 = __importDefault(require("../render/text/ast2xu"));
const DEFAULT_PARSER = mscgenparser;
const DEFAULT_TEXT_RENDERER = ast2mscgen_1.default;
const gLang2Parser = Object.freeze({
    mscgen: mscgenparser,
    xu: xuparser,
    msgenny: msgennyparser,
});
const gLang2TextRenderer = Object.freeze({
    mscgen: ast2mscgen_1.default,
    msgenny: ast2msgenny_1.default,
    xu: ast2xu_1.default,
    dot: ast2dot_1.default,
    doxygen: ast2doxygen_1.default,
});
exports.default = {
    getParser(pLanguage) {
        if (["ast", "json"].includes(pLanguage)) {
            return JSON;
        }
        return gLang2Parser[pLanguage] || DEFAULT_PARSER;
    },
    getGraphicsRenderer() {
        return renderast_1.default;
    },
    getTextRenderer(pLanguage) {
        return gLang2TextRenderer[pLanguage] || DEFAULT_TEXT_RENDERER;
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
