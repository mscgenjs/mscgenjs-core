import { XuAdaptor } from "./ast2xu";
class MsGennyAdaptor extends XuAdaptor {
	init() {
		super.init({
			supportedEntityAttributes: ["label"],
			supportedArcAttributes: ["label"],
			program: {
				opener: "",
				closer: "",
			},
			option: {
				opener: "",
				separator: `,${this.eol}`,
				closer: `;${this.eol}${this.eol}`,
			},
			entity: {
				opener: "",
				separator: `,${this.eol}`,
				closer: `;${this.eol}${this.eol}`,
			},
			arcline: {
				opener: "",
				separator: `,${this.eol}`,
				closer: `;${this.eol}`,
			},
			inline: {
				opener: ` {${this.eol}`,
				closer: "}",
			},
			attribute: {
				opener: "",
				separator: "",
				closer: "",
			},
		});
	}
	renderEntityName(pString) {
		return this.entityNameIsQuotable(pString) ? `"${pString}"` : pString;
	}
	renderAttribute(pAttribute) {
		let lRetVal = "";
		if (pAttribute.name && pAttribute.value) {
			lRetVal += ` : "${pAttribute.value}"`;
		}
		return lRetVal;
	}
	entityNameIsQuotable(pString) {
		const lMatchResult = pString.match(/[^;, "\t\n\r=\-><:{*]+/gi);
		if (lMatchResult) {
			return lMatchResult.length !== 1;
		} else {
			return pString !== "*";
		}
	}
}
export const render = (pAST) => {
	const lAdaptor = new MsGennyAdaptor();
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
