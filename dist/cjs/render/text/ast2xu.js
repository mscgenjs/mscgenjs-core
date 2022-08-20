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
exports.__esModule = true;
exports.render = exports.XuAdaptor = void 0;
var parserHelpers = __importStar(require("../../parse/parserHelpers"));
var escape = __importStar(require("../textutensils/escape"));
var XuAdaptor = /** @class */ (function () {
    function XuAdaptor(pMinimal) {
        if (pMinimal === void 0) { pMinimal = false; }
        this.indent = "  ";
        this.space = " ";
        this.eol = "\n";
        this.config = {};
        if (true === pMinimal) {
            this.indent = "";
            this.space = "";
            this.eol = "";
        }
        else {
            this.indent = "  ";
            this.space = " ";
            this.eol = "\n";
        }
        this.init(this.config);
    }
    XuAdaptor.prototype.init = function (pConfig) {
        this.config = Object.assign({}, this.getConfig(), pConfig);
    };
    XuAdaptor.prototype.render = function (pAST) {
        var lRetVal = "";
        if (pAST.precomment) {
            lRetVal += this.renderComments(pAST.precomment);
        }
        lRetVal += this.config.program.opener;
        if (pAST.options) {
            lRetVal += this.renderOptions(pAST.options);
        }
        lRetVal += this.renderEntities(pAST.entities);
        if (pAST.arcs) {
            lRetVal += this.renderArcLines(pAST.arcs, "");
        }
        lRetVal += this.config.program.closer;
        return lRetVal;
    };
    XuAdaptor.prototype.renderEntityName = function (pString) {
        return this.isQuotable(pString) ? "\"".concat(pString, "\"") : pString;
    };
    XuAdaptor.prototype.renderAttribute = function (pAttribute) {
        var lRetVal = "";
        if (pAttribute.name && pAttribute.hasOwnProperty("value")) {
            lRetVal =
                typeof pAttribute.value === "string"
                    ? this.renderStringAttribute(pAttribute)
                    : this.renderNonStringAttribute(pAttribute);
        }
        return lRetVal;
    };
    XuAdaptor.prototype.renderComments = function (pArray) {
        return pArray.reduce(function (pPrevComment, pCurComment) { return pPrevComment + pCurComment; }, "");
    };
    XuAdaptor.prototype.renderOption = function (pOption) {
        return "".concat(pOption.name, "=").concat(typeof pOption.value === "string"
            ? '"' + escape.escapeString(pOption.value) + '"'
            : pOption.value.toString());
    };
    XuAdaptor.prototype.optionIsValid = function (pOption) {
        // actually: return true. Not using pOption is a
        // compiler error, though, so *hack*
        return true || pOption;
    };
    XuAdaptor.prototype.renderKind = function (pKind) {
        return pKind;
    };
    XuAdaptor.prototype.renderStringAttribute = function (pAttribute) {
        return "".concat(pAttribute.name, "=\"").concat(escape.escapeString(pAttribute.value), "\"");
    };
    XuAdaptor.prototype.renderNonStringAttribute = function (pAttribute) {
        return "".concat(pAttribute.name, "=").concat(pAttribute.value);
    };
    XuAdaptor.prototype.getConfig = function () {
        return {
            supportedOptions: [
                "hscale",
                "width",
                "arcgradient",
                "wordwraparcs",
                "watermark",
                "wordwrapentities",
                "wordwrapboxes",
            ],
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
                "title",
                "activation",
            ],
            program: {
                opener: "msc".concat(this.space, "{").concat(this.eol),
                closer: "}"
            },
            option: {
                opener: this.indent,
                separator: ",".concat(this.eol).concat(this.indent),
                closer: ";".concat(this.eol).concat(this.eol)
            },
            entity: {
                opener: this.indent,
                separator: ",".concat(this.eol).concat(this.indent),
                closer: ";".concat(this.eol).concat(this.eol)
            },
            attribute: {
                opener: "".concat(this.space, "["),
                separator: ",".concat(this.space),
                closer: "]"
            },
            arcline: {
                opener: this.indent,
                separator: ",".concat(this.eol).concat(this.indent),
                closer: ";".concat(this.eol)
            },
            inline: {
                opener: "".concat(this.space, "{").concat(this.eol),
                closer: "".concat(this.indent, "}")
            }
        };
    };
    XuAdaptor.prototype.extractSupportedOptions = function (pOptions, pSupportedOptions) {
        return pSupportedOptions
            .filter(function (pSupportedOption) { return typeof pOptions[pSupportedOption] !== "undefined"; })
            .map(function (pSupportedOption) { return ({
            name: pSupportedOption,
            value: pOptions[pSupportedOption]
        }); });
    };
    XuAdaptor.prototype.isQuotable = function (pString) {
        var lMatchResult = pString.match(/[a-z0-9]+/gi);
        if (!!lMatchResult) {
            return (lMatchResult.length !== 1 || parserHelpers.isMscGenKeyword(pString));
        }
        else {
            return pString !== "*";
        }
    };
    XuAdaptor.prototype.renderOptions = function (pOptions) {
        var _this = this;
        var lOptions = this.extractSupportedOptions(pOptions, this.config.supportedOptions).filter(this.optionIsValid);
        var lRetVal = "";
        if (lOptions.length > 0) {
            var lLastOption = lOptions.pop();
            lRetVal = lOptions.reduce(function (pPrevOption, pCurOption) {
                return pPrevOption +
                    _this.renderOption(pCurOption) +
                    _this.config.option.separator;
            }, this.config.option.opener);
            lRetVal += this.renderOption(lLastOption) + this.config.option.closer;
        }
        return lRetVal;
    };
    XuAdaptor.prototype.renderEntity = function (pEntity) {
        return (this.renderEntityName(pEntity.name) +
            this.renderAttributes(pEntity, this.config.supportedEntityAttributes));
    };
    XuAdaptor.prototype.renderEntities = function (pEntities) {
        var _this = this;
        var lRetVal = "";
        if (pEntities.length > 0) {
            lRetVal = pEntities
                .slice(0, -1)
                .reduce(function (pPrev, pEntity) {
                return pPrev + _this.renderEntity(pEntity) + _this.config.entity.separator;
            }, this.config.entity.opener);
            lRetVal +=
                this.renderEntity(pEntities[pEntities.length - 1]) +
                    this.config.entity.closer;
        }
        return lRetVal;
    };
    XuAdaptor.prototype.renderAttributes = function (pArcOrEntity, pSupportedAttributes) {
        var _this = this;
        var lRetVal = "";
        var lAttributes = this.extractSupportedOptions(pArcOrEntity, pSupportedAttributes);
        if (lAttributes.length > 0) {
            var lLastAtribute = lAttributes.pop();
            lRetVal = lAttributes.reduce(function (pPreviousAttribute, pCurrentAttribute) {
                return pPreviousAttribute +
                    _this.renderAttribute(pCurrentAttribute) +
                    _this.config.attribute.separator;
            }, this.config.attribute.opener);
            lRetVal +=
                this.renderAttribute(lLastAtribute) + this.config.attribute.closer;
        }
        return lRetVal;
    };
    XuAdaptor.prototype.renderArc = function (pArc, pIndent) {
        var lRetVal = "";
        if (pArc.from) {
            lRetVal += "".concat(this.renderEntityName(pArc.from), " ");
        }
        lRetVal += this.renderKind(pArc.kind);
        if (pArc.to) {
            lRetVal += " ".concat(this.renderEntityName(pArc.to));
        }
        lRetVal += this.renderAttributes(pArc, this.config.supportedArcAttributes);
        if (pArc.arcs) {
            lRetVal += this.config.inline.opener;
            lRetVal += this.renderArcLines(pArc.arcs, pIndent + this.indent);
            lRetVal += pIndent + this.config.inline.closer;
        }
        if (null === pArc.arcs) {
            lRetVal += this.config.inline.opener;
            lRetVal += pIndent + this.config.inline.closer;
        }
        return lRetVal;
    };
    XuAdaptor.prototype.renderArcLine = function (pArcLine, pIndent) {
        var _this = this;
        var lRetVal = "";
        if (pArcLine.length > 0) {
            lRetVal = pArcLine
                .slice(0, -1)
                .reduce(function (pPrev, pArc) {
                return pPrev +
                    pIndent +
                    _this.renderArc(pArc, pIndent) +
                    _this.config.arcline.separator;
            }, this.config.arcline.opener);
            lRetVal +=
                pIndent +
                    this.renderArc(pArcLine[pArcLine.length - 1], pIndent) +
                    this.config.arcline.closer;
        }
        return lRetVal;
    };
    XuAdaptor.prototype.renderArcLines = function (pArcLines, pIndent) {
        var _this = this;
        return pArcLines.reduce(function (pPrev, pArcLine) { return pPrev + _this.renderArcLine(pArcLine, pIndent); }, "");
    };
    return XuAdaptor;
}());
exports.XuAdaptor = XuAdaptor;
var render = function (pAST, pMinimal) {
    if (pMinimal === void 0) { pMinimal = false; }
    var lAdaptor = new XuAdaptor(pMinimal);
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
