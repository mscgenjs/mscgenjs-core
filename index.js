/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./main/static-resolver", "./main/index"], function(resolver, main) {
    "use strict";

    return {
        /**
         * parses the given script and renders it in the DOM element with
         * id pOptions.elementId.
         *
         * @param  {string} pScript     The script to parse and render. Assumed
         *                              to be MscGen - unless specified
         *                              differently in pOptions.inputType
         * @param  {object} pOptions    options influencing parsing and
         *                              rendering. See below for the complete
         *                              list.
         * @param  {function} pCallBack function with error, success
         *                              parameters. renderMsc will pass the
         *                              resulting svg in the success parameter
         *                              when successful, the error message
         *                              in the error parameter when not.
         * @return none
         *
         * Options:
         *   elementId: the id of the DOM element to render in. Defaults to
         *              "__svg". renderMsc assumes this element to exist.
         *   inputType: language to parse - default "mscgen"; other accepted
         *              languages: "xu", "msgenny" and "json"
         *  mirrorEntitiesOnBottom: draws entities on both top and bottom of
         *              the chart when true. Defaults to false.
         *  additionalTemplate: use one of the predefined templates. Default
         *              null/ empty. Possible values: "lazy", "classic",
         *              "cygne", "pegasse", "fountainpen" (experimental),
         *              "inverted" (doesn't work in safari), "grayscaled"
         *              (doesn't work in safari either)
         *  includeSource: whether the generated svg should include the script
         *              in a desc element or not. Defaults to false
           },
         */
        renderMsc: function (pScript, pOptions, pCallBack){
            main.renderMsc(
                pScript, pOptions, pCallBack,
                resolver.getParser, resolver.getGraphicsRenderer
            );
        },

        /**
         * Translates the input script to an outputscript.
         *
         * @param  {string} pScript     The script to translate
         * @param  {object} pOptions    options influencing parsing & rendering.
         *                              See below for the complete list.
         * @param  {function} pCallBack function with error, success
         *                              parameters. translateMsc will pass the
         *                              resulting script in the success
         *                              parameter when successful, the error
         *                              message in the error parameter when not.
         * @return none
         *
         * Options:
         *   inputType  : the language of pScript defaults to "mscgen". Possible
         *                values: "mscgen", "msgenny", "xu", "json"
         *   outputType : defaults to "json". Possible values: "mscgen",
         *                "msgenny", "xu", "json", "dot", "doxygen"
         */
        translateMsc: function (pScript, pOptions, pCallBack){
            main.translateMsc(
                pScript, pOptions, pCallBack,
                resolver.getParser, resolver.getTextRenderer
            );
        },

        /**
         * The current (semver compliant) version number string of
         * mscgenjs
         *
         * @type {string}
         */
        version: main.version
    };
});
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
