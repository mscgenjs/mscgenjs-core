import aggregatekind from "../astmassage/aggregatekind";
import escape from "../textutensils/escape";
import ast2thing from "./ast2thing";

let INDENT = "  ";
let SP = " ";
let EOL = "\n";

function init(pMinimal) {
    if (true === pMinimal) {
        INDENT = "";
        SP = "";
        EOL = "";
    } else {
        INDENT = "  ";
        SP = " ";
        EOL = "\n";
    }
}

function renderKind(pKind) {
    if ("inline_expression" === aggregatekind(pKind)) {
        return "--";
    }
    return pKind;
}

function renderAttribute(pAttribute) {
    let lRetVal = "";
    if (pAttribute.name && pAttribute.value) {
        lRetVal += `${pAttribute.name}="${escape.escapeString(pAttribute.value)}"`;
    }
    return lRetVal;
}

function optionIsValid(pOption) {
    if (Boolean(pOption.value) && typeof (pOption.value) === "string") {
        return pOption.value.toLowerCase() !== "auto";
    }
    return true;
}

export default {
    render(pAST, pMinimal) {
        init(pMinimal);
        return ast2thing.render(pAST, {
            renderAttributefn : renderAttribute,
            optionIsValidfn: optionIsValid,
            renderKindfn : renderKind,
            supportedOptions : ["hscale", "width", "arcgradient", "wordwraparcs"],
            supportedEntityAttributes : [
                "label", "idurl", "id", "url",
                "linecolor", "textcolor", "textbgcolor",
                "arclinecolor", "arctextcolor", "arctextbgcolor", "arcskip",
            ],
            supportedArcAttributes : [
                "label", "idurl", "id", "url",
                "linecolor", "textcolor", "textbgcolor",
                "arclinecolor", "arctextcolor", "arctextbgcolor", "arcskip",
            ],
            program : {
                opener : `msc${SP}{${EOL}`,
                closer : "}",
            },
            option : {
                opener : INDENT,
                separator : `,${EOL}${INDENT}`,
                closer : `;${EOL}${EOL}`,
            },
            entity : {
                opener: INDENT,
                separator : `,${EOL}${INDENT}`,
                closer : `;${EOL}${EOL}`,
            },
            attribute : {
                opener : `${SP}[`,
                separator : `,${SP}`,
                closer : "]",

            },
            arcline : {
                opener : INDENT,
                separator : `,${EOL}${INDENT}`,
                closer : `;${EOL}`,
            },
            inline : {
                opener : `;${EOL}`,
                closer : "#",
            },
        });
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
