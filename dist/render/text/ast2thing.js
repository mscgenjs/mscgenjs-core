"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escape_1 = require("../textutensils/escape");
const INDENT = "  ";
const SP = " ";
const EOL = "\n";
const CONFIG = {
    renderCommentfn: renderComments,
    renderOptionfn: renderOption,
    optionIsValidfn: optionIsValid,
    renderEntityNamefn: renderEntityName,
    renderKindfn: renderKind,
    supportedOptions: [
        "hscale",
        "width",
        "arcgradient",
        "wordwraparcs",
        "watermark",
        "wordwrapentities",
        "wordwrapboxes",
    ],
    supportedEntityAttributes: ["label"],
    supportedArcAttributes: ["label"],
    // "renderAttributefn" : renderAttribute
    program: {
        opener: "",
        closer: "",
    },
    option: {
        opener: "",
        separator: `,${EOL}`,
        closer: `;${EOL}${EOL}`,
    },
    entity: {
        opener: "",
        separator: `,${SP}`,
        closer: `;${EOL}${EOL}`,
    },
    arcline: {
        opener: "",
        separator: `,${EOL}`,
        closer: `;${EOL}`,
    },
    inline: {
        opener: ` {${EOL}`,
        closer: "}",
    },
    attribute: {
        opener: "",
        separator: "",
        closer: "",
    },
};
const gConfig = {};
function fillGloblalConfig(pConfig) {
    Object.getOwnPropertyNames(pConfig).forEach((pAttribute) => {
        gConfig[pAttribute] = pConfig[pAttribute];
    });
}
function processConfig(pConfig) {
    fillGloblalConfig(CONFIG);
    fillGloblalConfig(pConfig);
}
function _renderAST(pAST, pConfig) {
    processConfig(pConfig);
    return doTheRender(pAST);
}
function doTheRender(pAST) {
    let lRetVal = "";
    if (pAST) {
        if (pAST.precomment) {
            lRetVal += gConfig.renderCommentfn(pAST.precomment);
        }
        lRetVal += gConfig.program.opener;
        if (pAST.options) {
            lRetVal += renderOptions(pAST.options);
        }
        if (pAST.entities) {
            lRetVal += renderEntities(pAST.entities);
        }
        if (pAST.arcs) {
            lRetVal += renderArcLines(pAST.arcs, "");
        }
        lRetVal += gConfig.program.closer;
        /*
            * not supported yet
        if (pAST.postcomment) {
            lRetVal += gConfig.renderCommentfn(pAST.postcomment);
        }
        */
    }
    return lRetVal;
}
function extractSupportedOptions(pOptions, pSupportedOptions) {
    return pSupportedOptions
        .filter((pSupportedOption) => typeof pOptions[pSupportedOption] !== "undefined")
        .map((pSupportedOption) => ({
        name: pSupportedOption,
        value: pOptions[pSupportedOption],
    }));
}
function renderComments(pArray) {
    return pArray.reduce((pPrevComment, pCurComment) => pPrevComment + pCurComment, "");
}
function isMscGenKeyword(pString) {
    return [
        "box", "abox", "rbox", "note", "msc", "hscale", "width", "arcgradient",
        "wordwraparcs", "label", "color", "idurl", "id", "url",
        "linecolor", "textcolor",
        "textbgcolor", "arclinecolor",
        "arctextcolor", "arctextbgcolor",
        "arcskip",
    ].includes(pString);
}
function isQuotable(pString) {
    const lMatchResult = pString.match(/[a-z0-9]+/gi);
    if (Boolean(lMatchResult)) {
        return (lMatchResult.length !== 1) || isMscGenKeyword(pString);
    }
    else {
        return pString !== "*";
    }
}
function renderEntityName(pString) {
    return isQuotable(pString) ? `"${pString}"` : pString;
}
function renderOption(pOption) {
    return `${pOption.name}=${typeof pOption.value === "string"
        ? "\"" + escape_1.default.escapeString(pOption.value) + "\""
        : pOption.value.toString()}`;
}
function optionIsValid( /* pOption*/) {
    return true;
}
function renderOptions(pOptions) {
    const lOptions = extractSupportedOptions(pOptions, gConfig.supportedOptions)
        .filter(gConfig.optionIsValidfn);
    let lRetVal = "";
    if (lOptions.length > 0) {
        const lLastOption = lOptions.pop();
        lRetVal = lOptions
            .reduce((pPrevOption, pCurOption) => pPrevOption + gConfig.renderOptionfn(pCurOption) + gConfig.option.separator, gConfig.option.opener);
        lRetVal += gConfig.renderOptionfn(lLastOption) + gConfig.option.closer;
    }
    return lRetVal;
}
function renderEntity(pEntity) {
    return gConfig.renderEntityNamefn(pEntity.name) +
        renderAttributes(pEntity, gConfig.supportedEntityAttributes);
}
function renderEntities(pEntities) {
    let lRetVal = "";
    if (pEntities.length > 0) {
        lRetVal = pEntities
            .slice(0, -1)
            .reduce((pPrev, pEntity) => pPrev + renderEntity(pEntity) + gConfig.entity.separator, gConfig.entity.opener);
        lRetVal += renderEntity(pEntities[pEntities.length - 1]) + gConfig.entity.closer;
    }
    return lRetVal;
}
function renderAttributes(pArcOrEntity, pSupportedAttributes) {
    let lRetVal = "";
    const lAttributes = extractSupportedOptions(pArcOrEntity, pSupportedAttributes);
    if (lAttributes.length > 0) {
        const lLastAtribute = lAttributes.pop();
        lRetVal = lAttributes
            .reduce((pPreviousAttribute, pCurrentAttribute) => pPreviousAttribute + gConfig.renderAttributefn(pCurrentAttribute) + gConfig.attribute.separator, gConfig.attribute.opener);
        lRetVal += gConfig.renderAttributefn(lLastAtribute) + gConfig.attribute.closer;
    }
    return lRetVal;
}
function renderKind(pKind) {
    return pKind;
}
function renderArc(pArc, pIndent) {
    let lRetVal = "";
    if (pArc.from) {
        lRetVal += `${gConfig.renderEntityNamefn(pArc.from)} `;
    }
    if (pArc.kind) {
        lRetVal += gConfig.renderKindfn(pArc.kind);
    }
    if (pArc.to) {
        lRetVal += ` ${gConfig.renderEntityNamefn(pArc.to)}`;
    }
    lRetVal += renderAttributes(pArc, gConfig.supportedArcAttributes);
    if (pArc.arcs) {
        lRetVal += gConfig.inline.opener;
        lRetVal += renderArcLines(pArc.arcs, pIndent + INDENT);
        lRetVal += pIndent + gConfig.inline.closer;
    }
    if (null === pArc.arcs) {
        lRetVal += gConfig.inline.opener;
        lRetVal += pIndent + gConfig.inline.closer;
    }
    return lRetVal;
}
function renderArcLine(pArcLine, pIndent) {
    let lRetVal = "";
    if (pArcLine.length > 0) {
        lRetVal = pArcLine
            .slice(0, -1)
            .reduce((pPrev, pArc) => pPrev + pIndent + renderArc(pArc, pIndent) + gConfig.arcline.separator, gConfig.arcline.opener);
        lRetVal += pIndent + renderArc(pArcLine[pArcLine.length - 1], pIndent) + gConfig.arcline.closer;
    }
    return lRetVal;
}
function renderArcLines(pArcLines, pIndent) {
    return pArcLines.reduce((pPrev, pArcLine) => pPrev + renderArcLine(pArcLine, pIndent), "");
}
exports.default = {
    render: _renderAST,
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
