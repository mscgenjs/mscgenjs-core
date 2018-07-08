"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedvalues_1 = __importDefault(require("./allowedvalues"));
function normalizeValueFromValidValues(pValue, pValidValues, pDefault) {
    let lRetval = pDefault;
    if (pValidValues.some((pValidValue) => pValidValue.name === pValue)) {
        lRetval = pValue;
    }
    return lRetval;
}
function normalizeVerticalAlignment(pVerticalAlignment) {
    return normalizeValueFromValidValues(pVerticalAlignment, allowedvalues_1.default.regularArcTextVerticalAlignment, "middle");
}
function normalizeInputType(pInputType) {
    return normalizeValueFromValidValues(pInputType, allowedvalues_1.default.inputType, "mscgen");
}
function normalizeAdditionalTemplate(pAdditionalTemplate) {
    return normalizeValueFromValidValues(pAdditionalTemplate, allowedvalues_1.default.namedStyle, "basic");
}
function booleanize(pValue, pDefault) {
    return typeof pValue === "boolean" ? pValue : pDefault;
}
exports.default = (pOptions, pScript) => {
    const lIncludeSource = booleanize(pOptions.includeSource, true);
    return {
        inputType: normalizeInputType(pOptions.inputType),
        elementId: pOptions.elementId || "__svg",
        window: pOptions.window || window,
        includeSource: lIncludeSource,
        source: lIncludeSource ? pScript : null,
        styleAdditions: pOptions.styleAdditions || null,
        additionalTemplate: normalizeAdditionalTemplate(pOptions.additionalTemplate),
        mirrorEntitiesOnBottom: booleanize(pOptions.mirrorEntitiesOnBottom, false),
        regularArcTextVerticalAlignment: normalizeVerticalAlignment(pOptions.regularArcTextVerticalAlignment),
    };
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
