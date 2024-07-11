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
exports.getTextRenderer = exports.getGraphicsRenderer = exports.getParser = exports.getAllowedValues = exports.version = void 0;
exports.renderMsc = renderMsc;
exports.translateMsc = translateMsc;
var main = __importStar(require("./main/index"));
var resolver = __importStar(require("./main/static-resolver"));
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
 *  elementId: the id of the DOM element to render in. Defaults to
 *             "__svg". renderMsc assumes this element to exist.
 *  inputType: language to parse - default "mscgen"; Possible values:
 *             allowedValues.inputType
 *  mirrorEntitiesOnBottom: draws entities on both top and bottom of
 *             the chart when true. Defaults to false.
 *  additionalTemplate: use one of the predefined templates. Default
 *             null/ empty. Possible values: allowedValues.namedStyle
 *  includeSource: whether the generated svg should include the script
 *             in a desc element or not. Defaults to false
 */
function renderMsc(pScript, pOptions, pCallBack) {
    main.renderMsc(pScript, pOptions || {}, pCallBack, resolver.getParser, resolver.getGraphicsRenderer);
}
/**
 * Translates the input script to an outputscript.
 *
 * @param  {string} pScript     The script to translate
 * @param  {object} pOptions    options influencing parsing & rendering.
 *                              See below for the complete list.
 * @return {string} - the translated script
 * @throws {Error} - when there's something wrong
 *
 * Options:
 *   inputType  : the language of pScript defaults to "mscgen". Possible
 *                values: allowedValues.inputType
 *   outputType : defaults to "json". Possible values:
 *                allowedValues.outputType
 */
function translateMsc(pScript, pOptions) {
    return main.translateMsc(pScript, pOptions || {}, resolver.getParser, resolver.getTextRenderer);
}
/**
 * The current (semver compliant) version number string of
 * mscgenjs
 *
 * @type {string}
 */
exports.version = main.version;
/**
 *
 * An object with arrays of allowed values for parameters in the
 * renderMsc and translateMsc functions. Each entry in these
 * arrays have a name (=the allowed value) and a boolean "experimental"
 * attribute. If that attribute is true, you'll hit a feature that is
 * under development when use that value.
 *
 * pOptions.inputType
 * pOptions.outputType
 * pOptions.namedStyle
 *
 */
exports.getAllowedValues = main.getAllowedValues;
/**
 * returns a parser module for the given language. The module exposes
 * a parse(pString) function which returns an abstract syntax tree in
 * json format as described in the link below.
 *
 * https://github.com/mscgenjs/mscgenjs-core/blob/master/parse/README.md#the-abstract-syntax-tree
 *
 * @param {string} pLanguage the language to get a parser for
 *                           Possible values: "mscgen", "msgenny", "xu"
 *                           "json". Defaults to "mscgen"
 * @return {object}
 */
exports.getParser = resolver.getParser;
/**
 * returns a renderer that renders the abstract syntax tree as a scalable
 * vector graphics (in practice: @render/graphics/renderast)
 *
 * @deprecated use renderMsc instead to render graphics
 *
 * @return {object}
 */
exports.getGraphicsRenderer = resolver.getGraphicsRenderer;
/**
 * returns a renderer to the given language. The module exposes a
 * render(pAST) function which returns a rendition of the abstract
 * syntax tree it got passed into the given language
 *
 * @deprecated use translateMsc instead to render text
 *
 * @return {object}
 */
exports.getTextRenderer = resolver.getTextRenderer;
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
