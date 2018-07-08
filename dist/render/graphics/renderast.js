"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const aggregatekind_1 = __importDefault(require("../astmassage/aggregatekind"));
const flatten_1 = __importDefault(require("../astmassage/flatten"));
const constants_1 = __importDefault(require("./constants"));
const entities_1 = __importDefault(require("./entities"));
const idmanager_1 = __importDefault(require("./idmanager"));
const kind2class_1 = __importDefault(require("./kind2class"));
const markermanager_1 = __importDefault(require("./markermanager"));
const renderlabels_1 = __importDefault(require("./renderlabels"));
const renderskeleton_1 = __importDefault(require("./renderskeleton"));
const renderutensils_1 = __importDefault(require("./renderutensils"));
const rowmemory_1 = __importDefault(require("./rowmemory"));
const index_1 = __importDefault(require("./svgelementfactory/index"));
const svgutensils_1 = __importDefault(require("./svgutensils"));
const PAD_VERTICAL = 3;
const DEFAULT_ARCROW_HEIGHT = 38; // chart only
const DEFAULT_ARC_GRADIENT = 0; // chart only
/* sensible default - get overwritten in bootstrap */
const gChart = Object.seal({
    arcRowHeight: DEFAULT_ARCROW_HEIGHT,
    arcGradient: DEFAULT_ARC_GRADIENT,
    arcEndX: 0,
    wordWrapArcs: false,
    mirrorEntitiesOnBottom: false,
    regularArcTextVerticalAlignment: "middle",
    maxDepth: 0,
    document: {},
    layer: {
        lifeline: {},
        sequence: {},
        notes: {},
        inline: {},
        watermark: {},
    },
});
let gInlineExpressionMemory = [];
function getParentElement(pWindow, pParentElementId) {
    return pWindow.document.getElementById(pParentElementId) || pWindow.document.body;
}
function render(pAST, pWindow, pParentElementId, pRenderOptions) {
    const lFlattenedAST = Object.freeze(flatten_1.default.flatten(pAST));
    const lParentElement = getParentElement(pWindow, pParentElementId);
    idmanager_1.default.setPrefix(pParentElementId);
    renderASTPre(lFlattenedAST, pWindow, lParentElement, pRenderOptions || {});
    renderASTMain(lFlattenedAST);
    renderASTPost(lFlattenedAST);
    return svgutensils_1.default.webkitNamespaceBugWorkaround(lParentElement.innerHTML);
}
function renderASTPre(pAST, pWindow, pParentElement, pOptions) {
    gChart.document = renderskeleton_1.default.bootstrap(pWindow, pParentElement, idmanager_1.default.get(), markermanager_1.default.getMarkerDefs(idmanager_1.default.get(), pAST), pOptions);
    gChart.mirrorEntitiesOnBottom = pOptions.mirrorEntitiesOnBottom;
    gChart.regularArcTextVerticalAlignment = pOptions.regularArcTextVerticalAlignment;
    svgutensils_1.default.init(gChart.document);
    gChart.layer = createLayerShortcuts(gChart.document);
    gChart.maxDepth = pAST.depth;
    preProcessOptions(gChart, pAST.options);
}
function renderASTMain(pAST) {
    renderEntities(pAST.entities, 0, pAST.options);
    rowmemory_1.default.clear(entities_1.default.getDims().height, gChart.arcRowHeight);
    renderArcRows(pAST.arcs, pAST.entities, pAST.options);
    if (gChart.mirrorEntitiesOnBottom) {
        renderEntitiesOnBottom(pAST.entities, pAST.options);
    }
}
function renderASTPost(pAST) {
    let lCanvas = calculateCanvasDimensions(pAST);
    /* canvg ignores the background-color on svg level and makes the background
        * transparent in stead. To work around this insert a white rectangle the size
        * of the canvas in the background layer.
        *
        * We do this _before_ scaling is applied to the svg
        */
    renderBackground(lCanvas);
    lCanvas = postProcessOptions(pAST.options, lCanvas);
    renderSvgElement(lCanvas);
}
function createLayerShortcuts(pDocument) {
    return {
        lifeline: pDocument.getElementById(idmanager_1.default.get("_lifelines")),
        sequence: pDocument.getElementById(idmanager_1.default.get("_sequence")),
        notes: pDocument.getElementById(idmanager_1.default.get("_notes")),
        inline: pDocument.getElementById(idmanager_1.default.get("_arcspans")),
        watermark: pDocument.getElementById(idmanager_1.default.get("_watermark")),
    };
}
function preProcessOptionsArcs(pChart, pOptions) {
    pChart.arcRowHeight = DEFAULT_ARCROW_HEIGHT;
    pChart.arcGradient = DEFAULT_ARC_GRADIENT;
    pChart.wordWrapArcs = false;
    if (pOptions.arcgradient) {
        pChart.arcRowHeight = parseInt(pOptions.arcgradient, 10) + DEFAULT_ARCROW_HEIGHT;
        pChart.arcGradient = parseInt(pOptions.arcgradient, 10) + DEFAULT_ARC_GRADIENT;
    }
    pChart.wordWrapArcs = Boolean(pOptions.wordwraparcs);
}
/**
 * preProcessOptions() -
 * - resets the global variables governing entity width and height,
 *   row height to their default values
 * - modifies them if passed
 *   - hscale (influences the entity width and inter entity spacing defaults)
 *   - arcgradient (influences the arc row height, sets the global arc gradient)
 *   - wordwraparcs (sets the wordwraparcs global)
 *
 * Note that width is not processed here as this can only be done
 * reliably after most rendering calculations have been executed.
 *
 * @param <object> - pOptions - the option part of the AST
 */
function preProcessOptions(pChart, pOptions) {
    entities_1.default.init(pOptions && pOptions.hscale);
    preProcessOptionsArcs(pChart, pOptions);
}
function calculateCanvasDimensions(pAST) {
    const lDepthCorrection = renderutensils_1.default.determineDepthCorrection(pAST.depth, constants_1.default.LINE_WIDTH);
    const lRowInfo = rowmemory_1.default.getLast();
    const lCanvas = {
        width: (pAST.entities.length * entities_1.default.getDims().interEntitySpacing) + lDepthCorrection,
        height: Boolean(gChart.mirrorEntitiesOnBottom)
            ? (2 * entities_1.default.getDims().height) + lRowInfo.y + lRowInfo.height + 2 * PAD_VERTICAL
            : lRowInfo.y + (lRowInfo.height / 2) + 2 * PAD_VERTICAL,
        horizontaltransform: (entities_1.default.getDims().interEntitySpacing + lDepthCorrection - entities_1.default.getDims().width) / 2,
        autoscale: !!pAST.options && !!pAST.options.width && pAST.options.width === "auto",
        verticaltransform: PAD_VERTICAL,
        scale: 1,
    };
    lCanvas.x = 0 - lCanvas.horizontaltransform;
    lCanvas.y = 0 - lCanvas.verticaltransform;
    return lCanvas;
}
function renderBackground(pCanvas) {
    const lBackground = gChart.document.getElementById(idmanager_1.default.get("_background"));
    if (lBackground) {
        lBackground.appendChild(index_1.default.createRect(pCanvas, { class: "bglayer" }));
    }
}
function renderWatermark(pWatermark, pCanvas) {
    gChart.layer.watermark.appendChild(index_1.default.createDiagonalText(pWatermark, pCanvas, "watermark"));
}
function postProcessOptions(pOptions, pCanvas) {
    if (pOptions.watermark) {
        renderWatermark(pOptions.watermark, pCanvas);
    }
    if (pOptions.width && pOptions.width !== "auto") {
        pCanvas = renderutensils_1.default.scaleCanvasToWidth(pOptions.width, pCanvas);
    }
    return pCanvas;
}
function renderSvgElement(pCanvas) {
    const lSvgElement = gChart.document.getElementById(idmanager_1.default.get());
    const lBody = gChart.document.getElementById(idmanager_1.default.get("_body"));
    if (lBody && lSvgElement) {
        lBody.setAttribute("transform", `translate(${pCanvas.horizontaltransform},${pCanvas.verticaltransform}) ` +
            `scale(${pCanvas.scale},${pCanvas.scale})`);
        if (!!pCanvas.autoscale && pCanvas.autoscale === true) {
            index_1.default.updateSVG(lSvgElement, {
                width: "100%",
                height: "100%",
                viewBox: `0 0 ${pCanvas.width.toString()} ${pCanvas.height.toString()}`,
            });
        }
        else {
            index_1.default.updateSVG(lSvgElement, {
                width: pCanvas.width.toString(),
                height: pCanvas.height.toString(),
                viewBox: `0 0 ${pCanvas.width.toString()} ${pCanvas.height.toString()}`,
            });
        }
    }
}
/* ----------------------START entity shizzle-------------------------------- */
function renderEntitiesOnBottom(pEntities, pOptions) {
    const lLifeLineSpacerY = rowmemory_1.default.getLast().y + (rowmemory_1.default.getLast().height + gChart.arcRowHeight) / 2;
    /*
        insert a life line between the last arc and the entities so there's
        some visual breathing room
        */
    createLifeLines(pEntities, "arcrow", gChart.arcRowHeight, lLifeLineSpacerY).forEach((pLifeLine) => {
        gChart.layer.lifeline.appendChild(pLifeLine);
    });
    /*
        We used to have a simple 'use' element here that refered to the
        entities on top. It's cheaper and faster, however in Firefox
        56.0b6 (developer edition) they rendered with the wrong font
        in the best of cases, and as solid black boxes in the worst.

        Looks like a bug in Firefox, that should be fixed there, but
        implementing this workaround is safer. It also does away with
        `use` s that seem to be hard to implement well for svg render engine
        builders (ref the links in uses that didn't work in some browsers).
        */
    renderEntities(pEntities, lLifeLineSpacerY + gChart.arcRowHeight / 2, pOptions);
}
/**
 * renderEntities() - renders the given pEntities (subtree of the AST) into
 * the gChart.layer.sequence layer
 *
 * @param <object> - pEntities - the entities to render
 * @param <int> - pEntityYPos - the Y position to render the entities on
 * @param <object> - pOptions
 *
 */
function renderEntities(pEntities, pEntityYPos, pOptions) {
    gChart.layer.sequence.appendChild(entities_1.default.renderEntities(pEntities, pEntityYPos, pOptions));
    gChart.arcEndX =
        entities_1.default.getDims().entityXHWM -
            entities_1.default.getDims().interEntitySpacing + entities_1.default.getDims().width;
}
/* ------------------------END entity shizzle-------------------------------- */
function renderBroadcastArc(pArc, pEntities, pRowMemory, pRowNumber, pOptions) {
    let xTo = 0;
    const lLabel = pArc.label;
    const xFrom = entities_1.default.getX(pArc.from);
    pArc.label = "";
    pEntities.forEach((pEntity) => {
        let lElement = {};
        if (pEntity.name !== pArc.from) {
            xTo = entities_1.default.getX(pEntity.name);
            lElement = createArc(pArc, xFrom, xTo, pRowNumber, pOptions);
            pRowMemory.push({
                layer: gChart.layer.sequence,
                element: lElement,
            });
        }
    });
    pArc.label = lLabel;
}
function renderRegularArc(pArc, pEntities, pRowMemory, pRowNumber, pOptions) {
    let lElement = index_1.default.createGroup();
    if (pArc.from && pArc.to) {
        if (pArc.to === "*") { // it's a broadcast arc
            renderBroadcastArc(pArc, pEntities, pRowMemory, pRowNumber, pOptions);
            /* creates a label on the current line, smack in the middle */
            lElement =
                renderlabels_1.default.createLabel(pArc, {
                    x: 0,
                    y: rowmemory_1.default.get(pRowNumber).y,
                    width: gChart.arcEndX,
                }, Object.assign({
                    alignAround: true,
                    ownBackground: true,
                }, lodash_clonedeep_1.default(pOptions)));
            pRowMemory.push({
                title: pArc.title,
                layer: gChart.layer.sequence,
                element: lElement,
            });
        }
        else { // it's a regular arc
            lElement =
                createArc(pArc, entities_1.default.getX(pArc.from), entities_1.default.getX(pArc.to), pRowNumber, pOptions);
            pRowMemory.push({
                title: pArc.title,
                layer: gChart.layer.sequence,
                element: lElement,
            });
        } // / lTo or pArc.from === "*"
    } // if both a from and a to
    return lElement;
}
function getArcRowHeight(pArcRow, pEntities, pOptions) {
    let lRetval = 0;
    pArcRow.forEach((pArc) => {
        let lElement;
        switch (aggregatekind_1.default(pArc.kind)) {
            case ("empty"):
                lElement = renderEmptyArc(pArc, 0);
                break;
            case ("box"):
                lElement = createBox(entities_1.default.getOAndD(pArc.from, pArc.to), pArc, 0, pOptions);
                break;
            case ("inline_expression"):
                lElement = renderInlineExpressionLabel(pArc, 0);
                break;
            default:
                const lArc = lodash_clonedeep_1.default(pArc);
                lArc.arcskip = 0; /* ignore arc skips when calculating row heights */
                lElement = renderRegularArc(lArc, pEntities, [], 0, pOptions); // TODO is 0 a good row number for this?
        } // switch
        lRetval = Math.max(lRetval, svgutensils_1.default.getBBox(lElement).height + 2 * constants_1.default.LINE_WIDTH);
    }); // for all arcs in a row
    return lRetval;
}
function renderArcRow(pArcRow, pRowNumber, pEntities, pOptions) {
    let lArcRowClass = "arcrow";
    const lRowMemory = [];
    pArcRow.forEach((pArc) => {
        let lElement = {};
        switch (aggregatekind_1.default(pArc.kind)) {
            case ("empty"):
                lElement = renderEmptyArc(pArc, rowmemory_1.default.get(pRowNumber).y);
                if ("..." === pArc.kind) {
                    lArcRowClass = "arcrowomit";
                }
                lRowMemory.push({
                    layer: gChart.layer.sequence,
                    element: lElement,
                });
                break;
            case ("box"):
                lElement = createBox(entities_1.default.getOAndD(pArc.from, pArc.to), pArc, rowmemory_1.default.get(pRowNumber).y, pOptions);
                lRowMemory.push({
                    title: pArc.title,
                    layer: gChart.layer.notes,
                    element: lElement,
                });
                break;
            case ("inline_expression"):
                lElement = renderInlineExpressionLabel(pArc, rowmemory_1.default.get(pRowNumber).y);
                lRowMemory.push({
                    layer: gChart.layer.notes,
                    element: lElement,
                });
                gInlineExpressionMemory.push({
                    arc: pArc,
                    rownum: pRowNumber,
                });
                break;
            default:
                lElement = renderRegularArc(pArc, pEntities, lRowMemory, pRowNumber, pOptions);
        } // switch
    }); // for all arcs in a row
    /*
        *  only here we can determine the height of the row and the y position
        */
    createLifeLines(pEntities, lArcRowClass, rowmemory_1.default.get(pRowNumber).height, rowmemory_1.default.get(pRowNumber).y).forEach((pLifeLine) => {
        gChart.layer.lifeline.appendChild(pLifeLine);
    });
    lRowMemory.forEach((pRowMemoryLine) => {
        if (pRowMemoryLine.element) {
            if (pRowMemoryLine.title) {
                pRowMemoryLine.element.appendChild(index_1.default.createTitle(pRowMemoryLine.title));
            }
            pRowMemoryLine.layer.appendChild(pRowMemoryLine.element);
        }
    });
}
function precalculateArcRowHeights(pArcRows, pEntities, pOptions) {
    let lRealRowNumber = 0;
    pArcRows.forEach((pArcRow, pRowNumber) => {
        if (pArcRow.every((pArc) => pArc.isVirtual)) {
            rowmemory_1.default.set(pRowNumber, Math.max(rowmemory_1.default.get(pRowNumber).height, getArcRowHeight(pArcRow, pEntities, pOptions)));
        }
        else {
            rowmemory_1.default.set(pRowNumber, Math.max(rowmemory_1.default.get(pRowNumber).height, getArcRowHeight(pArcRow, pEntities, pOptions)), lRealRowNumber);
            lRealRowNumber++;
        }
    });
}
/** renderArcRows() - renders the arcrows from an AST
 *
 * @param <object> - pArcRows - the arc rows to render
 * @param <object> - pEntities - the entities to consider
 */
function renderArcRows(pArcRows, pEntities, pOptions) {
    gInlineExpressionMemory = [];
    /* put some space between the entities and the arcs */
    createLifeLines(pEntities, "arcrow", gChart.arcRowHeight, rowmemory_1.default.get(-1).y).forEach((pLifeLine) => {
        gChart.layer.lifeline.appendChild(pLifeLine);
    });
    precalculateArcRowHeights(pArcRows, pEntities, pOptions);
    pArcRows.forEach((pArcRow, pCounter) => {
        renderArcRow(pArcRow, pCounter, pEntities, pOptions);
    });
    renderInlineExpressions(gInlineExpressionMemory);
} // function
/**
 * renderInlineExpressionLabel() - renders the label of an inline expression
 * (/ arc spanning arc)
 *
 * @param <object> pArc - the arc spanning arc
 * @param <number pY - where to start
 */
function renderInlineExpressionLabel(pArc, pY) {
    const lOnD = entities_1.default.getOAndD(pArc.from, pArc.to);
    const FOLD_SIZE = 7;
    const lLabelContentAlreadyDetermined = pY > 0;
    const lMaxDepthCorrection = gChart.maxDepth * 2 * constants_1.default.LINE_WIDTH;
    const lMaxWidth = (lOnD.to - lOnD.from) +
        (entities_1.default.getDims().interEntitySpacing - 2 * constants_1.default.LINE_WIDTH) -
        FOLD_SIZE -
        constants_1.default.LINE_WIDTH;
    const lStart = (lOnD.from -
        ((entities_1.default.getDims().interEntitySpacing - 3 * constants_1.default.LINE_WIDTH - lMaxDepthCorrection) / 2) -
        (gChart.maxDepth - pArc.depth) * 2 * constants_1.default.LINE_WIDTH);
    const lGroup = index_1.default.createGroup();
    if (!lLabelContentAlreadyDetermined) {
        pArc.label = pArc.kind + (pArc.label ? ": " + pArc.label : "");
    }
    const lTextGroup = renderlabels_1.default.createLabel(pArc, {
        x: lStart + constants_1.default.LINE_WIDTH - (lMaxWidth / 2),
        y: pY + gChart.arcRowHeight / 4,
        width: lMaxWidth,
    }, {
        alignLeft: true,
        ownBackground: false,
        wordwraparcs: gChart.wordWrapArcs,
    });
    const lBBox = svgutensils_1.default.getBBox(lTextGroup);
    const lHeight = Math.max(lBBox.height + 2 * constants_1.default.LINE_WIDTH, (gChart.arcRowHeight / 2) - 2 * constants_1.default.LINE_WIDTH);
    const lWidth = Math.min(lBBox.width + 2 * constants_1.default.LINE_WIDTH, lMaxWidth);
    const lBox = index_1.default.createEdgeRemark({
        width: lWidth - constants_1.default.LINE_WIDTH + FOLD_SIZE,
        height: lHeight,
        x: lStart,
        y: pY,
    }, {
        class: "box inline_expression_label",
        color: pArc.linecolor,
        bgColor: pArc.textbgcolor,
        foldSize: FOLD_SIZE,
    });
    lGroup.appendChild(lBox);
    lGroup.appendChild(lTextGroup);
    return lGroup;
}
function renderInlineExpressions(pInlineExpressions) {
    pInlineExpressions.forEach((pInlineExpression) => {
        gChart.layer.inline.appendChild(renderInlineExpression(pInlineExpression, rowmemory_1.default.get(pInlineExpression.rownum).y));
    });
}
function renderInlineExpression(pArcMem, pY) {
    const lFromY = rowmemory_1.default.get(pArcMem.rownum).y;
    const lToY = rowmemory_1.default.get(pArcMem.rownum + pArcMem.arc.numberofrows + 1).y;
    const lHeight = lToY - lFromY;
    pArcMem.arc.label = "";
    return createInlineExpressionBox(entities_1.default.getOAndD(pArcMem.arc.from, pArcMem.arc.to), pArcMem.arc, lHeight, pY);
}
function createLifeLines(pEntities, pClass, pHeight, pY) {
    /* istanbul ignore if */
    if (pHeight < gChart.arcRowHeight) {
        pHeight = gChart.arcRowHeight;
    }
    return pEntities.map((pEntity) => {
        const lLine = index_1.default.createLine({
            xFrom: entities_1.default.getX(pEntity.name),
            yFrom: 0 - (pHeight / 2) + (pY ? pY : 0),
            xTo: entities_1.default.getX(pEntity.name),
            yTo: (pHeight / 2) + (pY ? pY : 0),
        }, {
            class: pClass,
        });
        if (pEntity.linecolor) {
            lLine.setAttribute("style", `stroke:${pEntity.linecolor};`);
        }
        return lLine;
    });
}
function createSelfRefArc(pKind, pX, pYTo, pDouble, pY, pLineColor) {
    // globals: (gChart ->) arcRowHeight, (entities ->) interEntitySpacing
    const lHeight = 2 * (gChart.arcRowHeight / 5);
    const lWidth = entities_1.default.getDims().interEntitySpacing / 2;
    let lRetval = {};
    const lClass = `arc ${kind2class_1.default.getAggregateClass(pKind)} ${kind2class_1.default.getClass(pKind)}`;
    if (pDouble) {
        lRetval = index_1.default.createGroup();
        const lInnerTurn = index_1.default.createUTurn({
            x: pX,
            y: pY,
            width: lWidth - 2 * constants_1.default.LINE_WIDTH,
            height: lHeight,
        }, (pY + pYTo + lHeight - 2 * constants_1.default.LINE_WIDTH), // pY
        {
            class: lClass,
            dontHitHome: pKind !== "::",
            lineWidth: constants_1.default.LINE_WIDTH,
        });
        /* we need a middle turn to attach the arrow to */
        const lMiddleTurn = index_1.default.createUTurn({
            x: pX,
            y: pY,
            width: lWidth,
            height: lHeight,
        }, (pY + pYTo + lHeight - constants_1.default.LINE_WIDTH), { lineWidth: constants_1.default.LINE_WIDTH });
        const lOuterTurn = index_1.default.createUTurn({
            x: pX,
            y: pY,
            width: lWidth,
            height: lHeight,
        }, (pY + pYTo + lHeight), {
            class: lClass,
            dontHitHome: pKind !== "::",
            lineWidth: constants_1.default.LINE_WIDTH,
        });
        if (!!pLineColor) {
            lInnerTurn.setAttribute("style", `stroke:${pLineColor}`);
        }
        markermanager_1.default.getAttributes(idmanager_1.default.get(), pKind, pLineColor, pX, pX).forEach((pAttribute) => {
            lMiddleTurn.setAttribute(pAttribute.name, pAttribute.value);
        });
        lMiddleTurn.setAttribute("style", "stroke:transparent;");
        if (Boolean(pLineColor)) {
            lOuterTurn.setAttribute("style", `stroke:${pLineColor}`);
        }
        lRetval.appendChild(lInnerTurn);
        lRetval.appendChild(lOuterTurn);
        lRetval.appendChild(lMiddleTurn);
        lRetval.setAttribute("class", lClass);
    }
    else {
        lRetval = index_1.default.createUTurn({
            x: pX,
            y: pY,
            width: lWidth,
            height: lHeight,
        }, (pY + pYTo + lHeight), {
            class: lClass,
            dontHitHome: pKind === "-x",
            lineWidth: constants_1.default.LINE_WIDTH,
        });
        markermanager_1.default.getAttributes(idmanager_1.default.get(), pKind, pLineColor, pX, pX).forEach((pAttribute) => {
            lRetval.setAttribute(pAttribute.name, pAttribute.value);
        });
    }
    return lRetval;
}
function renderEmptyArc(pArc, pY) {
    if (pArc.kind === "---") {
        return createComment(pArc, entities_1.default.getOAndD(pArc.from, pArc.to), pY);
    }
    else { /* "..." / "|||" */
        return createLifeLinesText(pArc, entities_1.default.getOAndD(pArc.from, pArc.to), pY);
    }
}
function determineYToAbsolute(pRowNumber, pArcGradient, pArcSkip) {
    let lRetval = rowmemory_1.default.get(pRowNumber).y + pArcGradient;
    if (!!pArcSkip) {
        const lWholeArcSkip = Math.floor(pArcSkip);
        const lRestArcSkip = pArcSkip - lWholeArcSkip;
        const lCurrentRealRowNumber = rowmemory_1.default.get(pRowNumber).realRowNumber;
        lRetval =
            rowmemory_1.default.getByRealRowNumber(lCurrentRealRowNumber + lWholeArcSkip).y +
                lRestArcSkip * (rowmemory_1.default.getByRealRowNumber(lCurrentRealRowNumber + lWholeArcSkip + 1).y -
                    rowmemory_1.default.getByRealRowNumber(lCurrentRealRowNumber + lWholeArcSkip).y);
    }
    return lRetval;
}
function determineDirectionClass(pArcKind) {
    if (pArcKind === "<:>") {
        return "bidi ";
    }
    else if (pArcKind === "::") {
        return "nodi ";
    }
    return "";
}
function createArc(pArc, pXFrom, pXTo, pRowNumber, pOptions) {
    const lGroup = index_1.default.createGroup();
    let lClass = "arc ";
    lClass += determineDirectionClass(pArc.kind);
    lClass += `${kind2class_1.default.getAggregateClass(pArc.kind)} ${kind2class_1.default.getClass(pArc.kind)}`;
    const lDoubleLine = [":>", "::", "<:>"].includes(pArc.kind);
    const lYToAbsolute = determineYToAbsolute(pRowNumber, gChart.arcGradient, pArc.arcskip);
    pXTo = renderutensils_1.default.determineArcXTo(pArc.kind, pXFrom, pXTo);
    if (pXFrom === pXTo) {
        lGroup.appendChild(createSelfRefArc(pArc.kind, pXFrom, lYToAbsolute - rowmemory_1.default.get(pRowNumber).y - gChart.arcGradient, lDoubleLine, rowmemory_1.default.get(pRowNumber).y, pArc.linecolor));
        /* creates a label left aligned, a little above the arc*/
        const lTextWidth = 2 * entities_1.default.getDims().interEntitySpacing / 3;
        lGroup.appendChild(renderlabels_1.default.createLabel(pArc, {
            x: pXFrom + 1.5 * constants_1.default.LINE_WIDTH - (lTextWidth / 2),
            y: rowmemory_1.default.get(pRowNumber).y - (gChart.arcRowHeight / 5) - constants_1.default.LINE_WIDTH / 2,
            width: lTextWidth,
        }, Object.assign({
            alignLeft: true,
            alignAbove: true,
            ownBackground: true,
        }, lodash_clonedeep_1.default(pOptions))));
    }
    else {
        const lLine = index_1.default.createLine({
            xFrom: pXFrom,
            yFrom: rowmemory_1.default.get(pRowNumber).y,
            xTo: pXTo,
            yTo: lYToAbsolute,
        }, {
            class: lClass,
            doubleLine: lDoubleLine,
        });
        markermanager_1.default.getAttributes(idmanager_1.default.get(), pArc.kind, pArc.linecolor, pXFrom, pXTo).forEach((pAttribute) => {
            lLine.setAttribute(pAttribute.name, pAttribute.value);
        });
        lGroup.appendChild(lLine);
        /* create a label centered on the arc */
        lGroup.appendChild(renderlabels_1.default.createLabel(pArc, {
            x: pXFrom,
            y: rowmemory_1.default.get(pRowNumber).y + ((lYToAbsolute - rowmemory_1.default.get(pRowNumber).y) / 2),
            width: pXTo - pXFrom,
        }, Object.assign({
            alignAround: true,
            alignAbove: (gChart.regularArcTextVerticalAlignment === "above"),
            ownBackground: true,
        }, lodash_clonedeep_1.default(pOptions))));
    }
    return lGroup;
}
/**
 * createLifeLinesText() - creates centered text for the current (most
 *     possibly empty) arc. If the arc has a from and a to, the function
 *     centers between these, otherwise it does so from 0 to the width of
 *     the rendered chart
 *
 * @param <string> - pId - unique identification of the text in the svg
 * @param <object> - pArc - the arc to render
 */
function createLifeLinesText(pArc, pOAndD, pY) {
    let lArcStart = 0;
    let lArcEnd = gChart.arcEndX;
    if (pArc.from && pArc.to) {
        lArcStart = pOAndD.from;
        lArcEnd = pOAndD.to - pOAndD.from;
    }
    return renderlabels_1.default.createLabel(pArc, { x: lArcStart, y: pY, width: lArcEnd }, { ownBackground: true, wordwraparcs: gChart.wordWrapArcs });
}
/**
 * createComment() - creates an element representing a comment ('---')
 *
 * @param <string> - pId - the unique identification of the comment within the svg
 * @param <object> - pArc - the (comment) arc to render
 */
function createComment(pArc, pOAndD, pY) {
    let lStartX = 0;
    let lEndX = gChart.arcEndX;
    let lClass = "comment";
    const lGroup = index_1.default.createGroup();
    if (pArc.from && pArc.to) {
        const lMaxDepthCorrection = gChart.maxDepth * 1 * constants_1.default.LINE_WIDTH;
        const lArcDepthCorrection = (gChart.maxDepth - pArc.depth) * 2 * constants_1.default.LINE_WIDTH;
        lStartX =
            (pOAndD.from -
                (entities_1.default.getDims().interEntitySpacing + 2 * constants_1.default.LINE_WIDTH) / 2) -
                (lArcDepthCorrection - lMaxDepthCorrection);
        lEndX =
            (pOAndD.to +
                (entities_1.default.getDims().interEntitySpacing + 2 * constants_1.default.LINE_WIDTH) / 2) +
                (lArcDepthCorrection - lMaxDepthCorrection);
        lClass = "inline_expression_divider";
    }
    const lLine = index_1.default.createLine({
        xFrom: lStartX,
        yFrom: pY,
        xTo: lEndX,
        yTo: pY,
    }, {
        class: lClass,
    });
    lGroup.appendChild(lLine);
    lGroup.appendChild(createLifeLinesText(pArc, pOAndD, pY));
    if (pArc.linecolor) {
        lLine.setAttribute("style", `stroke:${pArc.linecolor};`);
    }
    return lGroup;
}
function createInlineExpressionBox(pOAndD, pArc, pHeight, pY) {
    /* begin: same as createBox */
    const lMaxDepthCorrection = gChart.maxDepth * 2 * constants_1.default.LINE_WIDTH;
    const lWidth = (pOAndD.to - pOAndD.from) +
        entities_1.default.getDims().interEntitySpacing - 2 * constants_1.default.LINE_WIDTH - lMaxDepthCorrection; // px
    const lStart = pOAndD.from -
        ((entities_1.default.getDims().interEntitySpacing - 2 * constants_1.default.LINE_WIDTH - lMaxDepthCorrection) / 2);
    /* end: same as createBox */
    const lArcDepthCorrection = (gChart.maxDepth - pArc.depth) * 2 * constants_1.default.LINE_WIDTH;
    return index_1.default.createRect({
        width: lWidth + lArcDepthCorrection * 2,
        height: pHeight ? pHeight : gChart.arcRowHeight - 2 * constants_1.default.LINE_WIDTH,
        x: lStart - lArcDepthCorrection,
        y: pY,
    }, {
        class: `box inline_expression ${pArc.kind}`,
        color: pArc.linecolor,
        bgColor: pArc.textbgcolor,
    });
}
/**
 * creates an element representing a box (box, abox, rbox, note)
 * also (mis?) used for rendering inline expressions/ arc spanning arcs
 *
 * @param <string> - pId - the unique identification of the box within the svg
 * @param <number> - pFrom - the x coordinate to render the box from
 * @param <number> - pTo - the x coordinate to render te box to
 * @param <object> - pArc - the (box/ arc spanning) arc to render
 * @param <number> - pHeight - the height of the box to render. If not passed
 * takes the bounding box of the (rendered) label of the arc, taking care not
 * to get smaller than the default arc row height
 */
function createBox(pOAndD, pArc, pY, pOptions) {
    /* begin: same as createInlineExpressionBox */
    const lMaxDepthCorrection = gChart.maxDepth * 2 * constants_1.default.LINE_WIDTH;
    const lWidth = (pOAndD.to - pOAndD.from) +
        entities_1.default.getDims().interEntitySpacing - 2 * constants_1.default.LINE_WIDTH - lMaxDepthCorrection; // px
    const lStart = pOAndD.from -
        ((entities_1.default.getDims().interEntitySpacing - 2 * constants_1.default.LINE_WIDTH - lMaxDepthCorrection) / 2);
    /* end: same as createInlineExpressionBox */
    const lGroup = index_1.default.createGroup();
    let lBox;
    const lTextGroup = renderlabels_1.default.createLabel(pArc, { x: lStart, y: pY, width: lWidth }, pOptions);
    const lTextBBox = svgutensils_1.default.getBBox(lTextGroup);
    const lHeight = Math.max(lTextBBox.height + 2 * constants_1.default.LINE_WIDTH, gChart.arcRowHeight - 2 * constants_1.default.LINE_WIDTH);
    const lBBox = { width: lWidth, height: lHeight, x: lStart, y: (pY - lHeight / 2) };
    switch (pArc.kind) {
        case ("rbox"):
            lBox = index_1.default.createRBox(lBBox, {
                class: "box rbox",
                color: pArc.linecolor,
                bgColor: pArc.textbgcolor,
            });
            break;
        case ("abox"):
            lBox = index_1.default.createABox(lBBox, {
                class: "box abox",
                color: pArc.linecolor,
                bgColor: pArc.textbgcolor,
            });
            break;
        case ("note"):
            lBox = index_1.default.createNote(lBBox, {
                class: "box note",
                color: pArc.linecolor,
                bgColor: pArc.textbgcolor,
                lineWidth: constants_1.default.LINE_WIDTH,
            });
            break;
        default: // "box"
            lBox = index_1.default.createRect(lBBox, {
                class: "box",
                color: pArc.linecolor,
                bgColor: pArc.textbgcolor,
            });
            break;
    }
    lGroup.appendChild(lBox);
    lGroup.appendChild(lTextGroup);
    return lGroup;
}
exports.default = {
    /**
     * removes the element with id pParentElementId from the DOM
     *
     * @param - {string} pParentElementId - the element the element with
     * the id mentioned above is supposed to be residing in
     * @param - {window} pWindow - the browser window object
     *
     */
    clean(pParentElementId, pWindow) {
        gChart.document = renderskeleton_1.default.init(pWindow);
        svgutensils_1.default.init(gChart.document);
        svgutensils_1.default.removeRenderedSVGFromElement(pParentElementId);
    },
    /**
     * renders the given abstract syntax tree pAST as svg
     * in the element with id pParentELementId in the window pWindow
     *
     * @param {object} pAST - the abstract syntax tree
     * @param {window} pWindow - the browser window to put the svg in
     * @param {string} pParentElementId - the id of the parent element in which
     * to put the __svg_output element
     * @param  {object} pOptions
     * - styleAdditions:  valid css that augments the default style
     * - additionalTemplate: a named (baked in) template. Current values:
     *  "inverted", "grayscaled"
     * - source: the source msc to embed in the svg
     * - mirrorEntitiesOnBottom: (boolean) whether or not to repeat entities
     *   on the bottom of the chart
     */
    render,
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
