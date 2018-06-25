import * as mscgen from "../../types/mscgen";
import * as mscgenparser from "../parse/mscgenparser" ;
import * as msgennyparser from "../parse/msgennyparser";
import * as xuparser from "../parse/xuparser";
import renderast from "../render/graphics/renderast";
import ast2dot from "../render/text/ast2dot";
import ast2doxygen from "../render/text/ast2doxygen";
import ast2mscgen from "../render/text/ast2mscgen";
import ast2msgenny from "../render/text/ast2msgenny";
import ast2xu from "../render/text/ast2xu";

const DEFAULT_PARSER        = mscgenparser;
const DEFAULT_TEXT_RENDERER = ast2mscgen;

const gLang2Parser = Object.freeze({
    mscgen  : mscgenparser,
    xu      : xuparser,
    msgenny : msgennyparser,
}) as any;

const gLang2TextRenderer = Object.freeze({
    mscgen  : ast2mscgen,
    msgenny : ast2msgenny,
    xu      : ast2xu,
    dot     : ast2dot,
    doxygen : ast2doxygen,
});

export default {
    getParser(pLanguage: mscgen.InputType): mscgen.IParser {
        if (["ast", "json"].includes(pLanguage)) {
            return JSON;
        }

        return gLang2Parser[pLanguage] || DEFAULT_PARSER as mscgen.IParser;
    },

    getGraphicsRenderer(): any {
        return renderast;
    },

    getTextRenderer(pLanguage: mscgen.OutputType): mscgen.IRenderer {
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
