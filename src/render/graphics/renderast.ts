import * as _cloneDeep from "lodash.clonedeep";

/**
 *
 * renders an abstract syntax tree of a sequence chart
 *
 * knows of:
 *  - the syntax tree
 *  - the target canvas
 *
 * Defines default sizes and distances for all objects.
 * @exports renderast
 * @author {@link https://github.com/sverweij | Sander Verweij}
 */

import aggregatekind from "../astmassage/aggregatekind";
import flatten from "../astmassage/flatten";
import constants from "./constants";
import entities from "./entities";
import idmanager from "./idmanager";
import kind2class from "./kind2class";
import markermanager from "./markermanager";
import renderlabels from "./renderlabels";
import renderskeleton from "./renderskeleton";
import renderutensils from "./renderutensils";
import rowmemory from "./rowmemory";
import svgelementfactory from "./svgelementfactory/index";
import svgutensils from "./svgutensils";

const PAD_VERTICAL          = 3;
const DEFAULT_ARCROW_HEIGHT = 38; // chart only
const DEFAULT_ARC_GRADIENT  = 0; // chart only

/* sensible default - get overwritten in bootstrap */
const gChart = Object.seal({
    arcRowHeight           : DEFAULT_ARCROW_HEIGHT,
    arcGradient            : DEFAULT_ARC_GRADIENT,
    arcEndX                : 0,
    wordWrapArcs           : false,
    mirrorEntitiesOnBottom : false,
    regularArcTextVerticalAlignment: "middle",
    maxDepth               : 0,
    document               : {},
    layer                  : {
        lifeline     : {},
        sequence     : {},
        notes        : {},
        inline       : {},
        watermark    : {},
    },
}) as any;
let gInlineExpressionMemory: any[] = [];

function getParentElement(pWindow, pParentElementId) {
    return pWindow.document.getElementById(pParentElementId) || pWindow.document.body;
}

function render(pAST, pWindow, pParentElementId, pOptions) {
    const lFlattenedAST = Object.freeze(flatten.flatten(pAST));
    const lParentElement = getParentElement(pWindow, pParentElementId);

    idmanager.setPrefix(pParentElementId);
    renderASTPre(
        lFlattenedAST,
        pWindow,
        lParentElement,
        pOptions || {},
    );
    renderASTMain(lFlattenedAST);
    renderASTPost(lFlattenedAST);

    return svgutensils.webkitNamespaceBugWorkaround(lParentElement.innerHTML);
}

function renderASTPre(pAST, pWindow, pParentElement, pOptions) {
    gChart.document = renderskeleton.bootstrap(
        pWindow,
        pParentElement,
        idmanager.get(),
        markermanager.getMarkerDefs(idmanager.get(), pAST),
        pOptions,
    );
    gChart.mirrorEntitiesOnBottom = pOptions.mirrorEntitiesOnBottom;
    gChart.regularArcTextVerticalAlignment = pOptions.regularArcTextVerticalAlignment;
    svgutensils.init(gChart.document);

    gChart.layer = createLayerShortcuts(gChart.document);
    gChart.maxDepth = pAST.depth;

    preProcessOptions(gChart, pAST.options);
}

function renderASTMain(pAST) {
    renderEntities(pAST.entities, 0, pAST.options);
    rowmemory.clear(entities.getDims().height, gChart.arcRowHeight);
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
        lifeline  : pDocument.getElementById(idmanager.get("_lifelines")),
        sequence  : pDocument.getElementById(idmanager.get("_sequence")),
        notes     : pDocument.getElementById(idmanager.get("_notes")),
        inline    : pDocument.getElementById(idmanager.get("_arcspans")),
        watermark : pDocument.getElementById(idmanager.get("_watermark")),
    };
}

function preProcessOptionsArcs(pChart, pOptions) {
    pChart.arcRowHeight = DEFAULT_ARCROW_HEIGHT;
    pChart.arcGradient  = DEFAULT_ARC_GRADIENT;
    pChart.wordWrapArcs = false;

    if (pOptions) {
        if (pOptions.arcgradient) {
            pChart.arcRowHeight = parseInt(pOptions.arcgradient, 10) + DEFAULT_ARCROW_HEIGHT;
            pChart.arcGradient  = parseInt(pOptions.arcgradient, 10) + DEFAULT_ARC_GRADIENT;
        }
        pChart.wordWrapArcs = Boolean(pOptions.wordwraparcs);
    }
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
    entities.init(pOptions && pOptions.hscale);
    preProcessOptionsArcs(pChart, pOptions);
}

function calculateCanvasDimensions(pAST) {
    const lDepthCorrection = renderutensils.determineDepthCorrection(pAST.depth, constants.LINE_WIDTH);
    const lRowInfo = rowmemory.getLast();
    const lCanvas = {
        width :
            (pAST.entities.length * entities.getDims().interEntitySpacing) + lDepthCorrection,
        height :
            Boolean(gChart.mirrorEntitiesOnBottom)
                ? (2 * entities.getDims().height) + lRowInfo.y + lRowInfo.height + 2 * PAD_VERTICAL
                : lRowInfo.y + (lRowInfo.height / 2) + 2 * PAD_VERTICAL,
        horizontaltransform :
            (entities.getDims().interEntitySpacing + lDepthCorrection - entities.getDims().width) / 2,
        autoscale :
            !!pAST.options && !!pAST.options.width && pAST.options.width === "auto",
        verticaltransform :
            PAD_VERTICAL,
        scale : 1,
    } as any;
    lCanvas.x = 0 - lCanvas.horizontaltransform;
    lCanvas.y = 0 - lCanvas.verticaltransform;
    return lCanvas;
}

function renderBackground(pCanvas) {
    gChart.document.getElementById(idmanager.get("_background")).appendChild(
        svgelementfactory.createRect(pCanvas, {class: "bglayer"}),
    );
}

function renderWatermark(pWatermark, pCanvas) {
    gChart.layer.watermark.appendChild(
        svgelementfactory.createDiagonalText(pWatermark, pCanvas, "watermark"),
    );
}

function postProcessOptions(pOptions, pCanvas) {
    if (pOptions) {
        if (pOptions.watermark) {
            renderWatermark(pOptions.watermark, pCanvas);
        }
        if (pOptions.width && pOptions.width !== "auto") {
            pCanvas = renderutensils.scaleCanvasToWidth(pOptions.width, pCanvas);
        }
    }
    return pCanvas;
}

function renderSvgElement(pCanvas) {
    const lSvgElement = gChart.document.getElementById(idmanager.get());
    const lBody = gChart.document.getElementById(idmanager.get("_body"));
    lBody.setAttribute(
        "transform",
        `translate(${pCanvas.horizontaltransform},${pCanvas.verticaltransform}) ` +
        `scale(${pCanvas.scale},${pCanvas.scale})`,
    );
    if (!!pCanvas.autoscale && pCanvas.autoscale === true) {
        svgelementfactory.updateSVG(
            lSvgElement,
            {
                width: "100%",
                height: "100%",
                viewBox: `0 0 ${pCanvas.width.toString()} ${pCanvas.height.toString()}`,
            },
        );
    } else {
        svgelementfactory.updateSVG(
            lSvgElement,
            {
                width: pCanvas.width.toString(),
                height: pCanvas.height.toString(),
                viewBox: `0 0 ${pCanvas.width.toString()} ${pCanvas.height.toString()}`,
            },
        );
    }
}

/* ----------------------START entity shizzle-------------------------------- */

function renderEntitiesOnBottom(pEntities, pOptions) {
    const lLifeLineSpacerY = rowmemory.getLast().y + (rowmemory.getLast().height + gChart.arcRowHeight) / 2;

    /*
        insert a life line between the last arc and the entities so there's
        some visual breathing room
        */

    createLifeLines(
        pEntities,
        "arcrow",
        null,
        lLifeLineSpacerY,
    ).forEach((pLifeLine) => {
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
    gChart.layer.sequence.appendChild(
        entities.renderEntities(pEntities, pEntityYPos, pOptions),
    );
    gChart.arcEndX =
        entities.getDims().entityXHWM -
        entities.getDims().interEntitySpacing + entities.getDims().width;
}

/* ------------------------END entity shizzle-------------------------------- */

function renderBroadcastArc(pArc, pEntities, pRowMemory, pRowNumber, pOptions) {
    let xTo    = 0;
    const lLabel = pArc.label;
    const xFrom  = entities.getX(pArc.from);

    pArc.label = "";

    pEntities.forEach((pEntity) => {
        let lElement = {};

        if (pEntity.name !== pArc.from) {
            xTo = entities.getX(pEntity.name);
            lElement = createArc(pArc, xFrom, xTo, pRowNumber, pOptions);
            pRowMemory.push({
                layer : gChart.layer.sequence,
                element: lElement,
            });
        }
    });

    pArc.label = lLabel;
}

function renderRegularArc(pArc, pEntities, pRowMemory, pRowNumber, pOptions) {
    let lElement: SVGGElement = svgelementfactory.createGroup();

    if (pArc.from && pArc.to) {
        if (pArc.to === "*") { // it's a broadcast arc
            renderBroadcastArc(pArc, pEntities, pRowMemory, pRowNumber, pOptions);
            /* creates a label on the current line, smack in the middle */
            lElement =
                renderlabels.createLabel(
                    pArc,
                    {
                        x     : 0,
                        y     : rowmemory.get(pRowNumber).y,
                        width : gChart.arcEndX,
                    },
                    Object.assign(
                        {
                            alignAround   : true,
                            ownBackground : true,
                        },
                        _cloneDeep(pOptions),
                    ),
                );
            pRowMemory.push({
                title : pArc.title,
                layer : gChart.layer.sequence,
                element: lElement,
            });
        } else { // it's a regular arc
            lElement =
                createArc(
                    pArc,
                    entities.getX(pArc.from),
                    entities.getX(pArc.to),
                    pRowNumber,
                    pOptions,
                );
            pRowMemory.push({
                title : pArc.title,
                layer : gChart.layer.sequence,
                element: lElement,
            });
        }  // / lTo or pArc.from === "*"
    }// if both a from and a to
    return lElement;
}

function getArcRowHeight(pArcRow, pRowNumber, pEntities, pOptions) {
    let lRetval = 0;

    pArcRow.forEach((pArc) => {
        let lElement: SVGGElement;

        switch (aggregatekind(pArc.kind)) {
        case ("emptyarc"):
            lElement = renderEmptyArc(pArc, 0);
            break;
        case ("box"):
            lElement = createBox(entities.getOAndD(pArc.from, pArc.to), pArc, 0, pOptions);
            break;
        case ("inline_expression"):
            lElement = renderInlineExpressionLabel(pArc, 0);
            break;
        default:
            const lArc = _cloneDeep(pArc);
            lArc.arcskip = 0; /* ignore arc skips when calculating row heights */
            lElement = renderRegularArc(lArc, pEntities, [], 0, pOptions); // TODO is 0 a good row number for this?
        }// switch

        lRetval = Math.max(
            lRetval,
            svgutensils.getBBox(lElement).height + 2 * constants.LINE_WIDTH,
        );
    }); // for all arcs in a row

    return lRetval;
}

function renderArcRow(pArcRow, pRowNumber, pEntities, pOptions) {
    let lArcRowClass = "arcrow";
    const lRowMemory: any[] = [];

    pArcRow.forEach((pArc) => {
        let lElement = {};

        switch (aggregatekind(pArc.kind)) {
        case ("emptyarc"):
            lElement = renderEmptyArc(pArc, rowmemory.get(pRowNumber).y);
            if ("..." === pArc.kind) {
                lArcRowClass = "arcrowomit";
            }
            lRowMemory.push({
                layer : gChart.layer.sequence,
                element: lElement,
            });
            break;
        case ("box"):
            lElement = createBox(
                entities.getOAndD(pArc.from, pArc.to),
                pArc,
                rowmemory.get(pRowNumber).y,
                pOptions,
            );
            lRowMemory.push({
                title : pArc.title,
                layer : gChart.layer.notes,
                element: lElement,
            });
            break;
        case ("inline_expression"):
            lElement = renderInlineExpressionLabel(pArc, rowmemory.get(pRowNumber).y);
            lRowMemory.push({
                layer : gChart.layer.notes,
                element: lElement,
            });
            gInlineExpressionMemory.push({
                arc    : pArc,
                rownum : pRowNumber,
            });
            break;
        default:
            lElement = renderRegularArc(
                pArc,
                pEntities,
                lRowMemory,
                pRowNumber,
                pOptions,
            );
        }// switch

    }); // for all arcs in a row

    /*
        *  only here we can determine the height of the row and the y position
        */
    createLifeLines(
        pEntities,
        lArcRowClass,
        rowmemory.get(pRowNumber).height,
        rowmemory.get(pRowNumber).y,
    ).forEach((pLifeLine) => {
        gChart.layer.lifeline.appendChild(pLifeLine);
    });

    lRowMemory.forEach((pRowMemoryLine) => {
        if (pRowMemoryLine.element) {
            if (pRowMemoryLine.title) {
                pRowMemoryLine.element.appendChild(svgelementfactory.createTitle(pRowMemoryLine.title));
            }
            pRowMemoryLine.layer.appendChild(pRowMemoryLine.element);
        }
    });
}

function precalculateArcRowHeights(pArcRows, pEntities, pOptions) {
    let lRealRowNumber = 0;

    pArcRows.forEach((pArcRow, pRowNumber) => {
        function isVirtualArc(pArc) {
            return pArc.isVirtual;
        }

        if (pArcRow.every(isVirtualArc)) {
            rowmemory.set(
                pRowNumber,
                Math.max(
                    rowmemory.get(pRowNumber).height,
                    getArcRowHeight(pArcRow, pRowNumber, pEntities, pOptions),
                ),
            );
        } else {
            rowmemory.set(
                pRowNumber,
                Math.max(
                    rowmemory.get(pRowNumber).height,
                    getArcRowHeight(pArcRow, pRowNumber, pEntities, pOptions),
                ),
                lRealRowNumber,
            );
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
    createLifeLines(
        pEntities,
        "arcrow",
        null,
        rowmemory.get(-1).y,
    ).forEach((pLifeLine) => {
        gChart.layer.lifeline.appendChild(pLifeLine);
    });

    if (pArcRows) {
        precalculateArcRowHeights(pArcRows, pEntities, pOptions);
        pArcRows.forEach((pArcRow, pCounter) => {
            renderArcRow(pArcRow, pCounter, pEntities, pOptions);
        });
        renderInlineExpressions(gInlineExpressionMemory);
    } // if pArcRows
}// function

/**
 * renderInlineExpressionLabel() - renders the label of an inline expression
 * (/ arc spanning arc)
 *
 * @param <object> pArc - the arc spanning arc
 * @param <number pY - where to start
 */
function renderInlineExpressionLabel(pArc, pY) {
    const lOnD = entities.getOAndD(pArc.from, pArc.to);
    const FOLD_SIZE = 7;
    const lLabelContentAlreadyDetermined = pY > 0;

    const lMaxDepthCorrection = gChart.maxDepth * 2 * constants.LINE_WIDTH;

    const lMaxWidth =
        (lOnD.to - lOnD.from) +
        (entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH) -
        FOLD_SIZE -
        constants.LINE_WIDTH;

    const lStart =
        (
            lOnD.from -
            ((entities.getDims().interEntitySpacing - 3 * constants.LINE_WIDTH - lMaxDepthCorrection) / 2) -
            (gChart.maxDepth - pArc.depth) * 2 * constants.LINE_WIDTH
        );

    const lGroup = svgelementfactory.createGroup();
    if (!lLabelContentAlreadyDetermined) {
        pArc.label = pArc.kind + (pArc.label ? ": " + pArc.label : "");
    }

    const lTextGroup = renderlabels.createLabel(
        pArc,
        {
            x: lStart + constants.LINE_WIDTH - (lMaxWidth / 2),
            y: pY + gChart.arcRowHeight / 4,
            width: lMaxWidth,
        },
        {
            alignLeft: true,
            ownBackground: false,
            wordwraparcs: gChart.wordWrapArcs,
        },
    );

    const lBBox = svgutensils.getBBox(lTextGroup);

    const lHeight =
        Math.max(
            lBBox.height + 2 * constants.LINE_WIDTH,
            (gChart.arcRowHeight / 2) - 2 * constants.LINE_WIDTH,
        );
    const lWidth =
        Math.min(
            lBBox.width + 2 * constants.LINE_WIDTH,
            lMaxWidth,
        );

    const lBox =
        svgelementfactory.createEdgeRemark(
            {
                width: lWidth - constants.LINE_WIDTH + FOLD_SIZE,
                height: lHeight,
                x: lStart,
                y: pY,
            },
            "box inline_expression_label",
            pArc.linecolor,
            pArc.textbgcolor,
            FOLD_SIZE,
        );
    lGroup.appendChild(lBox);
    lGroup.appendChild(lTextGroup);

    return lGroup;
}

function renderInlineExpressions(pInlineExpressions) {
    pInlineExpressions.forEach(
        (pInlineExpression) => {
            gChart.layer.inline.appendChild(
                renderInlineExpression(pInlineExpression, rowmemory.get(pInlineExpression.rownum).y),
            );
        },
    );
}

function renderInlineExpression(pArcMem, pY) {
    const lFromY = rowmemory.get(pArcMem.rownum).y;
    const lToY = rowmemory.get(pArcMem.rownum + pArcMem.arc.numberofrows + 1).y;
    const lHeight = lToY - lFromY;
    pArcMem.arc.label = "";

    return createInlineExpressionBox(
        entities.getOAndD(pArcMem.arc.from, pArcMem.arc.to),
        pArcMem.arc,
        lHeight,
        pY,
    );
}

function createLifeLines(pEntities, pClass, pHeight, pY) {
    if (!pHeight || pHeight < gChart.arcRowHeight) {
        pHeight = gChart.arcRowHeight;
    }

    return pEntities.map((pEntity) => {
        const lLine = svgelementfactory.createLine(
            {
                xFrom: entities.getX(pEntity.name),
                yFrom: 0 - (pHeight / 2) + (pY ? pY : 0),
                xTo: entities.getX(pEntity.name),
                yTo: (pHeight / 2) + (pY ? pY : 0),
            },
            {
                class: pClass,
            },
        );
        if (pEntity.linecolor) {
            lLine.setAttribute("style", `stroke:${pEntity.linecolor};`);
        }
        return lLine;
    });
}

function createSelfRefArc(pKind, pFrom, pYTo, pDouble, pLineColor, pY) {
    // globals: (gChart ->) arcRowHeight, (entities ->) interEntitySpacing

    const lHeight = 2 * (gChart.arcRowHeight / 5);
    const lWidth = entities.getDims().interEntitySpacing / 2;
    let lRetval: any = {};
    const lClass = `arc ${kind2class.getAggregateClass(pKind)} ${kind2class.getClass(pKind)}`;

    if (pDouble) {
        lRetval = svgelementfactory.createGroup();
        // const lInnerTurn  = svgelementfactory.createUTurnold(
        //     {x: pFrom, y: pY},
        //     (pY + pYTo + lHeight - 2 * constants.LINE_WIDTH), // pEndY
        //     lWidth - 2 * constants.LINE_WIDTH, // pWidth
        //     lClass, // pClass
        //     pKind !== "::", // pDontHitHome
        //     lHeight, // pHeight
        // );
        const lInnerTurn = svgelementfactory.createUTurn(
            {
                x: pFrom,
                y: pY,
                width: lWidth - 2 * constants.LINE_WIDTH,
                height: lHeight,
            },
            (pY + pYTo + lHeight - 2 * constants.LINE_WIDTH), // pY
            {
                class: lClass,
                dontHitHome: pKind !== "::",
                lineWidth: constants.LINE_WIDTH,
            },

        );
        /* we need a middle turn to attach the arrow to */
        const lMiddleTurn = svgelementfactory.createUTurn(
            {
                x: pFrom,
                y: pY,
                width: lWidth,
                height: lHeight,
            },
            (pY + pYTo + lHeight - constants.LINE_WIDTH),
            { lineWidth: constants.LINE_WIDTH},
        );
        const lOuterTurn = svgelementfactory.createUTurn(
            {
                x: pFrom,
                y: pY,
                width: lWidth,
                height: lHeight,
            },
            (pY + pYTo + lHeight),
            {
                class: lClass,
                dontHitHome: pKind !== "::",
                lineWidth: constants.LINE_WIDTH,
            },
        );
        if (Boolean(pLineColor)) {
            lInnerTurn.setAttribute("style", `stroke:${pLineColor}`);
        }
        markermanager.getAttributes(idmanager.get(), pKind, pLineColor, pFrom, pFrom).forEach((pAttribute: any) => {
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
    } else {
        lRetval = svgelementfactory.createUTurn(
            {
                x: pFrom,
                y: pY,
                width: lWidth,
                height: lHeight,
            },
            (pY + pYTo + lHeight),
            {
                class: lClass,
                dontHitHome: pKind === "-x",
                lineWidth: constants.LINE_WIDTH,
            },
        );
        markermanager.getAttributes(idmanager.get(), pKind, pLineColor, pFrom, pFrom).forEach(
            (pAttribute: any) => {
                lRetval.setAttribute(pAttribute.name, pAttribute.value);
            },
        );
    }

    return lRetval;
}

function renderEmptyArc(pArc, pY) {
    if (pArc.kind === "---") {
        return createComment(pArc, entities.getOAndD(pArc.from, pArc.to), pY);
    } else { /* "..." / "|||" */
        return createLifeLinesText(pArc, entities.getOAndD(pArc.from, pArc.to), pY);
    }
}

function determineYToAbsolute(pRowNumber, pArcSkip, pArcGradient) {
    let lRetval = rowmemory.get(pRowNumber).y + pArcGradient;

    if (Boolean(pArcSkip)) {
        const lWholeArcSkip = Math.floor(pArcSkip);
        const lRestArcSkip = pArcSkip - lWholeArcSkip;
        const lCurrentRealRowNumber = rowmemory.get(pRowNumber).realRowNumber;

        lRetval =
            rowmemory.getByRealRowNumber(lCurrentRealRowNumber + lWholeArcSkip).y +
            lRestArcSkip * (
                rowmemory.getByRealRowNumber(lCurrentRealRowNumber + lWholeArcSkip + 1).y -
                rowmemory.getByRealRowNumber(lCurrentRealRowNumber + lWholeArcSkip).y
            );
    }
    return lRetval;
}

function determineDirectionClass(pArcKind) {
    if (pArcKind === "<:>") {
        return "bidi ";
    } else if (pArcKind === "::") {
        return "nodi ";
    }
    return "";
}

function createArc(pArc, pFrom, pTo, pRowNumber, pOptions) {
    const lGroup = svgelementfactory.createGroup();
    let lClass = "arc ";
    lClass += determineDirectionClass(pArc.kind);
    lClass += `${kind2class.getAggregateClass(pArc.kind)} ${kind2class.getClass(pArc.kind)}`;
    const lDoubleLine = [":>", "::", "<:>"].includes(pArc.kind);
    const lYToAbsolute = determineYToAbsolute(pRowNumber, pArc.arcskip, gChart.arcGradient);

    pTo = renderutensils.determineArcXTo(pArc.kind, pFrom, pTo);

    if (pFrom === pTo) {
        lGroup.appendChild(
            createSelfRefArc(
                pArc.kind,
                pFrom,
                lYToAbsolute - rowmemory.get(pRowNumber).y - gChart.arcGradient,
                lDoubleLine,
                pArc.linecolor,
                rowmemory.get(pRowNumber).y,
            ),
        );

        /* creates a label left aligned, a little above the arc*/
        const lTextWidth = 2 * entities.getDims().interEntitySpacing / 3;
        lGroup.appendChild(
            renderlabels.createLabel(
                pArc,
                {
                    x: pFrom + 1.5 * constants.LINE_WIDTH - (lTextWidth / 2),
                    y: rowmemory.get(pRowNumber).y - (gChart.arcRowHeight / 5) - constants.LINE_WIDTH / 2,
                    width: lTextWidth,
                },
                Object.assign(
                    {
                        alignLeft: true,
                        alignAbove: true,
                        ownBackground: true,
                    },
                    _cloneDeep(pOptions),
                ),
            ),
        );
    } else {
        const lLine = svgelementfactory.createLine(
            {
                xFrom: pFrom,
                yFrom: rowmemory.get(pRowNumber).y,
                xTo: pTo,
                yTo: lYToAbsolute,
            },
            {
                class: lClass,
                doubleLine: lDoubleLine,
            },
        );
        markermanager.getAttributes(
            idmanager.get(), pArc.kind, pArc.linecolor, pFrom, pTo,
        ).forEach((pAttribute: any) => {
            lLine.setAttribute(pAttribute.name, pAttribute.value);
        });
        lGroup.appendChild(lLine);

        /* create a label centered on the arc */
        lGroup.appendChild(
            renderlabels.createLabel(
                pArc,
                {
                    x: pFrom,
                    y: rowmemory.get(pRowNumber).y + ((lYToAbsolute - rowmemory.get(pRowNumber).y) / 2),
                    width: pTo - pFrom,
                },
                Object.assign(
                    {
                        alignAround: true,
                        alignAbove: (gChart.regularArcTextVerticalAlignment === "above"),
                        ownBackground: true,
                    },
                    _cloneDeep(pOptions),
                ),
            ),
        );
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
    let lArcEnd   = gChart.arcEndX;

    if (pArc.from && pArc.to) {
        lArcStart = pOAndD.from;
        lArcEnd   = pOAndD.to - pOAndD.from;
    }
    return renderlabels.createLabel(
        pArc,
        {x: lArcStart, y: pY, width: lArcEnd},
        {ownBackground: true, wordwraparcs: gChart.wordWrapArcs},
    );
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
    const lGroup = svgelementfactory.createGroup();

    if (pArc.from && pArc.to) {
        const lMaxDepthCorrection = gChart.maxDepth * 1 * constants.LINE_WIDTH;
        const lArcDepthCorrection = (gChart.maxDepth - pArc.depth) * 2 * constants.LINE_WIDTH;

        lStartX =
            (pOAndD.from -
                (entities.getDims().interEntitySpacing + 2 * constants.LINE_WIDTH) / 2) -
            (lArcDepthCorrection - lMaxDepthCorrection);
        lEndX   =
            (pOAndD.to +
                (entities.getDims().interEntitySpacing + 2 * constants.LINE_WIDTH) / 2) +
            (lArcDepthCorrection - lMaxDepthCorrection);
        lClass  = "inline_expression_divider";
    }
    const lLine =
        svgelementfactory.createLine(
            {
                xFrom: lStartX,
                yFrom: pY,
                xTo: lEndX,
                yTo: pY,
            },
            {
                class: lClass,
            },
        );

    lGroup.appendChild(lLine);
    lGroup.appendChild(createLifeLinesText(pArc, pOAndD, pY));

    if (pArc.linecolor) {
        lLine.setAttribute("style", `stroke:${pArc.linecolor};`);
    }

    return lGroup;
}

function createInlineExpressionBox(pOAndD, pArc, pHeight, pY) {
    /* begin: same as createBox */
    const lMaxDepthCorrection = gChart.maxDepth * 2 * constants.LINE_WIDTH;
    const lWidth =
        (pOAndD.to - pOAndD.from) +
        entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH - lMaxDepthCorrection; // px
    const lStart =
        pOAndD.from -
        ((entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH - lMaxDepthCorrection) / 2);

    /* end: same as createBox */

    const lArcDepthCorrection = (gChart.maxDepth - pArc.depth) * 2 * constants.LINE_WIDTH;

    return svgelementfactory.createRect(
        {
            width: lWidth + lArcDepthCorrection * 2,
            height: pHeight ? pHeight : gChart.arcRowHeight - 2 * constants.LINE_WIDTH,
            x: lStart - lArcDepthCorrection,
            y: pY,
        },
        {
            class: `box inline_expression ${pArc.kind}`,
            color: pArc.linecolor,
            bgColor: pArc.textbgcolor,
        },

    );
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
    const lMaxDepthCorrection = gChart.maxDepth * 2 * constants.LINE_WIDTH;
    const lWidth =
        (pOAndD.to - pOAndD.from) +
        entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH - lMaxDepthCorrection; // px
    const lStart =
        pOAndD.from -
        ((entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH - lMaxDepthCorrection) / 2);
    /* end: same as createInlineExpressionBox */

    const lGroup = svgelementfactory.createGroup();
    let lBox: SVGElement;
    const lTextGroup = renderlabels.createLabel(pArc, {x: lStart, y: pY, width: lWidth}, pOptions);
    const lTextBBox = svgutensils.getBBox(lTextGroup);
    const lHeight = Math.max(
        lTextBBox.height + 2 * constants.LINE_WIDTH,
        gChart.arcRowHeight - 2 * constants.LINE_WIDTH,
    );
    const lBBox = {width: lWidth, height: lHeight, x: lStart, y: (pY - lHeight / 2)};

    switch (pArc.kind) {
    case ("rbox"):
        lBox = svgelementfactory.createRBox(
            lBBox,
            {
                class: "box rbox",
                color: pArc.linecolor,
                bgColor: pArc.textbgcolor,
            },
        );
        break;
    case ("abox"):
        lBox = svgelementfactory.createABox(
            lBBox,
            {
                class: "box abox",
                color: pArc.linecolor,
                bgColor: pArc.textbgcolor,
            },
        );
        break;
    case ("note"):
        lBox = svgelementfactory.createNote(
            lBBox,
            {
                class: "box note",
                color: pArc.linecolor,
                bgColor: pArc.textbgcolor,
                lineWidth: constants.LINE_WIDTH,
            },

        );
        break;
    default:  // "box"
        lBox = svgelementfactory.createRect(
            lBBox,
            {
                class: "box",
                color: pArc.linecolor,
                bgColor: pArc.textbgcolor,
            },
        );
        break;
    }

    lGroup.appendChild(lBox);
    lGroup.appendChild(lTextGroup);

    return lGroup;
}

export default {

    /**
     * removes the element with id pParentElementId from the DOM
     *
     * @param - {string} pParentElementId - the element the element with
     * the id mentioned above is supposed to be residing in
     * @param - {window} pWindow - the browser window object
     *
     */
    clean(pParentElementId, pWindow) {
        gChart.document = renderskeleton.init(pWindow);
        svgutensils.init(gChart.document);
        svgutensils.removeRenderedSVGFromElement(pParentElementId);
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
