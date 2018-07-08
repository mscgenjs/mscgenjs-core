import memoize from "lodash.memoize";
import * as mscgen from "../../types/mscgen";

const DEFAULT_PARSER        = "../parse/mscgenparser";
const DEFAULT_TEXT_RENDERER = "../render/text/ast2mscgen";

const gLang2Parser = Object.freeze({
    mscgen  : "../parse/mscgenparser",
    xu      : "../parse/xuparser",
    msgenny : "../parse/msgennyparser",
}) as any;

const gLang2TextRenderer = Object.freeze({
    mscgen  : "../render/text/ast2mscgen",
    msgenny : "../render/text/ast2msgenny",
    xu      : "../render/text/ast2xu",
    dot     : "../render/text/ast2dot",
    doxygen : "../render/text/ast2doxygen",
}) as any;

export default {
    getParser: memoize(
        (pLanguage: mscgen.InputType) => {
            if (["ast", "json"].indexOf(pLanguage) > -1) {
                return JSON;
            }

            return require(
                gLang2Parser[pLanguage] || DEFAULT_PARSER,
            );
        },
    ),

    getGraphicsRenderer: memoize(
        () => require("../render/graphics/renderast").default,
    ),

    getTextRenderer: memoize(
        (pLanguage: mscgen.InputType) => require(
            gLang2TextRenderer[pLanguage] || DEFAULT_TEXT_RENDERER,
        ).default,
    ),
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
