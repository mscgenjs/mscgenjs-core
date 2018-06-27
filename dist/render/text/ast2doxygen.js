"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aggregatekind_1 = __importDefault(require("../astmassage/aggregatekind"));
const escape_1 = __importDefault(require("../textutensils/escape"));
const ast2thing_1 = __importDefault(require("./ast2thing"));
const INDENT = "  ";
const SP = " ";
const EOL = "\n";
const LINE_PREFIX = " * ";
function renderKind(pKind) {
    if ("inline_expression" === aggregatekind_1.default(pKind)) {
        return "--";
    }
    return pKind;
}
function renderAttribute(pAttribute) {
    let lRetVal = "";
    /* istanbul ignore else */
    if (pAttribute.name && pAttribute.value) {
        lRetVal += `${pAttribute.name}="${escape_1.default.escapeString(pAttribute.value)}"`;
    }
    return lRetVal;
}
function optionIsValid(pOption) {
    if (Boolean(pOption.value) && typeof (pOption.value) === "string") {
        return pOption.value.toLowerCase() !== "auto";
    }
    return true;
}
function renderComments() {
    /* rendering comments within comments, that are eventually output
        * to doxygen html - don't think that's going to be necessary
        * or desired functionality. If it is remember to be able to
        * - have a solution for nested comments (otherwise: interesting results)
        * - have a solution for comments that have an other meaning (# this is
        *    a comment -> doxygen translates this as markdown title)
        * - handling languages different from c/ java/ d that have alternative
        *   comment/ documentation sections
        */
    return "";
}
exports.default = {
    render(pAST) {
        return ast2thing_1.default.render(pAST, {
            renderCommentfn: renderComments,
            renderAttributefn: renderAttribute,
            optionIsValidfn: optionIsValid,
            renderKindfn: renderKind,
            supportedOptions: ["hscale", "width", "arcgradient", "wordwraparcs"],
            supportedEntityAttributes: [
                "label", "idurl", "id", "url",
                "linecolor", "textcolor", "textbgcolor",
                "arclinecolor", "arctextcolor", "arctextbgcolor", "arcskip",
            ],
            supportedArcAttributes: [
                "label", "idurl", "id", "url",
                "linecolor", "textcolor", "textbgcolor",
                "arclinecolor", "arctextcolor", "arctextbgcolor", "arcskip",
            ],
            program: {
                opener: `${LINE_PREFIX}\\msc${EOL}`,
                closer: `${LINE_PREFIX}\\endmsc`,
            },
            option: {
                opener: LINE_PREFIX + INDENT,
                separator: `,${EOL}${LINE_PREFIX}${INDENT}`,
                closer: `;${EOL}${LINE_PREFIX}${EOL}`,
            },
            entity: {
                opener: LINE_PREFIX + INDENT,
                separator: `,${EOL}${LINE_PREFIX}${INDENT}`,
                closer: `;${EOL}${LINE_PREFIX}${EOL}`,
            },
            attribute: {
                opener: `${SP}[`,
                separator: `,${SP}`,
                closer: "]",
            },
            arcline: {
                opener: LINE_PREFIX + INDENT,
                separator: `,${EOL}${LINE_PREFIX}${INDENT}`,
                closer: `;${EOL}`,
            },
            inline: {
                opener: `;${EOL}`,
                closer: `${LINE_PREFIX}#`,
            },
        });
    },
};
