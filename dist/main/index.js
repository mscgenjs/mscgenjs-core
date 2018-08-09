"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedvalues_1 = __importDefault(require("./allowedvalues"));
const normalizeoptions_1 = __importDefault(require("./normalizeoptions"));
function isProbablyAnASTAlready(pScript, pInputType) {
    return pInputType === "json" && typeof pScript === "object";
}
function getAST(pScript, pInputType, pGetParser) {
    if (isProbablyAnASTAlready(pScript, pInputType)) {
        return pScript;
    }
    else {
        return pGetParser(pInputType).parse(pScript);
    }
}
function runCallBack(pCallBack, pError, pResult) {
    /* istanbul ignore else */
    if (Boolean(pCallBack)) {
        if (Boolean(pError)) {
            pCallBack(pError, null);
        }
        else {
            pCallBack(null, pResult);
        }
    }
}
exports.default = {
    renderMsc(pScript, pOptions, pCallBack, pGetParser, pGetGraphicsRenderer) {
        const lOptions = normalizeoptions_1.default(pOptions, pScript);
        try {
            runCallBack(pCallBack, null, pGetGraphicsRenderer().render(getAST(pScript, lOptions.inputType, pGetParser), lOptions.window, lOptions.elementId, {
                source: lOptions.source,
                styleAdditions: lOptions.styleAdditions,
                additionalTemplate: lOptions.additionalTemplate,
                mirrorEntitiesOnBottom: lOptions.mirrorEntitiesOnBottom,
                regularArcTextVerticalAlignment: lOptions.regularArcTextVerticalAlignment,
            }));
        }
        catch (pException) {
            runCallBack(pCallBack, pException);
        }
    },
    translateMsc(pScript, pOptions, pGetParser, pGetTextRenderer) {
        const lOptions = Object.assign({
            inputType: "mscgen",
            outputType: "json",
        }, pOptions || {});
        if (lOptions.outputType === "ast") {
            return pGetParser(lOptions.inputType).parse(pScript);
        }
        if (lOptions.outputType === "json") {
            return JSON.stringify(pGetParser(lOptions.inputType).parse(pScript), null, "  ");
        }
        return pGetTextRenderer(lOptions.outputType).render(getAST(pScript, lOptions.inputType, pGetParser));
    },
    version: "3.0.0-beta-0",
    getAllowedValues() {
        return allowedvalues_1.default;
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
