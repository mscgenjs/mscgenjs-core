import * as mscgenjsast from "../../parse/mscgenjsast";
import aggregatekind from "../astmassage/aggregatekind";
import wrap from "../textutensils/wrap";
import constants from "./constants";
import kind2class from "./kind2class";
import * as geotypes from "./svgelementfactory/geotypes";
import svgelementfactory from "./svgelementfactory/index";
import * as svgutensils from "./svgutensils";

/**
 * Sets the fill color of the passed pElement to the textcolor of
 * the given pArc
 *
 * @param <svgElement> pElement
 * @param <string> pTextColor
 */
function colorText(pElement: SVGTextElement, pTextColor?: string): SVGTextElement {
    if (pTextColor) {
        pElement.setAttribute("style", `fill:${pTextColor};`);
    }
    return pElement;
}

/**
 * Makes the text color blue if there is an url and no text color
 */
function colorLink(pElement: SVGTextElement, pUrl?: string, pTextColor?: string): SVGTextElement {
    return colorText(pElement, (pUrl && !pTextColor) ? "blue" : pTextColor);
}

function renderArcLabelLineBackground(lLabelElement: SVGGElement, pTextbgcolor): SVGElement {
    const lRect = svgelementfactory.createRect(svgutensils.getBBox(lLabelElement), {class: "label-text-background"});
    if (pTextbgcolor) {
        lRect.setAttribute("style", `fill:${pTextbgcolor}; stroke:${pTextbgcolor};`);
    }
    return lRect;
}

function renderLabelText(
    pLine: string,
    pPosition: number,
    pCoords: geotypes.IPoint,
    pClass: string,
    pArc: mscgenjsast.IArc,
): SVGTextElement {
    const lAttributes = pPosition === 0
        ? {
            class : pClass,
            url   : pArc.url,
            id    : pArc.id,
            idurl : pArc.idurl,
        }
        : {
            class : pClass,
            url   : pArc.url,
        };

    return svgelementfactory.createText(
        pLine,
        pCoords,
        lAttributes,
    );
}

function determineClasses(pArcKind: mscgenjsast.ArcKindType, pPostFix: string) {
    const lKind = pArcKind;
    const lClass = kind2class.getClass(lKind);
    const lAggregateClass = kind2class.getAggregateClass(lKind);

    return (lClass as string === lAggregateClass as string)
        ? lClass + pPostFix
        : lAggregateClass + pPostFix + lClass + pPostFix;
}

function createLabelLine(
    pLine: string,
    pMiddle: number,
    pStartY: number,
    pArc: mscgenjsast.IArc,
    pLineNumber: number,
    pOptions,
): SVGTextElement {
    let lY = pStartY + ((pLineNumber + 1 / 4) * svgutensils.calculateTextHeight());
    let lClass = determineClasses(pArc.kind, "-text ");

    if (pOptions.alignLeft) {
        lClass += "anchor-start ";
    }
    if (pOptions.alignAround) {
        lY = pStartY + ((pLineNumber + 1 / 4) * (svgutensils.calculateTextHeight() + constants.LINE_WIDTH));
    }

    return colorLink(
        colorText(
            renderLabelText(pLine, pLineNumber, {x: pMiddle, y: lY}, lClass, pArc),
            pArc.textcolor,
        ),
        pArc.url, pArc.textcolor,
    );
}

function insertEmptyLines(pLines: string[], pOptions) {
    if (pOptions.alignAbove) {
        pLines.forEach(() => {
            pLines.push("");
        });
    }
    if (pOptions.alignAround && pLines.length === 1) {
        pLines.push("");
    }
    return pLines;
}

function determineLabelTop(pLines: string[], pDims, pOptions) {
    if (pOptions.alignAround) {
        return pDims.y -
            (pLines.length - 1) / 2 * (svgutensils.calculateTextHeight() + constants.LINE_WIDTH + 1);
    } else {
        return pDims.y - (pLines.length - 1) / 2 * (svgutensils.calculateTextHeight() + 1);
    }
}

function createLabel(
    pArc: mscgenjsast.IArc,
    pDims,
    pOptions,
    pId?: string,
): SVGGElement {
    const lGroup = svgelementfactory.createGroup(pId);
    pOptions = pOptions || {};

    if (pArc.label) {
        const lMiddle = pDims.x + (pDims.width / 2);
        const lLines = insertEmptyLines(
            splitLabel(pArc.label, pArc.kind, pDims.width, constants.FONT_SIZE, pOptions),
            pOptions,
        );

        let lLabelTop = determineLabelTop(lLines, pDims, pOptions);

        lLines
            .forEach(
                (pLine, pLineNumber) => {
                    if (pLine !== "") {
                        const lText: SVGTextElement =
                            createLabelLine(pLine, lMiddle, lLabelTop, pArc, pLineNumber, pOptions);
                        if (pOptions.ownBackground) {
                            lGroup.appendChild(renderArcLabelLineBackground(lText, pArc.textbgcolor));
                        }
                        lGroup.appendChild(lText);
                    }
                    lLabelTop++;
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

function isWrappableBox(pKind: mscgenjsast.ArcKindType, pWordWrapBoxes: boolean): boolean {
    return "box" === aggregatekind(pKind) && pWordWrapBoxes;
}

function isWrappableEntity(pKind: string, pWordWrapEntites: boolean): boolean {
    return "entity" === pKind && pWordWrapEntites;
}

function isWrappableArc(pKind: any, pWordWrapArcs: boolean): boolean {
    return "box" !== aggregatekind(pKind) && "entity" !== pKind && pWordWrapArcs;
}

function labelIsWrappable(pKind: any /*mscgenjsast.ArcKindType*/, pOptions: mscgenjsast.IOptionsNormalized): boolean {
    return isWrappableBox(pKind, pOptions.wordwrapboxes) ||
            isWrappableEntity(pKind, pOptions.wordwrapentities) ||
            isWrappableArc(pKind, pOptions.wordwraparcs) ||
            typeof pKind === "undefined";
}

function splitLabel(pLabel, pKind, pWidth, pFontSize, pOptions: mscgenjsast.IOptionsNormalized) {
    if (labelIsWrappable(pKind, pOptions)) {
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
