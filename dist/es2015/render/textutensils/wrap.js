/**
 * Wraps text on the first space found before pMaxlength,
 * or exactly pMaxLength when no space was found.
 * Classic "greedy" algorithm.
 * @param {string} pText
 * @param {int} pMaxLength
 * @return {Array of string}
 */
export default (pText, pMaxLength) => {
    let lCharCount = 0;
    const lRetval = [];
    let lStart = 0;
    let lNewStart = 0;
    let lEnd = 0;
    let i = 0;
    const lText = pText.replace(/[\t\n]+/g, " ").replace(/\\n/g, "\n");
    while (i <= lText.length) {
        if (i >= (lText.length)) {
            lRetval.push(lText.substring(lStart, i));
        }
        else if (lText[i] === "\n") {
            lCharCount = 0;
            lEnd = i;
            lRetval.push(lText.substring(lStart, lEnd));
            lStart = lEnd + 1;
        }
        else if ((lCharCount++ >= pMaxLength)) {
            lEnd = lText.substring(0, i).lastIndexOf(" ");
            if (lEnd === -1 || lEnd < lStart) {
                lCharCount = 1;
                lEnd = i;
                lNewStart = i;
            }
            else {
                lCharCount = 0;
                lNewStart = lEnd + 1;
            }
            lRetval.push(lText.substring(lStart, lEnd));
            lStart = lNewStart;
        }
        i++;
    }
    return lRetval;
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
