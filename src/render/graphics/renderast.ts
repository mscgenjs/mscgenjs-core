import type {
  INormalizedRenderOptions,
  RegularArcTextVerticalAlignmentType,
} from "../../../types/mscgen";
import type {
  ISequenceChart,
  IOptionsNormalized,
  ArcKindNormalizedType,
} from "../../parse/mscgenjsast";
import aggregatekind from "../astmassage/aggregatekind";
import {
  flatten,
  type IEntityNormalized,
  type IFlatArc,
  type IFlatSequenceChart,
} from "../astmassage/flatten";
import constants from "./constants";
import { IOandD, Thing } from "./entities";
import * as idmanager from "./idmanager";
import * as kind2class from "./kind2class";
import * as markermanager from "./markermanager";
import * as renderlabels from "./renderlabels";
import * as renderskeleton from "./renderskeleton";
import * as renderutensils from "./renderutensils";
import * as rowmemory from "./rowmemory";
import * as svgelementfactory from "./svgelementfactory/index";
import * as svgutensils from "./svgutensils";

let entities = new Thing(0);

//#region type declarations
interface IChartLayers {
  lifeline: SVGGElement;
  sequence: SVGGElement;
  notes: SVGGElement;
  inline: SVGGElement;
  watermark: SVGGElement;
}

interface IChart {
  arcRowHeight: number;
  arcGradient: number;
  arcEndX: number;
  wordWrapArcs: boolean;
  mirrorEntitiesOnBottom: boolean;
  regularArcTextVerticalAlignment: RegularArcTextVerticalAlignmentType;
  maxDepth: number;
  document: Document;
  layers: IChartLayers;
}

interface ICanvas {
  x: number;
  y: number;
  width: number;
  height: number;
  horizontaltransform: number;
  autoscale: boolean;
  verticaltransform: number;
  scale: number;
}
//#endregion

//#region const
const PAD_VERTICAL = 3;
const DEFAULT_ARCROW_HEIGHT = 38; // chart only
const DEFAULT_ARC_GRADIENT = 0; // chart only
//#endregion

//#region global variables
/* sensible default - get overwritten in bootstrap */
const gChart: IChart = Object.seal({
  arcRowHeight: DEFAULT_ARCROW_HEIGHT,
  arcGradient: DEFAULT_ARC_GRADIENT,
  arcEndX: 0,
  wordWrapArcs: false,
  mirrorEntitiesOnBottom: false,
  regularArcTextVerticalAlignment:
    "middle" as RegularArcTextVerticalAlignmentType,
  maxDepth: 0,
  document: {} as Document,
  layers: {
    lifeline: {} as SVGGElement,
    sequence: {} as SVGGElement,
    notes: {} as SVGGElement,
    inline: {} as SVGGElement,
    watermark: {} as SVGGElement,
  },
});

let gInlineExpressionMemory: any[] = [];
//#endregion

function getParentElement(
  pWindow: Window,
  pParentElementId: string,
): HTMLElement {
  return (
    pWindow.document.getElementById(pParentElementId) || pWindow.document.body
  );
}
//#region render level 0 & 1

function renderASTPre(
  pAST: IFlatSequenceChart,
  pWindow: Window,
  pParentElement: HTMLElement,
  pOptions: INormalizedRenderOptions,
) {
  gChart.document = renderskeleton.bootstrap(
    pWindow,
    pParentElement,
    idmanager.get(),
    markermanager.getMarkerDefs(idmanager.get(), pAST),
    pOptions,
  );
  gChart.mirrorEntitiesOnBottom = pOptions.mirrorEntitiesOnBottom;
  gChart.regularArcTextVerticalAlignment =
    pOptions.regularArcTextVerticalAlignment;
  svgutensils.init(gChart.document);

  gChart.layers = createLayerShortcuts(gChart.document);
  gChart.maxDepth = pAST.depth;

  preProcessOptions(gChart, pAST.options);
}

function renderASTMain(pAST: IFlatSequenceChart) {
  renderEntities(pAST.entities, 0, pAST.options);
  rowmemory.clear(entities.getDims().height, gChart.arcRowHeight);
  renderArcRows(pAST.arcs, pAST.entities, pAST.options);
  if (gChart.mirrorEntitiesOnBottom) {
    renderEntitiesOnBottom(pAST.entities, pAST.options);
  }
}

function renderASTPost(pAST: IFlatSequenceChart) {
  let lCanvas: ICanvas = calculateCanvasDimensions(pAST);

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
//#endregion

function createLayerShortcuts(pDocument) {
  return {
    lifeline: pDocument.getElementById(idmanager.get("_lifelines")),
    sequence: pDocument.getElementById(idmanager.get("_sequence")),
    notes: pDocument.getElementById(idmanager.get("_notes")),
    inline: pDocument.getElementById(idmanager.get("_arcspans")),
    watermark: pDocument.getElementById(idmanager.get("_watermark")),
  };
}

function preProcessOptionsArcs(pChart: IChart, pOptions: IOptionsNormalized) {
  pChart.arcRowHeight = DEFAULT_ARCROW_HEIGHT;
  pChart.arcGradient = DEFAULT_ARC_GRADIENT;
  pChart.wordWrapArcs = false;

  if (pOptions.arcgradient) {
    pChart.arcRowHeight =
      parseInt(pOptions.arcgradient, 10) + DEFAULT_ARCROW_HEIGHT;
    pChart.arcGradient =
      parseInt(pOptions.arcgradient, 10) + DEFAULT_ARC_GRADIENT;
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
function preProcessOptions(pChart: IChart, pOptions: IOptionsNormalized) {
  entities = new Thing(pOptions && pOptions.hscale);
  preProcessOptionsArcs(pChart, pOptions);
}

function calculateCanvasDimensions(pAST: IFlatSequenceChart): ICanvas {
  const lDepthCorrection = renderutensils.determineDepthCorrection(
    pAST.depth,
    constants.LINE_WIDTH,
  );
  const lRowInfo = rowmemory.getLast();
  const lCanvas = {
    width:
      pAST.entities.length * entities.getDims().interEntitySpacing +
      lDepthCorrection,
    height: Boolean(gChart.mirrorEntitiesOnBottom)
      ? 2 * entities.getDims().height +
        lRowInfo.y +
        lRowInfo.height +
        2 * PAD_VERTICAL
      : lRowInfo.y + lRowInfo.height / 2 + 2 * PAD_VERTICAL,
    horizontaltransform:
      (entities.getDims().interEntitySpacing +
        lDepthCorrection -
        entities.getDims().width) /
      2,
    autoscale:
      !!pAST.options && !!pAST.options.width && pAST.options.width === "auto",
    verticaltransform: PAD_VERTICAL,
    scale: 1,
  } as any;
  lCanvas.x = 0 - lCanvas.horizontaltransform;
  lCanvas.y = 0 - lCanvas.verticaltransform;
  return lCanvas;
}

function renderBackground(pCanvas: ICanvas) {
  const lBackground = gChart.document.getElementById(
    idmanager.get("_background"),
  );
  if (lBackground) {
    lBackground.appendChild(
      svgelementfactory.createRect(pCanvas, { class: "bglayer" }),
    );
  }
}

function renderWatermark(pWatermark: string, pCanvas: ICanvas) {
  gChart.layers.watermark.appendChild(
    svgelementfactory.createDiagonalText(pWatermark, pCanvas, "watermark"),
  );
}

function postProcessOptions(pOptions: IOptionsNormalized, pCanvas: ICanvas) {
  if (pOptions.watermark) {
    renderWatermark(pOptions.watermark, pCanvas);
  }
  if (pOptions.width && pOptions.width !== "auto") {
    pCanvas = renderutensils.scaleCanvasToWidth(pOptions.width, pCanvas);
  }
  return pCanvas;
}

function renderSvgElement(pCanvas: ICanvas) {
  const lSvgElement = gChart.document.getElementById(idmanager.get());
  const lBody = gChart.document.getElementById(idmanager.get("_body"));
  if (lBody && lSvgElement) {
    lBody.setAttribute(
      "transform",
      `translate(${pCanvas.horizontaltransform},${pCanvas.verticaltransform}) ` +
        `scale(${pCanvas.scale},${pCanvas.scale})`,
    );
    if (!!pCanvas.autoscale && pCanvas.autoscale === true) {
      svgelementfactory.updateSVG(lSvgElement, {
        width: "100%",
        height: "100%",
        viewBox: `0 0 ${pCanvas.width.toString()} ${pCanvas.height.toString()}`,
      });
    } else {
      svgelementfactory.updateSVG(lSvgElement, {
        width: pCanvas.width.toString(),
        height: pCanvas.height.toString(),
        viewBox: `0 0 ${pCanvas.width.toString()} ${pCanvas.height.toString()}`,
      });
    }
  }
}

//#region entities

function renderEntitiesOnBottom(
  pEntities: IEntityNormalized[],
  pOptions: IOptionsNormalized,
) {
  const lLifeLineSpacerY =
    rowmemory.getLast().y +
    (rowmemory.getLast().height + gChart.arcRowHeight) / 2;

  /*
        insert a life line between the last arc and the entities so there's
        some visual breathing room
        */

  createLifeLines(
    pEntities,
    "arcrow",
    gChart.arcRowHeight,
    lLifeLineSpacerY,
  ).forEach((pLifeLine) => {
    gChart.layers.lifeline.appendChild(pLifeLine);
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
  renderEntities(
    pEntities,
    lLifeLineSpacerY + gChart.arcRowHeight / 2,
    pOptions,
  );
}

/**
 * renderEntities() - renders the given pEntities (subtree of the AST) into
 * the gChart.layers.sequence layer
 *
 * @param <object> - pEntities - the entities to render
 * @param <int> - pEntityYPos - the Y position to render the entities on
 * @param <object> - pOptions
 *
 */
function renderEntities(
  pEntities: IEntityNormalized[],
  pEntityYPos: number,
  pOptions: IOptionsNormalized,
) {
  gChart.layers.sequence.appendChild(
    entities.renderEntities(pEntities, pEntityYPos, pOptions),
  );
  gChart.arcEndX =
    entities.getDims().entityXHWM -
    entities.getDims().interEntitySpacing +
    entities.getDims().width;
}

//#endregion

function renderBroadcastArc(
  pArc: IFlatArc,
  pEntities: IEntityNormalized[],
  pRowMemory,
  pRowNumber: number,
  pOptions: IOptionsNormalized,
) {
  let xTo = 0;
  const lLabel = pArc.label;
  const xFrom = entities.getX(pArc.from);

  pArc.label = "";

  pEntities.forEach((pEntity) => {
    let lElement = {};

    if (pEntity.name !== pArc.from) {
      xTo = entities.getX(pEntity.name);
      lElement = createArc(pArc, xFrom, xTo, pRowNumber, pOptions);
      pRowMemory.push({
        layer: gChart.layers.sequence,
        element: lElement,
      });
    }
  });

  pArc.label = lLabel;
}

function renderRegularArc(
  pArc: IFlatArc,
  pEntities: IEntityNormalized[],
  pRowMemory,
  pRowNumber: number,
  pOptions: IOptionsNormalized,
) {
  let lElement: SVGGElement = svgelementfactory.createGroup();

  if (pArc.from && pArc.to) {
    if (pArc.to === "*") {
      // it's a broadcast arc
      renderBroadcastArc(pArc, pEntities, pRowMemory, pRowNumber, pOptions);
      /* creates a label on the current line, smack in the middle */
      lElement = renderlabels.createLabel(
        pArc,
        {
          x: 0,
          y: rowmemory.get(pRowNumber).y,
          width: gChart.arcEndX,
        },
        Object.assign(
          {
            alignAround: true,
            ownBackground: true,
          },
          structuredClone(pOptions),
        ),
      );
      pRowMemory.push({
        title: pArc.title,
        layer: gChart.layers.sequence,
        element: lElement,
      });
    } else {
      // it's a regular arc
      lElement = createArc(
        pArc,
        entities.getX(pArc.from),
        entities.getX(pArc.to),
        pRowNumber,
        pOptions,
      );
      pRowMemory.push({
        title: pArc.title,
        layer: gChart.layers.sequence,
        element: lElement,
      });
    } // / lTo or pArc.from === "*"
  } // if both a from and a to
  return lElement;
}

function getArcRowHeight(
  pArcRow: IFlatArc[],
  pEntities: IEntityNormalized[],
  pOptions: IOptionsNormalized,
) {
  let lRetval = 0;

  pArcRow.forEach((pArc: IFlatArc) => {
    let lElement: SVGGElement;

    switch (aggregatekind(pArc.kind)) {
      case "empty":
        lElement = renderEmptyArc(pArc, 0);
        break;
      case "box":
        lElement = createBox(
          entities.getOAndD(pArc.from, pArc.to),
          pArc,
          0,
          pOptions,
        );
        break;
      case "inline_expression":
        lElement = renderInlineExpressionLabel(pArc, 0);
        break;
      default: /* ignore arc skips when calculating row heights */
        const lArc = structuredClone(pArc);
        lArc.arcskip = 0;
        lElement = renderRegularArc(lArc, pEntities, [], 0, pOptions); // TODO is 0 a good row number for this?
    } // switch

    lRetval = Math.max(
      lRetval,
      svgutensils.getBBox(lElement).height + 2 * constants.LINE_WIDTH,
    );
  }); // for all arcs in a row

  return lRetval;
}

function renderArcRow(
  pArcRow: IFlatArc[],
  pRowNumber,
  pEntities: IEntityNormalized[],
  pOptions: IOptionsNormalized,
) {
  let lArcRowClass = "arcrow";
  const lRowMemory: any[] = [];

  pArcRow.forEach((pArc: IFlatArc) => {
    let lElement = {};

    switch (aggregatekind(pArc.kind)) {
      case "empty":
        lElement = renderEmptyArc(pArc, rowmemory.get(pRowNumber).y);
        if ("..." === pArc.kind) {
          lArcRowClass = "arcrowomit";
        }
        lRowMemory.push({
          layer: gChart.layers.sequence,
          element: lElement,
        });
        break;
      case "box":
        lElement = createBox(
          entities.getOAndD(pArc.from, pArc.to),
          pArc,
          rowmemory.get(pRowNumber).y,
          pOptions,
        );
        lRowMemory.push({
          title: pArc.title,
          layer: gChart.layers.notes,
          element: lElement,
        });
        break;
      case "inline_expression":
        lElement = renderInlineExpressionLabel(
          pArc,
          rowmemory.get(pRowNumber).y,
        );
        lRowMemory.push({
          layer: gChart.layers.notes,
          element: lElement,
        });
        gInlineExpressionMemory.push({
          arc: pArc,
          rownum: pRowNumber,
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
    } // switch
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
    gChart.layers.lifeline.appendChild(pLifeLine);
  });

  lRowMemory.forEach((pRowMemoryLine) => {
    if (pRowMemoryLine.element) {
      if (pRowMemoryLine.title) {
        pRowMemoryLine.element.appendChild(
          svgelementfactory.createTitle(pRowMemoryLine.title),
        );
      }
      pRowMemoryLine.layer.appendChild(pRowMemoryLine.element);
    }
  });
}

function precalculateArcRowHeights(
  pArcRows: IFlatArc[][],
  pEntities: IEntityNormalized[],
  pOptions: IOptionsNormalized,
) {
  let lRealRowNumber = 0;

  pArcRows.forEach((pArcRow, pRowNumber) => {
    if (pArcRow.every((pArc) => pArc.isVirtual)) {
      rowmemory.set(
        pRowNumber,
        Math.max(
          rowmemory.get(pRowNumber).height,
          getArcRowHeight(pArcRow, pEntities, pOptions),
        ),
      );
    } else {
      rowmemory.set(
        pRowNumber,
        Math.max(
          rowmemory.get(pRowNumber).height,
          getArcRowHeight(pArcRow, pEntities, pOptions),
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
function renderArcRows(
  pArcRows: IFlatArc[][],
  pEntities: IEntityNormalized[],
  pOptions: IOptionsNormalized,
) {
  gInlineExpressionMemory = [];

  /* put some space between the entities and the arcs */
  createLifeLines(
    pEntities,
    "arcrow",
    gChart.arcRowHeight,
    rowmemory.get(-1).y,
  ).forEach((pLifeLine) => {
    gChart.layers.lifeline.appendChild(pLifeLine);
  });

  precalculateArcRowHeights(pArcRows, pEntities, pOptions);
  pArcRows.forEach((pArcRow, pCounter) => {
    renderArcRow(pArcRow, pCounter, pEntities, pOptions);
  });
  renderInlineExpressions(gInlineExpressionMemory);
}

/**
 * renderInlineExpressionLabel() - renders the label of an inline expression
 * (/ arc spanning arc)
 *
 * @param <object> pArc - the arc spanning arc
 * @param <number pY - where to start
 */
function renderInlineExpressionLabel(pArc: IFlatArc, pY: number) {
  const lOnD = entities.getOAndD(pArc.from, pArc.to);
  const FOLD_SIZE = 7;
  const lLabelContentAlreadyDetermined = pY > 0;

  const lMaxDepthCorrection = gChart.maxDepth * 2 * constants.LINE_WIDTH;

  const lMaxWidth =
    lOnD.to -
    lOnD.from +
    (entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH) -
    FOLD_SIZE -
    constants.LINE_WIDTH;

  const lStart =
    lOnD.from -
    (entities.getDims().interEntitySpacing -
      3 * constants.LINE_WIDTH -
      lMaxDepthCorrection) /
      2 -
    (gChart.maxDepth - pArc.depth) * 2 * constants.LINE_WIDTH;

  const lGroup = svgelementfactory.createGroup();
  if (!lLabelContentAlreadyDetermined) {
    pArc.label = pArc.kind + (pArc.label ? ": " + pArc.label : "");
  }

  const lTextGroup = renderlabels.createLabel(
    pArc,
    {
      x: lStart + constants.LINE_WIDTH - lMaxWidth / 2,
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

  const lHeight = Math.max(
    lBBox.height + 2 * constants.LINE_WIDTH,
    gChart.arcRowHeight / 2 - 2 * constants.LINE_WIDTH,
  );
  const lWidth = Math.min(lBBox.width + 2 * constants.LINE_WIDTH, lMaxWidth);

  const lBox = svgelementfactory.createEdgeRemark(
    {
      width: lWidth - constants.LINE_WIDTH + FOLD_SIZE,
      height: lHeight,
      x: lStart,
      y: pY,
    },
    {
      class: "box inline_expression_label",
      color: pArc.linecolor,
      bgColor: pArc.textbgcolor,
      foldSize: FOLD_SIZE,
    },
  );
  lGroup.appendChild(lBox);
  lGroup.appendChild(lTextGroup);

  return lGroup;
}

function createInlineExpressionBox(
  pOAndD,
  pArc: IFlatArc,
  pHeight: number,
  pY: number,
) {
  /* begin: same as createBox */
  const lMaxDepthCorrection = gChart.maxDepth * 2 * constants.LINE_WIDTH;
  const lWidth =
    pOAndD.to -
    pOAndD.from +
    entities.getDims().interEntitySpacing -
    2 * constants.LINE_WIDTH -
    lMaxDepthCorrection; // px
  const lStart =
    pOAndD.from -
    (entities.getDims().interEntitySpacing -
      2 * constants.LINE_WIDTH -
      lMaxDepthCorrection) /
      2;

  /* end: same as createBox */

  const lArcDepthCorrection =
    (gChart.maxDepth - pArc.depth) * 2 * constants.LINE_WIDTH;

  return svgelementfactory.createRect(
    {
      width: lWidth + lArcDepthCorrection * 2,
      height: pHeight
        ? pHeight
        : gChart.arcRowHeight - 2 * constants.LINE_WIDTH,
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

function renderInlineExpressions(pInlineExpressions) {
  pInlineExpressions.forEach((pInlineExpression) => {
    gChart.layers.inline.appendChild(
      renderInlineExpression(
        pInlineExpression,
        rowmemory.get(pInlineExpression.rownum).y,
      ),
    );
  });
}

function renderInlineExpression(pArcMem, pY: number) {
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

function createLifeLines(
  pEntities: IEntityNormalized[],
  pClass: string,
  pHeight: number,
  pY: number,
): (SVGLineElement | SVGPathElement)[] {
  /* c8 ignore start */
  if (pHeight < gChart.arcRowHeight) {
    pHeight = gChart.arcRowHeight;
  }
  /* c8 ignore stop */

  return pEntities.map((pEntity) => {
    const lLine = svgelementfactory.createLine(
      {
        xFrom: entities.getX(pEntity.name),
        yFrom: 0 - pHeight / 2 + (pY ? pY : 0),
        xTo: entities.getX(pEntity.name),
        yTo: pHeight / 2 + (pY ? pY : 0),
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

function createSelfRefArc(
  pKind: ArcKindNormalizedType,
  pX: number,
  pYTo: number,
  pDouble: boolean,
  pY: number,
  pLineColor?: string,
) {
  // globals: (gChart ->) arcRowHeight, (entities ->) interEntitySpacing

  const lHeight = 2 * (gChart.arcRowHeight / 5);
  const lWidth = entities.getDims().interEntitySpacing / 2;
  let lRetval: any = {};
  const lClass = `arc ${kind2class.getAggregateClass(
    pKind,
  )} ${kind2class.getClass(pKind)}`;

  if (pDouble) {
    lRetval = svgelementfactory.createGroup();

    const lInnerTurn = svgelementfactory.createUTurn(
      {
        x: pX,
        y: pY,
        width: lWidth - 2 * constants.LINE_WIDTH,
        height: lHeight,
      },
      pY + pYTo + lHeight - 2 * constants.LINE_WIDTH, // pY
      {
        class: lClass,
        dontHitHome: pKind !== "::",
        lineWidth: constants.LINE_WIDTH,
      },
    );
    /* we need a middle turn to attach the arrow to */
    const lMiddleTurn = svgelementfactory.createUTurn(
      {
        x: pX,
        y: pY,
        width: lWidth,
        height: lHeight,
      },
      pY + pYTo + lHeight - constants.LINE_WIDTH,
      { lineWidth: constants.LINE_WIDTH },
    );
    const lOuterTurn = svgelementfactory.createUTurn(
      {
        x: pX,
        y: pY,
        width: lWidth,
        height: lHeight,
      },
      pY + pYTo + lHeight,
      {
        class: lClass,
        dontHitHome: pKind !== "::",
        lineWidth: constants.LINE_WIDTH,
      },
    );
    if (!!pLineColor) {
      lInnerTurn.setAttribute("style", `stroke:${pLineColor}`);
    }
    markermanager
      .getAttributes(idmanager.get(), pKind, pLineColor, pX, pX)
      .forEach((pAttribute: any) => {
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
        x: pX,
        y: pY,
        width: lWidth,
        height: lHeight,
      },
      pY + pYTo + lHeight,
      {
        class: lClass,
        dontHitHome: pKind === "-x",
        lineWidth: constants.LINE_WIDTH,
      },
    );
    markermanager
      .getAttributes(idmanager.get(), pKind, pLineColor, pX, pX)
      .forEach((pAttribute: any) => {
        lRetval.setAttribute(pAttribute.name, pAttribute.value);
      });
  }

  return lRetval;
}

function renderEmptyArc(pArc: IFlatArc, pY: number) {
  if (pArc.kind === "---") {
    return createComment(pArc, entities.getOAndD(pArc.from, pArc.to), pY);
  } else {
    /* "..." / "|||" */
    return createLifeLinesText(pArc, entities.getOAndD(pArc.from, pArc.to), pY);
  }
}

function determineYToAbsolute(
  pRowNumber: number,
  pArcGradient: number,
  pArcSkip?: number,
): number {
  let lRetval = rowmemory.get(pRowNumber).y + pArcGradient;

  if (!!pArcSkip) {
    const lWholeArcSkip = Math.floor(pArcSkip);
    const lRestArcSkip = pArcSkip - lWholeArcSkip;
    const lCurrentRealRowNumber = rowmemory.get(pRowNumber).realRowNumber;

    lRetval =
      rowmemory.getByRealRowNumber(lCurrentRealRowNumber + lWholeArcSkip).y +
      lRestArcSkip *
        (rowmemory.getByRealRowNumber(lCurrentRealRowNumber + lWholeArcSkip + 1)
          .y -
          rowmemory.getByRealRowNumber(lCurrentRealRowNumber + lWholeArcSkip)
            .y);
  }
  return lRetval;
}

function determineDirectionClass(pArcKind: ArcKindNormalizedType): string {
  if (pArcKind === "<:>") {
    return "bidi ";
  } else if (pArcKind === "::") {
    return "nodi ";
  }
  return "";
}

function createArc(
  pArc: IFlatArc,
  pXFrom: number,
  pXTo: number,
  pRowNumber: number,
  pOptions: IOptionsNormalized,
) {
  const lGroup = svgelementfactory.createGroup();
  let lClass = "arc ";
  lClass += determineDirectionClass(pArc.kind);
  lClass += `${kind2class.getAggregateClass(pArc.kind)} ${kind2class.getClass(
    pArc.kind,
  )}`;
  const lDoubleLine = [":>", "::", "<:>"].includes(pArc.kind);
  const lYToAbsolute = determineYToAbsolute(
    pRowNumber,
    gChart.arcGradient,
    pArc.arcskip,
  );

  pXTo = renderutensils.determineArcXTo(pArc.kind, pXFrom, pXTo);

  if (pXFrom === pXTo) {
    lGroup.appendChild(
      createSelfRefArc(
        pArc.kind,
        pXFrom,
        lYToAbsolute - rowmemory.get(pRowNumber).y - gChart.arcGradient,
        lDoubleLine,
        rowmemory.get(pRowNumber).y,
        pArc.linecolor,
      ),
    );

    /* creates a label left aligned, a little above the arc*/
    const lTextWidth = (2 * entities.getDims().interEntitySpacing) / 3;
    lGroup.appendChild(
      renderlabels.createLabel(
        pArc,
        {
          x: pXFrom + 1.5 * constants.LINE_WIDTH - lTextWidth / 2,
          y:
            rowmemory.get(pRowNumber).y -
            gChart.arcRowHeight / 5 -
            constants.LINE_WIDTH / 2,
          width: lTextWidth,
        },
        Object.assign(
          {
            alignLeft: true,
            alignAbove: true,
            ownBackground: true,
          },
          structuredClone(pOptions),
        ),
      ),
    );
  } else {
    const lLine = svgelementfactory.createLine(
      {
        xFrom: pXFrom,
        yFrom: rowmemory.get(pRowNumber).y,
        xTo: pXTo,
        yTo: lYToAbsolute,
      },
      {
        class: lClass,
        doubleLine: lDoubleLine,
      },
    );
    markermanager
      .getAttributes(idmanager.get(), pArc.kind, pArc.linecolor, pXFrom, pXTo)
      .forEach((pAttribute: any) => {
        lLine.setAttribute(pAttribute.name, pAttribute.value);
      });
    lGroup.appendChild(lLine);

    /* create a label centered on the arc */
    lGroup.appendChild(
      renderlabels.createLabel(
        pArc,
        {
          x: pXFrom,
          y:
            rowmemory.get(pRowNumber).y +
            (lYToAbsolute - rowmemory.get(pRowNumber).y) / 2,
          width: pXTo - pXFrom,
        },
        Object.assign(
          {
            alignAround: true,
            alignAbove: gChart.regularArcTextVerticalAlignment === "above",
            ownBackground: true,
          },
          structuredClone(pOptions),
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
function createLifeLinesText(pArc: IFlatArc, pOAndD, pY: number) {
  let lArcStart = 0;
  let lArcEnd = gChart.arcEndX;

  if (pArc.from && pArc.to) {
    lArcStart = pOAndD.from;
    lArcEnd = pOAndD.to - pOAndD.from;
  }
  return renderlabels.createLabel(
    pArc,
    { x: lArcStart, y: pY, width: lArcEnd },
    { ownBackground: true, wordwraparcs: gChart.wordWrapArcs },
  );
}

/**
 * createComment() - creates an element representing a comment ('---')
 *
 * @param <string> - pId - the unique identification of the comment within the svg
 * @param <object> - pArc - the (comment) arc to render
 */
function createComment(pArc: IFlatArc, pOAndD, pY: number) {
  let lStartX = 0;
  let lEndX = gChart.arcEndX;
  let lClass = "comment";
  const lGroup = svgelementfactory.createGroup();

  if (pArc.from && pArc.to) {
    const lMaxDepthCorrection = gChart.maxDepth * 1 * constants.LINE_WIDTH;
    const lArcDepthCorrection =
      (gChart.maxDepth - pArc.depth) * 2 * constants.LINE_WIDTH;

    lStartX =
      pOAndD.from -
      (entities.getDims().interEntitySpacing + 2 * constants.LINE_WIDTH) / 2 -
      (lArcDepthCorrection - lMaxDepthCorrection);
    lEndX =
      pOAndD.to +
      (entities.getDims().interEntitySpacing + 2 * constants.LINE_WIDTH) / 2 +
      (lArcDepthCorrection - lMaxDepthCorrection);
    lClass = "inline_expression_divider";
  }
  const lLine = svgelementfactory.createLine(
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

/**
 * creates an element representing a box (box, abox, rbox, note)
 *
 * @param <string> - pId - the unique identification of the box within the svg
 * @param <number> - pFrom - the x coordinate to render the box from
 * @param <number> - pTo - the x coordinate to render the box to
 * @param <object> - pArc - the (box/ arc spanning) arc to render
 * @param <number> - pHeight - the height of the box to render. If not passed
 * takes the bounding box of the (rendered) label of the arc, taking care not
 * to get smaller than the default arc row height
 */
function createBox(
  pOAndD: IOandD,
  pArc: IFlatArc,
  pY: number,
  pOptions: IOptionsNormalized,
): SVGGElement {
  /* begin: same as createInlineExpressionBox */
  const lMaxDepthCorrection = gChart.maxDepth * 2 * constants.LINE_WIDTH;
  const lWidth =
    pOAndD.to -
    pOAndD.from +
    entities.getDims().interEntitySpacing -
    2 * constants.LINE_WIDTH -
    lMaxDepthCorrection; // px
  const lStart =
    pOAndD.from -
    (entities.getDims().interEntitySpacing -
      2 * constants.LINE_WIDTH -
      lMaxDepthCorrection) /
      2;
  /* end: same as createInlineExpressionBox */

  const lGroup = svgelementfactory.createGroup();
  let lBox: SVGElement;
  const lTextGroup = renderlabels.createLabel(
    pArc,
    { x: lStart, y: pY, width: lWidth },
    pOptions,
  );
  const lTextBBox = svgutensils.getBBox(lTextGroup);
  const lHeight = Math.max(
    lTextBBox.height + 2 * constants.LINE_WIDTH,
    gChart.arcRowHeight - 2 * constants.LINE_WIDTH,
  );
  const lBBox = {
    width: lWidth,
    height: lHeight,
    x: lStart,
    y: pY - lHeight / 2,
  };

  switch (pArc.kind) {
    case "rbox":
      lBox = svgelementfactory.createRBox(lBBox, {
        class: "box rbox",
        color: pArc.linecolor,
        bgColor: pArc.textbgcolor,
      });
      break;
    case "abox":
      lBox = svgelementfactory.createABox(lBBox, {
        class: "box abox",
        color: pArc.linecolor,
        bgColor: pArc.textbgcolor,
      });
      break;
    case "note":
      lBox = svgelementfactory.createNote(lBBox, {
        class: "box note",
        color: pArc.linecolor,
        bgColor: pArc.textbgcolor,
        lineWidth: constants.LINE_WIDTH,
      });
      break;
    default: // "box"
      lBox = svgelementfactory.createRect(lBBox, {
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

/**
 * removes the element with id pParentElementId from the DOM
 *
 * @param - {string} pParentElementId - the element the element with
 * the id mentioned above is supposed to be residing in
 * @param - {window} pWindow - the browser window object
 *
 */
export const clean = (pParentElementId: string, pWindow: Window) => {
  gChart.document = renderskeleton.init(pWindow);
  svgutensils.init(gChart.document);
  svgutensils.removeRenderedSVGFromElement(pParentElementId);
};

/**
 * renders the given abstract syntax tree pAST as svg
 * in the element with id pParentELementId in the window pWindow
 *
 * @param {ISequenceChart} pAST - the abstract syntax tree
 * @param {Window} pWindow - the browser window to put the svg in
 * @param {string} pParentElementId - the id of the parent element in which
 * to put the __svg_output element
 * @param  {INormalizedRenderOptions} pOptions
 * - styleAdditions:  valid css that augments the default style
 * - additionalTemplate: a named (baked in) template. Current values:
 *  "inverted", "grayscaled"
 * - source: the source msc to embed in the svg
 * - mirrorEntitiesOnBottom: (boolean) whether or not to repeat entities
 *   on the bottom of the chart
 */
export function render(
  pAST: ISequenceChart,
  pWindow: Window,
  pParentElementId: string,
  pRenderOptions: INormalizedRenderOptions,
) {
  const lFlattenedAST: IFlatSequenceChart = Object.freeze(flatten(pAST));
  const lParentElement = getParentElement(pWindow, pParentElementId);

  idmanager.setPrefix(pParentElementId);
  renderASTPre(lFlattenedAST, pWindow, lParentElement, pRenderOptions || {});
  renderASTMain(lFlattenedAST);
  renderASTPost(lFlattenedAST);

  return svgutensils.webkitNamespaceBugWorkaround(lParentElement.innerHTML);
}
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
