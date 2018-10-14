"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var aggregatekind_1 = __importDefault(require("../astmassage/aggregatekind"));
var wrap_1 = __importDefault(require("../textutensils/wrap"));
var constants_1 = __importDefault(require("./constants"));
var kind2class_1 = __importDefault(require("./kind2class"));
var index_1 = __importDefault(require("./svgelementfactory/index"));
var svgutensils_1 = __importDefault(require("./svgutensils"));
/**
 * Sets the fill color of the passed pElement to the textcolor of
 * the given pArc
 *
 * @param <svgElement> pElement
 * @param <string> pTextColor
 */
function colorText(pElement, pTextColor) {
    if (pTextColor) {
        pElement.setAttribute("style", "fill:" + pTextColor + ";");
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
    var lRect = index_1["default"].createRect(svgutensils_1["default"].getBBox(lLabelElement), { "class": "label-text-background" });
    if (pTextbgcolor) {
        lRect.setAttribute("style", "fill:" + pTextbgcolor + "; stroke:" + pTextbgcolor + ";");
    }
    return lRect;
}
function renderLabelText(pLine, pPosition, pCoords, pClass, pArc) {
    var lAttributes = pPosition === 0
        ? {
            "class": pClass,
            url: pArc.url,
            id: pArc.id,
            idurl: pArc.idurl
        }
        : {
            "class": pClass,
            url: pArc.url
        };
    return index_1["default"].createText(pLine, pCoords, lAttributes);
}
function determineClasses(pArcKind, pPostFix) {
    var lKind = pArcKind;
    var lClass = kind2class_1["default"].getClass(lKind);
    var lAggregateClass = kind2class_1["default"].getAggregateClass(lKind);
    return (lClass === lAggregateClass)
        ? lClass + pPostFix
        : lAggregateClass + pPostFix + lClass + pPostFix;
}
function createLabelLine(pLine, pMiddle, pStartY, pArc, pLineNumber, pOptions) {
    var lY = pStartY + ((pLineNumber + 1 / 4) * svgutensils_1["default"].calculateTextHeight());
    var lClass = determineClasses(pArc.kind, "-text ");
    if (pOptions.alignLeft) {
        lClass += "anchor-start ";
    }
    if (pOptions.alignAround) {
        lY = pStartY + ((pLineNumber + 1 / 4) * (svgutensils_1["default"].calculateTextHeight() + constants_1["default"].LINE_WIDTH));
    }
    return colorLink(colorText(renderLabelText(pLine, pLineNumber, { x: pMiddle, y: lY }, lClass, pArc), pArc.textcolor), pArc.url, pArc.textcolor);
}
function insertEmptyLines(pLines, pOptions) {
    if (pOptions.alignAbove) {
        pLines.forEach(function () {
            pLines.push("");
        });
    }
    if (pOptions.alignAround && pLines.length === 1) {
        pLines.push("");
    }
    return pLines;
}
function determineLabelTop(pLines, pDims, pOptions) {
    if (pOptions.alignAround) {
        return pDims.y -
            (pLines.length - 1) / 2 * (svgutensils_1["default"].calculateTextHeight() + constants_1["default"].LINE_WIDTH + 1);
    }
    else {
        return pDims.y - (pLines.length - 1) / 2 * (svgutensils_1["default"].calculateTextHeight() + 1);
    }
}
function createLabel(pArc, pDims, pOptions, pId) {
    var lGroup = index_1["default"].createGroup(pId);
    pOptions = pOptions || {};
    if (pArc.label) {
        var lMiddle_1 = pDims.x + (pDims.width / 2);
        var lLines = insertEmptyLines(splitLabel(pArc.label, pArc.kind, pDims.width, constants_1["default"].FONT_SIZE, pOptions), pOptions);
        var lLabelTop_1 = determineLabelTop(lLines, pDims, pOptions);
        lLines
            .forEach(function (pLine, pLineNumber) {
            if (pLine !== "") {
                var lText = createLabelLine(pLine, lMiddle_1, lLabelTop_1, pArc, pLineNumber, pOptions);
                if (pOptions.ownBackground) {
                    lGroup.appendChild(renderArcLabelLineBackground(lText, pArc.textbgcolor));
                }
                lGroup.appendChild(lText);
            }
            lLabelTop_1++;
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
    var lAbsWidth = Math.abs(pWidth);
    var REFERENCE_FONT_SIZE = 12; // px
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
    return "box" === aggregatekind_1["default"](pKind) && pWordWrapBoxes;
}
function isWrappableEntity(pKind, pWordWrapEntites) {
    return "entity" === pKind && pWordWrapEntites;
}
function isWrappableArc(pKind, pWordWrapArcs) {
    return "box" !== aggregatekind_1["default"](pKind) && "entity" !== pKind && pWordWrapArcs;
}
function labelIsWrappable(pKind /*mscgenjsast.ArcKindType*/, pOptions) {
    return isWrappableBox(pKind, pOptions.wordwrapboxes) ||
        isWrappableEntity(pKind, pOptions.wordwrapentities) ||
        isWrappableArc(pKind, pOptions.wordwraparcs) ||
        typeof pKind === "undefined";
}
function splitLabel(pLabel, pKind, pWidth, pFontSize, pOptions) {
    if (labelIsWrappable(pKind, pOptions)) {
        return wrap_1["default"](pLabel, _determineMaxTextWidthInChars(pWidth, pFontSize));
    }
    else {
        return pLabel.split("\\n");
    }
}
exports["default"] = {
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
    createLabel: createLabel,
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
    splitLabel: splitLabel
};