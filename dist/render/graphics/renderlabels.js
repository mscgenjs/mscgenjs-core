"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aggregatekind_1 = require("../astmassage/aggregatekind");
const wrap_1 = require("../textutensils/wrap");
const constants_1 = require("./constants");
const kind2class_1 = require("./kind2class");
const index_1 = require("./svgelementfactory/index");
const svgutensils_1 = require("./svgutensils");
/**
 * Sets the fill color of the passed pElement to the textcolor of
 * the given pArc
 *
 * @param <svgElement> pElement
 * @param <string> pTextColor
 */
function colorText(pElement, pTextColor) {
    if (pTextColor) {
        pElement.setAttribute("style", `fill:${pTextColor};`);
    }
    return pElement;
}
/**
 * Makes the text color blue if there is an url and no text color
 */
function colorLink(pElement, pUrl, pTextColor) {
    return colorText(pElement, (pUrl && !pTextColor) ? "blue" : pTextColor);
}
function renderArcLabelLineBackground(lLabelElement, pTextbgcolor) {
    const lRect = index_1.default.createRect(svgutensils_1.default.getBBox(lLabelElement), { class: "label-text-background" });
    if (pTextbgcolor) {
        lRect.setAttribute("style", `fill:${pTextbgcolor}; stroke:${pTextbgcolor};`);
    }
    return lRect;
}
function renderLabelText(pLine, pPosition, pCoords, pClass, pArc) {
    const lAttributes = pPosition === 0
        ? {
            class: pClass,
            url: pArc.url,
            id: pArc.id,
            idurl: pArc.idurl,
        }
        : {
            class: pClass,
            url: pArc.url,
        };
    return index_1.default.createText(pLine, pCoords, lAttributes);
}
function determineClasses(pArcKind, pOptionsKind, pPostFix) {
    const lKind = pOptionsKind || pArcKind;
    const lClass = kind2class_1.default.getClass(lKind);
    const lAggregateClass = kind2class_1.default.getAggregateClass(lKind);
    return lClass === lAggregateClass
        ? lClass + pPostFix
        : lAggregateClass + pPostFix + lClass + pPostFix;
}
function createLabelLine(pLine, pMiddle, pStartY, pArc, pLineNumber, pOptions) {
    let lY = pStartY + ((pLineNumber + 1 / 4) * svgutensils_1.default.calculateTextHeight());
    let lClass = determineClasses(pArc.kind, pOptions.kind, "-text ");
    if (pOptions.alignLeft) {
        lClass += "anchor-start ";
    }
    if (pOptions.alignAround) {
        lY = pStartY + ((pLineNumber + 1 / 4) * (svgutensils_1.default.calculateTextHeight() + constants_1.default.LINE_WIDTH));
    }
    return colorLink(colorText(renderLabelText(pLine, pLineNumber, { x: pMiddle, y: lY }, lClass, pArc), pArc.textcolor), pArc.url, pArc.textcolor);
}
function createLabel(pArc, pDims, pOptions, pId) {
    const lGroup = index_1.default.createGroup(pId);
    pOptions = pOptions || {};
    if (pArc.label) {
        const lMiddle = pDims.x + (pDims.width / 2);
        const lLines = splitLabel(pArc.label, pArc.kind, pDims.width, constants_1.default.FONT_SIZE, pOptions);
        let lText;
        if (pOptions.alignAbove) {
            lLines.forEach(() => {
                lLines.push("");
            });
        }
        let lStartY = pDims.y - (lLines.length - 1) / 2 * (svgutensils_1.default.calculateTextHeight() + 1);
        if (pOptions.alignAround) {
            if (lLines.length === 1) {
                lLines.push("");
            }
            lStartY =
                pDims.y -
                    (lLines.length - 1) / 2 * (svgutensils_1.default.calculateTextHeight() + constants_1.default.LINE_WIDTH + 1);
        }
        lLines
            .forEach((pLine, pLineNumber) => {
            if (pLine !== "") {
                lText = createLabelLine(pLine, lMiddle, lStartY, pArc, pLineNumber, pOptions);
                if (!!pOptions && pOptions.ownBackground) {
                    lGroup.appendChild(renderArcLabelLineBackground(lText, pArc.textbgcolor));
                }
                lGroup.appendChild(lText);
            }
            lStartY++;
        });
    }
    return lGroup;
}
/**
 * Determine the number characters that fit within pWidth amount
 * of pixels.
 *
 * Uses heuristics that work for 9pt/12px Helvetica in svg's.
 * TODO: make more generic, or use an algorithm that
 *       uses the real width of the text under discourse
 *       (e.g. using its BBox; although I fear this
 *        to be expensive)
 * @param {string} pWidth - the amount to calculate the # characters
 *        to fit in for
 * @param {number} - pFontSize (in px)
 * @return {number} - The maxumum number of characters that'll fit
 */
function _determineMaxTextWidthInChars(pWidth, pFontSize) {
    const lAbsWidth = Math.abs(pWidth);
    const REFERENCE_FONT_SIZE = 12; // px
    if (lAbsWidth <= 160) {
        return lAbsWidth / ((pFontSize / REFERENCE_FONT_SIZE) * 8);
    }
    if (lAbsWidth <= 320) {
        return lAbsWidth / ((pFontSize / REFERENCE_FONT_SIZE) * 6.4);
    }
    if (lAbsWidth <= 480) {
        return lAbsWidth / ((pFontSize / REFERENCE_FONT_SIZE) * 5.9);
    }
    return lAbsWidth / ((pFontSize / REFERENCE_FONT_SIZE) * 5.6);
}
function isWrappableBox(pKind, pWordWrapBoxes) {
    return "box" === aggregatekind_1.default(pKind) && pWordWrapBoxes;
}
function isWrappableEntity(pKind, pWordWrapEntites) {
    return "entity" === pKind && pWordWrapEntites;
}
function isWrappableArc(pKind, pWordWrapArcs) {
    return "box" !== aggregatekind_1.default(pKind) && "entity" !== pKind && pWordWrapArcs;
}
function labelIsWrappable(pKind /*mscgenjsast.ArcKindType*/, pOptions) {
    return isWrappableBox(pKind, pOptions.wordwrapboxes) ||
        isWrappableEntity(pKind, pOptions.wordwrapentities) ||
        isWrappableArc(pKind, pOptions.wordwraparcs) ||
        typeof pKind === "undefined";
}
function splitLabel(pLabel, pKind, pWidth, pFontSize, pOptions) {
    if (labelIsWrappable(pKind, pOptions)) {
        return wrap_1.default(pLabel, _determineMaxTextWidthInChars(pWidth, pFontSize));
    }
    else {
        return pLabel.split("\\n");
    }
}
exports.default = {
    /**
     * createLabel() - renders the text (label, id, url) for a given pArc
     * with a bounding box starting at pStartX, pStartY and of a width of at
     * most pWidth (all in pixels)
     *
     * @param <string> - pId - the unique identification of the textlabe (group) within the svg
     * @param <object> - pArc - the arc of which to render the text
     * @param <object> - pDims - x and y to start on and a width
     * @param <object> - pOptions - alignAbove, alignLeft, alignAround, wordWrapArcs, ownBackground, underline
     */
    createLabel,
    /**
     * splitLabel () - splits the given pLabel into an array of strings
     * - if the arc kind passed is a box the split occurs regardless
     * - if the arc kind passed is something else, the split occurs
     *   only if the _word wrap arcs_ option is true.
     *
     * @param <string> - pLabel
     * @param <string> - pKind
     * @param <number> - pWidth
     * @param <number> - pFontSize (in px)
     * @param <object> - options (the one ones heeded: wordwraparcs, wordwrapentities, wordwrapboxes)
     * @return <array of strings> - lLines
     */
    splitLabel,
};
