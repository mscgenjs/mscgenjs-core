import aggregatekind from "../astmassage/aggregatekind";
import wrap from "../textutensils/wrap";
import constants from "./constants";
import kind2class from "./kind2class";
import svgelementfactory from "./svgelementfactory/index";
import svgutensils from "./svgutensils";

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
}

/**
 * Makes the text color blue if there is an url and no text color
 *
 * @param <svgElement> pElement
 * @param <string> pUrl
 * @param <string> pTextColor
 */
function colorLink(pElement, pUrl, pTextColor) {
    colorText(pElement, (pUrl && !pTextColor) ? "blue" : pTextColor);
}

function renderArcLabelLineBackground(lLabelElement, pTextbgcolor) {
    const lRect = svgelementfactory.createRect(svgutensils.getBBox(lLabelElement), "label-text-background");
    if (pTextbgcolor) {
        lRect.setAttribute("style", `fill:${pTextbgcolor}; stroke:${pTextbgcolor};`);
    }
    return lRect;
}

function renderLabelText(pPosition, pLine, pMiddle, pY, pClass, pArc): SVGTextElement {
    let lText: SVGTextElement;
    if (pPosition === 0) {
        lText = svgelementfactory.createText(
            pLine,
            {
                x : pMiddle,
                y : pY,
            },
            {
                class : pClass,
                url   : pArc.url,
                id    : pArc.id,
                idurl : pArc.idurl,
            },
        );
    } else {
        lText = svgelementfactory.createText(
            pLine,
            {
                x : pMiddle,
                y : pY,
            },
            {
                class : pClass,
                url   : pArc.url,
            },
        );
    }
    return lText;
}

function determineClasses(pArcKind, pOptionsKind, pPostFix) {
    const lKind = pOptionsKind || pArcKind;
    const lClass = kind2class.getClass(lKind);
    const lAggregateClass = kind2class.getAggregateClass(lKind);

    return lClass === lAggregateClass
        ? lClass + pPostFix
        : lAggregateClass + pPostFix + lClass + pPostFix;
}

function createLabelLine(pLine, pMiddle, pStartY, pArc, pPosition, pOptions): SVGTextElement {
    let lY = pStartY + ((pPosition + 1 / 4) * svgutensils.calculateTextHeight());
    let lClass = determineClasses(pArc.kind, pOptions && pOptions.kind, "-text ");

    if (!!pOptions) {
        if (pOptions.alignLeft) {
            lClass += "anchor-start ";
        }
        if (pOptions.alignAround) {
            lY = pStartY + ((pPosition + 1 / 4) * (svgutensils.calculateTextHeight() + constants.LINE_WIDTH));
        }
    }
    const lText = renderLabelText(pPosition, pLine, pMiddle, lY, lClass, pArc);

    colorText(lText, pArc.textcolor);
    colorLink(lText, pArc.url, pArc.textcolor);

    return lText;
}

function createLabel(pArc, pDims, pOptions, pId?) {
    const lGroup = svgelementfactory.createGroup(pId);

    if (pArc.label) {
        const lMiddle = pDims.x + (pDims.width / 2);
        const lLines = splitLabel(
            pArc.label,
            pArc.kind,
            pDims.width,
            constants.FONT_SIZE,
            pOptions,
        );
        let lText: SVGTextElement;
        if (!!pOptions && pOptions.alignAbove) {
            lLines.forEach(() => {
                lLines.push("");
            });
        }

        let lStartY = pDims.y - (lLines.length - 1) / 2 * (svgutensils.calculateTextHeight() + 1);
        if (!!pOptions && pOptions.alignAround) {
            if (lLines.length === 1) {
                lLines.push("");
            }
            lStartY =
                pDims.y -
                (lLines.length - 1) / 2 * (svgutensils.calculateTextHeight() + constants.LINE_WIDTH + 1);
        }
        lLines
            .forEach(
                (pLine, pLineNumber) => {
                    if (pLine !== "") {
                        lText = createLabelLine(pLine, lMiddle, lStartY, pArc, pLineNumber, pOptions);
                        if (!!pOptions && pOptions.ownBackground) {
                            lGroup.appendChild(renderArcLabelLineBackground(lText, pArc.textbgcolor));
                        }
                        lGroup.appendChild(lText);
                    }
                    lStartY++;
                },
            );
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

function splitLabel(pLabel, pKind, pWidth, pFontSize, pOptions) {
    if (("box" === aggregatekind(pKind) && pOptions.wordwrapboxes) ||
        ("entity" === pKind && pOptions.wordwrapentities) ||
        ("box" !== aggregatekind(pKind) && "entity" !== pKind && pOptions.wordwraparcs) ||
        typeof pKind === "undefined"
    ) {
        return wrap(pLabel, _determineMaxTextWidthInChars(pWidth, pFontSize));
    } else {
        return pLabel.split("\\n");
    }
}

export default {
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
