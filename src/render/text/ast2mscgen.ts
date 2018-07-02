import aggregatekind from "../astmassage/aggregatekind";
import {XuAdaptor} from "./ast2xu";

export class MscGenAdaptor extends XuAdaptor {

    public init(pConfig = {}) {
        super.init(
            Object.assign(
                {
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
                    inline : {
                        opener : `;${this.eol}`,
                        closer : "#",
                    },
                },
                pConfig,
            ),
        );
    }

    protected renderKind(pKind) {
        if ("inline_expression" === aggregatekind(pKind)) {
            return "--";
        }
        return pKind;
    }

    protected optionIsValid(pOption) {
        if (Boolean(pOption.value) && typeof (pOption.value) === "string") {
            return pOption.value.toLowerCase() !== "auto";
        }
        return true;
    }
}

export default {
    render: (pAST, pMinimal) => {
        const lAdaptor = new MscGenAdaptor(pMinimal);
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
