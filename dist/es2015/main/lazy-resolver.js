const DEFAULT_PARSER = "../parse/mscgenparser";
const DEFAULT_TEXT_RENDERER = "../render/text/ast2mscgen";
const gLang2Parser = new Map([
    ["mscgen", "../parse/mscgenparser"],
    ["xu", "../parse/xuparser"],
    ["msgenny", "../parse/msgennyparser"],
]);
const gLang2TextRenderer = new Map([
    ["mscgen", "../render/text/ast2mscgen"],
    ["msgenny", "../render/text/ast2msgenny"],
    ["xu", "../render/text/ast2xu"],
    ["dot", "../render/text/ast2dot"],
    ["doxygen", "../render/text/ast2doxygen"],
]);
const parserMap = new Map();
export function getParser(pLanguage) {
    if (["ast", "json"].indexOf(pLanguage) > -1) {
        return JSON;
    }
    if (!parserMap.has(pLanguage)) {
        parserMap.set(pLanguage, require(gLang2Parser.get(pLanguage) || DEFAULT_PARSER));
    }
    return parserMap.get(pLanguage);
}
;
let graphicsRenderer = null;
export function getGraphicsRenderer() {
    if (!graphicsRenderer) {
        graphicsRenderer = require("../render/graphics/renderast");
    }
    return graphicsRenderer;
}
const textRendererMap = new Map();
export function getTextRenderer(pLanguage) {
    if (!textRendererMap.has(pLanguage)) {
        textRendererMap.set(pLanguage, require(gLang2TextRenderer.get(pLanguage) || DEFAULT_TEXT_RENDERER));
    }
    return textRendererMap.get(pLanguage);
}
;
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
