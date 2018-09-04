import { IArc, IEntity, IOptions, ISequenceChart } from "../../parse/mscgenjsast";
import parserHelpers from "../../parse/parserHelpers";
import escape from "../textutensils/escape";

export class XuAdaptor {
    protected indent = "  ";
    protected space = " ";
    protected eol = "\n";
    private config = {} as any;

    constructor(pMinimal: boolean = false) {
        if (true === pMinimal) {
            this.indent = "";
            this.space = "";
            this.eol = "";
        } else {
            this.indent = "  ";
            this.space = " ";
            this.eol = "\n";
        }
        this.init(this.config);
    }

    public init(pConfig: any) {
        this.config = Object.assign (
            {},
            this.getConfig(),
            pConfig,
        );
    }

    public render(pAST: ISequenceChart): string {
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

    protected renderEntityName(pString: string): string {
        return this.isQuotable(pString) ? `"${pString}"` : pString;
    }
    protected renderAttribute(pAttribute): string {
        let lRetVal = "";
        if (pAttribute.name && pAttribute.hasOwnProperty("value")) {
            lRetVal = typeof pAttribute.value === "string"
                ? this.renderStringAttribute(pAttribute)
                : this.renderNonStringAttribute(pAttribute);
        }
        return lRetVal;
    }

    protected renderComments(pArray: string[]): string {
        return pArray.reduce((pPrevComment, pCurComment) => pPrevComment + pCurComment, "");
    }

    protected renderOption(pOption): string {
        return `${pOption.name}=${typeof pOption.value === "string"
                ? "\"" + escape.escapeString(pOption.value) + "\""
                : pOption.value.toString()}`;
    }

    protected optionIsValid(pOption): boolean {
        // actually: return true. Not using pOption is a
        // compiler error, though, so *hack*
        return true || pOption;
    }

    protected renderKind(pKind: string): string {
        return pKind;
    }

    private renderStringAttribute(pAttribute): string {
        return `${pAttribute.name}="${escape.escapeString(pAttribute.value)}"`;
    }

    private renderNonStringAttribute(pAttribute): string {
        return `${pAttribute.name}=${pAttribute.value}`;
    }

    private getConfig() {
        return {
            supportedOptions : [
                "hscale",
                "width",
                "arcgradient",
                "wordwraparcs",
                "watermark",
                "wordwrapentities",
                "wordwrapboxes",
            ],
            supportedEntityAttributes : [
                "label", "idurl", "id", "url",
                "linecolor", "textcolor", "textbgcolor",
                "arclinecolor", "arctextcolor", "arctextbgcolor", "arcskip",
            ],
            supportedArcAttributes : [
                "label", "idurl", "id", "url",
                "linecolor", "textcolor", "textbgcolor",
                "arclinecolor", "arctextcolor", "arctextbgcolor", "arcskip",
                "title",
                "activation",
            ],
            program : {
                opener : `msc${this.space}{${this.eol}`,
                closer : "}",
            },
            option : {
                opener : this.indent,
                separator : `,${this.eol}${this.indent}`,
                closer : `;${this.eol}${this.eol}`,
            },
            entity : {
                opener : this.indent,
                separator : `,${this.eol}${this.indent}`,
                closer : `;${this.eol}${this.eol}`,
            },
            attribute : {
                opener : `${this.space}[`,
                separator : `,${this.space}`,
                closer : "]",
            },
            arcline : {
                opener : this.indent,
                separator : `,${this.eol}${this.indent}`,
                closer : `;${this.eol}`,
            },
            inline : {
                opener : `${this.space}{${this.eol}`,
                closer : `${this.indent}}`,
            },
        };
    }

    private extractSupportedOptions(pOptions: any, pSupportedOptions: string[]): any {
        return pSupportedOptions
            .filter((pSupportedOption) => typeof pOptions[pSupportedOption] !== "undefined")
            .map((pSupportedOption) => ({
            name: pSupportedOption,
            value: pOptions[pSupportedOption],
        }));
    }

    private isQuotable(pString: string): boolean {
        const lMatchResult = pString.match(/[a-z0-9]+/gi);
        if (!!lMatchResult) {
            return (lMatchResult.length !== 1) || parserHelpers.isMscGenKeyword(pString);
        } else {
            return pString !== "*";
        }
    }

    private renderOptions(pOptions: IOptions): string {
        const lOptions =
            this.extractSupportedOptions(pOptions, this.config.supportedOptions)
                .filter(this.optionIsValid);
        let lRetVal = "";
        if (lOptions.length > 0) {
            const lLastOption = lOptions.pop();
            lRetVal = lOptions
                .reduce(
                    (pPrevOption, pCurOption) =>
                        pPrevOption + this.renderOption(pCurOption) + this.config.option.separator,
                    this.config.option.opener,
                );
            lRetVal += this.renderOption(lLastOption) + this.config.option.closer;
        }
        return lRetVal;
    }

    private renderEntity(pEntity: IEntity): string {
        return this.renderEntityName(pEntity.name) +
                this.renderAttributes(pEntity, this.config.supportedEntityAttributes);
    }

    private renderEntities(pEntities: IEntity[]): string {
        let lRetVal = "";
        if (pEntities.length > 0) {
            lRetVal = pEntities
                .slice(0, -1)
                .reduce(
                    (pPrev, pEntity) => pPrev + this.renderEntity(pEntity) + this.config.entity.separator,
                    this.config.entity.opener,
                );
            lRetVal += this.renderEntity(pEntities[pEntities.length - 1]) + this.config.entity.closer;
        }
        return lRetVal;
    }

    private renderAttributes(pArcOrEntity: IEntity | IArc, pSupportedAttributes: string[]): string {
        let lRetVal = "";
        const lAttributes = this.extractSupportedOptions(pArcOrEntity, pSupportedAttributes);
        if (lAttributes.length > 0) {
            const lLastAtribute = lAttributes.pop();
            lRetVal = lAttributes
                .reduce(
                    (pPreviousAttribute, pCurrentAttribute) =>
                        pPreviousAttribute +
                        this.renderAttribute(pCurrentAttribute) +
                        this.config.attribute.separator,
                    this.config.attribute.opener,
                );
            lRetVal += this.renderAttribute(lLastAtribute) + this.config.attribute.closer;
        }
        return lRetVal;
    }

    private renderArc(pArc: IArc, pIndent: string): string {
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

    private renderArcLine(pArcLine: IArc[], pIndent: string): string {
        let lRetVal = "";
        if (pArcLine.length > 0) {
            lRetVal = pArcLine
                .slice(0, -1)
                .reduce(
                    (pPrev, pArc) => pPrev + pIndent + this.renderArc(pArc, pIndent) + this.config.arcline.separator,
                    this.config.arcline.opener,
                );
            lRetVal += pIndent + this.renderArc(pArcLine[pArcLine.length - 1], pIndent) + this.config.arcline.closer;
        }
        return lRetVal;
    }

    private renderArcLines(pArcLines: IArc[][], pIndent: string): string {
        return pArcLines.reduce((pPrev, pArcLine) => pPrev + this.renderArcLine(pArcLine, pIndent), "");
    }
}

export default {
    render: (pAST: ISequenceChart, pMinimal: boolean) => {
        const lAdaptor = new XuAdaptor(pMinimal);
        return lAdaptor.render(pAST);
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
