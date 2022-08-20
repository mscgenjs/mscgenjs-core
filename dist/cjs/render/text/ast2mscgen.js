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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.render = exports.MscGenAdaptor = void 0;
var aggregatekind_1 = __importDefault(require("../astmassage/aggregatekind"));
var ast2xu_1 = require("./ast2xu");
var MscGenAdaptor = /** @class */ (function (_super) {
    __extends(MscGenAdaptor, _super);
    function MscGenAdaptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MscGenAdaptor.prototype.init = function (pConfig) {
        _super.prototype.init.call(this, Object.assign({
            supportedOptions: ["hscale", "width", "arcgradient", "wordwraparcs"],
            supportedEntityAttributes: [
                "label",
                "idurl",
                "id",
                "url",
                "linecolor",
                "textcolor",
                "textbgcolor",
                "arclinecolor",
                "arctextcolor",
                "arctextbgcolor",
                "arcskip",
            ],
            supportedArcAttributes: [
                "label",
                "idurl",
                "id",
                "url",
                "linecolor",
                "textcolor",
                "textbgcolor",
                "arclinecolor",
                "arctextcolor",
                "arctextbgcolor",
                "arcskip",
            ],
            inline: {
                opener: ";".concat(this.eol),
                closer: "#"
            }
        }, pConfig));
    };
    MscGenAdaptor.prototype.renderKind = function (pKind) {
        if ("inline_expression" === (0, aggregatekind_1["default"])(pKind)) {
            return "--";
        }
        return pKind;
    };
    MscGenAdaptor.prototype.optionIsValid = function (pOption) {
        if (Boolean(pOption.value) && typeof pOption.value === "string") {
            return pOption.value.toLowerCase() !== "auto";
        }
        return true;
    };
    return MscGenAdaptor;
}(ast2xu_1.XuAdaptor));
exports.MscGenAdaptor = MscGenAdaptor;
var render = function (pAST, pMinimal) {
    if (pMinimal === void 0) { pMinimal = false; }
    var lAdaptor = new MscGenAdaptor(pMinimal);
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
