import * as parserHelpers from "../../parse/parserHelpers";
import * as escape from "../textutensils/escape";
export class XuAdaptor {
    constructor(pMinimal = false) {
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
    init(pConfig) {
        this.config = Object.assign({}, this.getConfig(), pConfig);
    }
    render(pAST) {
        let lRetVal = "";
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
    }
    renderEntityName(pString) {
        return this.isQuotable(pString) ? `"${pString}"` : pString;
    }
    renderAttribute(pAttribute) {
        let lRetVal = "";
        if (pAttribute.name && pAttribute.hasOwnProperty("value")) {
            lRetVal =
                typeof pAttribute.value === "string"
                    ? this.renderStringAttribute(pAttribute)
                    : this.renderNonStringAttribute(pAttribute);
        }
        return lRetVal;
    }
    renderComments(pArray) {
        return pArray.reduce((pPrevComment, pCurComment) => pPrevComment + pCurComment, "");
    }
    renderOption(pOption) {
        return `${pOption.name}=${typeof pOption.value === "string"
            ? '"' + escape.escapeString(pOption.value) + '"'
            : pOption.value.toString()}`;
    }
    optionIsValid(pOption) {
        // actually: return true. Not using pOption is a
        // compiler error, though, so *hack*
        return true || pOption;
    }
    renderKind(pKind) {
        return pKind;
    }
    renderStringAttribute(pAttribute) {
        return `${pAttribute.name}="${escape.escapeString(pAttribute.value)}"`;
    }
    renderNonStringAttribute(pAttribute) {
        return `${pAttribute.name}=${pAttribute.value}`;
    }
    getConfig() {
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
                opener: `msc${this.space}{${this.eol}`,
                closer: "}",
            },
            option: {
                opener: this.indent,
                separator: `,${this.eol}${this.indent}`,
                closer: `;${this.eol}${this.eol}`,
            },
            entity: {
                opener: this.indent,
                separator: `,${this.eol}${this.indent}`,
                closer: `;${this.eol}${this.eol}`,
            },
            attribute: {
                opener: `${this.space}[`,
                separator: `,${this.space}`,
                closer: "]",
            },
            arcline: {
                opener: this.indent,
                separator: `,${this.eol}${this.indent}`,
                closer: `;${this.eol}`,
            },
            inline: {
                opener: `${this.space}{${this.eol}`,
                closer: `${this.indent}}`,
            },
        };
    }
    extractSupportedOptions(pOptions, pSupportedOptions) {
        return pSupportedOptions
            .filter((pSupportedOption) => typeof pOptions[pSupportedOption] !== "undefined")
            .map((pSupportedOption) => ({
            name: pSupportedOption,
            value: pOptions[pSupportedOption],
        }));
    }
    isQuotable(pString) {
        const lMatchResult = pString.match(/[a-z0-9]+/gi);
        if (!!lMatchResult) {
            return (lMatchResult.length !== 1 || parserHelpers.isMscGenKeyword(pString));
        }
        else {
            return pString !== "*";
        }
    }
    renderOptions(pOptions) {
        const lOptions = this.extractSupportedOptions(pOptions, this.config.supportedOptions).filter(this.optionIsValid);
        let lRetVal = "";
        if (lOptions.length > 0) {
            const lLastOption = lOptions.pop();
            lRetVal = lOptions.reduce((pPrevOption, pCurOption) => pPrevOption +
                this.renderOption(pCurOption) +
                this.config.option.separator, this.config.option.opener);
            lRetVal += this.renderOption(lLastOption) + this.config.option.closer;
        }
        return lRetVal;
    }
    renderEntity(pEntity) {
        return (this.renderEntityName(pEntity.name) +
            this.renderAttributes(pEntity, this.config.supportedEntityAttributes));
    }
    renderEntities(pEntities) {
        let lRetVal = "";
        if (pEntities.length > 0) {
            lRetVal = pEntities
                .slice(0, -1)
                .reduce((pPrev, pEntity) => pPrev + this.renderEntity(pEntity) + this.config.entity.separator, this.config.entity.opener);
            lRetVal +=
                this.renderEntity(pEntities[pEntities.length - 1]) +
                    this.config.entity.closer;
        }
        return lRetVal;
    }
    renderAttributes(pArcOrEntity, pSupportedAttributes) {
        let lRetVal = "";
        const lAttributes = this.extractSupportedOptions(pArcOrEntity, pSupportedAttributes);
        if (lAttributes.length > 0) {
            const lLastAtribute = lAttributes.pop();
            lRetVal = lAttributes.reduce((pPreviousAttribute, pCurrentAttribute) => pPreviousAttribute +
                this.renderAttribute(pCurrentAttribute) +
                this.config.attribute.separator, this.config.attribute.opener);
            lRetVal +=
                this.renderAttribute(lLastAtribute) + this.config.attribute.closer;
        }
        return lRetVal;
    }
    renderArc(pArc, pIndent) {
        let lRetVal = "";
        if (pArc.from) {
            lRetVal += `${this.renderEntityName(pArc.from)} `;
        }
        lRetVal += this.renderKind(pArc.kind);
        if (pArc.to) {
            lRetVal += ` ${this.renderEntityName(pArc.to)}`;
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
    }
    renderArcLine(pArcLine, pIndent) {
        let lRetVal = "";
        if (pArcLine.length > 0) {
            lRetVal = pArcLine
                .slice(0, -1)
                .reduce((pPrev, pArc) => pPrev +
                pIndent +
                this.renderArc(pArc, pIndent) +
                this.config.arcline.separator, this.config.arcline.opener);
            lRetVal +=
                pIndent +
                    this.renderArc(pArcLine[pArcLine.length - 1], pIndent) +
                    this.config.arcline.closer;
        }
        return lRetVal;
    }
    renderArcLines(pArcLines, pIndent) {
        return pArcLines.reduce((pPrev, pArcLine) => pPrev + this.renderArcLine(pArcLine, pIndent), "");
    }
}
export const render = (pAST, pMinimal = false) => {
    const lAdaptor = new XuAdaptor(pMinimal);
    return lAdaptor.render(pAST);
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
