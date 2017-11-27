module.exports = (function(){
    "use strict";
    var _ = require("../lib/lodash/lodash.custom");

    var DEFAULT_PARSER        = "../parse/mscgenparser";
    var DEFAULT_TEXT_RENDERER = "../render/text/ast2mscgen";

    var gLang2Parser = Object.freeze({
        mscgen  : "../parse/mscgenparser",
        xu      : "../parse/xuparser",
        msgenny : "../parse/msgennyparser"
    });

    var gLang2TextRenderer = Object.freeze({
        mscgen  : "../render/text/ast2mscgen",
        msgenny : "../render/text/ast2msgenny",
        xu      : "../render/text/ast2xu",
        dot     : "../render/text/ast2dot",
        doxygen : "../render/text/ast2doxygen"
    });

    return {
        getParser: _.memoize(
            function (pLanguage) {
                if (["ast", "json"].indexOf(pLanguage) > -1) {
                    return JSON;
                }

                return require(
                    gLang2Parser[pLanguage] || DEFAULT_PARSER
                );
            }
        ),

        getGraphicsRenderer: _.memoize(
            function (){
                return require('../render/graphics/renderast');
            }
        ),

        getTextRenderer: _.memoize(
            function (pLanguage){
                return require(
                    gLang2TextRenderer[pLanguage] || DEFAULT_TEXT_RENDERER
                );
            }
        )
    };
})();

/* eslint security/detect-object-injection: 0*/
/* The 'generic object injection sink' is to a frozen object,
   attempts to modify it will be moot => we can safely use the []
   notation
*/

/* eslint security/detect-non-literal-require: 0*/
/* The whole idea of this module is to do non-literarl requires.
   Believed to be 'safe' because the values are not (cannot be)
   supplied externaly, but only indirectly through a lookup
   table
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
