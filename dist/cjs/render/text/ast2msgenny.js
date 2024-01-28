"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
var ast2xu_1 = require("./ast2xu");
var MsGennyAdaptor = /** @class */ (function (_super) {
    __extends(MsGennyAdaptor, _super);
    function MsGennyAdaptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsGennyAdaptor.prototype.init = function () {
        _super.prototype.init.call(this, {
            supportedEntityAttributes: ["label"],
            supportedArcAttributes: ["label"],
            program: {
                opener: "",
                closer: "",
            },
            option: {
                opener: "",
                separator: ",".concat(this.eol),
                closer: ";".concat(this.eol).concat(this.eol),
            },
            entity: {
                opener: "",
                separator: ",".concat(this.eol),
                closer: ";".concat(this.eol).concat(this.eol),
            },
            arcline: {
                opener: "",
                separator: ",".concat(this.eol),
                closer: ";".concat(this.eol),
            },
            inline: {
                opener: " {".concat(this.eol),
                closer: "}",
            },
            attribute: {
                opener: "",
                separator: "",
                closer: "",
            },
        });
    };
    MsGennyAdaptor.prototype.renderEntityName = function (pString) {
        return this.entityNameIsQuotable(pString) ? "\"".concat(pString, "\"") : pString;
    };
    MsGennyAdaptor.prototype.renderAttribute = function (pAttribute) {
        var lRetVal = "";
        if (pAttribute.name && pAttribute.value) {
            lRetVal += " : \"".concat(pAttribute.value, "\"");
        }
        return lRetVal;
    };
    MsGennyAdaptor.prototype.entityNameIsQuotable = function (pString) {
        var lMatchResult = pString.match(/[^;, "\t\n\r=\-><:{*]+/gi);
        if (lMatchResult) {
            return lMatchResult.length !== 1;
        }
        else {
            return pString !== "*";
        }
    };
    return MsGennyAdaptor;
}(ast2xu_1.XuAdaptor));
var render = function (pAST) {
    var lAdaptor = new MsGennyAdaptor();
    return lAdaptor.render(pAST);
};
exports.render = render;
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
