"use strict";
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				var desc = Object.getOwnPropertyDescriptor(m, k);
				if (
					!desc ||
					("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
				) {
					desc = {
						enumerable: true,
						get: function () {
							return m[k];
						},
					};
				}
				Object.defineProperty(o, k2, desc);
			}
		: function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				o[k2] = m[k];
			});
var __setModuleDefault =
	(this && this.__setModuleDefault) ||
	(Object.create
		? function (o, v) {
				Object.defineProperty(o, "default", { enumerable: true, value: v });
			}
		: function (o, v) {
				o["default"] = v;
			});
var __importStar =
	(this && this.__importStar) ||
	(function () {
		var ownKeys = function (o) {
			ownKeys =
				Object.getOwnPropertyNames ||
				function (o) {
					var ar = [];
					for (var k in o)
						if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
					return ar;
				};
			return ownKeys(o);
		};
		return function (mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null)
				for (var k = ownKeys(mod), i = 0; i < k.length; i++)
					if (k[i] !== "default") __createBinding(result, mod, k[i]);
			__setModuleDefault(result, mod);
			return result;
		};
	})();
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = void 0;
exports.render = render;
var aggregatekind_1 = __importDefault(require("../astmassage/aggregatekind"));
var flatten_1 = require("../astmassage/flatten");
var constants_1 = __importDefault(require("./constants"));
var entities_1 = require("./entities");
var idmanager = __importStar(require("./idmanager"));
var kind2class = __importStar(require("./kind2class"));
var markermanager = __importStar(require("./markermanager"));
var renderlabels = __importStar(require("./renderlabels"));
var renderskeleton = __importStar(require("./renderskeleton"));
var renderutensils = __importStar(require("./renderutensils"));
var rowmemory = __importStar(require("./rowmemory"));
var svgelementfactory = __importStar(require("./svgelementfactory/index"));
var svgutensils = __importStar(require("./svgutensils"));
var entities = new entities_1.Thing(0);
//#endregion
//#region const
var PAD_VERTICAL = 3;
var DEFAULT_ARCROW_HEIGHT = 38; // chart only
var DEFAULT_ARC_GRADIENT = 0; // chart only
//#endregion
//#region global variables
/* sensible default - get overwritten in bootstrap */
var gChart = Object.seal({
	arcRowHeight: DEFAULT_ARCROW_HEIGHT,
	arcGradient: DEFAULT_ARC_GRADIENT,
	arcEndX: 0,
	wordWrapArcs: false,
	mirrorEntitiesOnBottom: false,
	regularArcTextVerticalAlignment: "middle",
	maxDepth: 0,
	document: {},
	layers: {
		lifeline: {},
		sequence: {},
		notes: {},
		inline: {},
		watermark: {},
	},
});
var gInlineExpressionMemory = [];
//#endregion
function getParentElement(pWindow, pParentElementId) {
	return (
		pWindow.document.getElementById(pParentElementId) || pWindow.document.body
	);
}
//#region render level 0 & 1
function renderASTPre(pAST, pWindow, pParentElement, pOptions) {
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
function renderASTMain(pAST) {
	renderEntities(pAST.entities, 0, pAST.options);
	rowmemory.clear(entities.getDims().height, gChart.arcRowHeight);
	renderArcRows(pAST.arcs, pAST.entities, pAST.options);
	if (gChart.mirrorEntitiesOnBottom) {
		renderEntitiesOnBottom(pAST.entities, pAST.options);
	}
}
function renderASTPost(pAST) {
	var lCanvas = calculateCanvasDimensions(pAST);
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
function preProcessOptionsArcs(pChart, pOptions) {
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
function preProcessOptions(pChart, pOptions) {
	entities = new entities_1.Thing(pOptions && pOptions.hscale);
	preProcessOptionsArcs(pChart, pOptions);
}
function calculateCanvasDimensions(pAST) {
	var lDepthCorrection = renderutensils.determineDepthCorrection(
		pAST.depth,
		constants_1.default.LINE_WIDTH,
	);
	var lRowInfo = rowmemory.getLast();
	var lCanvas = {
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
	};
	lCanvas.x = 0 - lCanvas.horizontaltransform;
	lCanvas.y = 0 - lCanvas.verticaltransform;
	return lCanvas;
}
function renderBackground(pCanvas) {
	var lBackground = gChart.document.getElementById(
		idmanager.get("_background"),
	);
	if (lBackground) {
		lBackground.appendChild(
			svgelementfactory.createRect(pCanvas, { class: "bglayer" }),
		);
	}
}
function renderWatermark(pWatermark, pCanvas) {
	gChart.layers.watermark.appendChild(
		svgelementfactory.createDiagonalText(pWatermark, pCanvas, "watermark"),
	);
}
function postProcessOptions(pOptions, pCanvas) {
	if (pOptions.watermark) {
		renderWatermark(pOptions.watermark, pCanvas);
	}
	if (pOptions.width && pOptions.width !== "auto") {
		pCanvas = renderutensils.scaleCanvasToWidth(pOptions.width, pCanvas);
	}
	return pCanvas;
}
function renderSvgElement(pCanvas) {
	var lSvgElement = gChart.document.getElementById(idmanager.get());
	var lBody = gChart.document.getElementById(idmanager.get("_body"));
	if (lBody && lSvgElement) {
		lBody.setAttribute(
			"transform",
			"translate("
				.concat(pCanvas.horizontaltransform, ",")
				.concat(pCanvas.verticaltransform, ") ") +
				"scale(".concat(pCanvas.scale, ",").concat(pCanvas.scale, ")"),
		);
		if (!!pCanvas.autoscale && pCanvas.autoscale === true) {
			svgelementfactory.updateSVG(lSvgElement, {
				width: "100%",
				height: "100%",
				viewBox: "0 0 "
					.concat(pCanvas.width.toString(), " ")
					.concat(pCanvas.height.toString()),
			});
		} else {
			svgelementfactory.updateSVG(lSvgElement, {
				width: pCanvas.width.toString(),
				height: pCanvas.height.toString(),
				viewBox: "0 0 "
					.concat(pCanvas.width.toString(), " ")
					.concat(pCanvas.height.toString()),
			});
		}
	}
}
//#region entities
function renderEntitiesOnBottom(pEntities, pOptions) {
	var lLifeLineSpacerY =
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
	).forEach(function (pLifeLine) {
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
function renderEntities(pEntities, pEntityYPos, pOptions) {
	gChart.layers.sequence.appendChild(
		entities.renderEntities(pEntities, pEntityYPos, pOptions),
	);
	gChart.arcEndX =
		entities.getDims().entityXHWM -
		entities.getDims().interEntitySpacing +
		entities.getDims().width;
}
//#endregion
function renderBroadcastArc(pArc, pEntities, pRowMemory, pRowNumber, pOptions) {
	var xTo = 0;
	var lLabel = pArc.label;
	var xFrom = entities.getX(pArc.from);
	pArc.label = "";
	pEntities.forEach(function (pEntity) {
		var lElement = {};
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
function renderRegularArc(pArc, pEntities, pRowMemory, pRowNumber, pOptions) {
	var lElement = svgelementfactory.createGroup();
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
function getArcRowHeight(pArcRow, pEntities, pOptions) {
	var lRetval = 0;
	pArcRow.forEach(function (pArc) {
		var lElement;
		switch ((0, aggregatekind_1.default)(pArc.kind)) {
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
				var lArc = structuredClone(pArc);
				lArc.arcskip = 0;
				lElement = renderRegularArc(lArc, pEntities, [], 0, pOptions); // TODO is 0 a good row number for this?
		} // switch
		lRetval = Math.max(
			lRetval,
			svgutensils.getBBox(lElement).height + 2 * constants_1.default.LINE_WIDTH,
		);
	}); // for all arcs in a row
	return lRetval;
}
function renderArcRow(pArcRow, pRowNumber, pEntities, pOptions) {
	var lArcRowClass = "arcrow";
	var lRowMemory = [];
	pArcRow.forEach(function (pArc) {
		var lElement = {};
		switch ((0, aggregatekind_1.default)(pArc.kind)) {
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
	).forEach(function (pLifeLine) {
		gChart.layers.lifeline.appendChild(pLifeLine);
	});
	lRowMemory.forEach(function (pRowMemoryLine) {
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
function precalculateArcRowHeights(pArcRows, pEntities, pOptions) {
	var lRealRowNumber = 0;
	pArcRows.forEach(function (pArcRow, pRowNumber) {
		if (
			pArcRow.every(function (pArc) {
				return pArc.isVirtual;
			})
		) {
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
function renderArcRows(pArcRows, pEntities, pOptions) {
	gInlineExpressionMemory = [];
	/* put some space between the entities and the arcs */
	createLifeLines(
		pEntities,
		"arcrow",
		gChart.arcRowHeight,
		rowmemory.get(-1).y,
	).forEach(function (pLifeLine) {
		gChart.layers.lifeline.appendChild(pLifeLine);
	});
	precalculateArcRowHeights(pArcRows, pEntities, pOptions);
	pArcRows.forEach(function (pArcRow, pCounter) {
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
function renderInlineExpressionLabel(pArc, pY) {
	var lOnD = entities.getOAndD(pArc.from, pArc.to);
	var FOLD_SIZE = 7;
	var lLabelContentAlreadyDetermined = pY > 0;
	var lMaxDepthCorrection =
		gChart.maxDepth * 2 * constants_1.default.LINE_WIDTH;
	var lMaxWidth =
		lOnD.to -
		lOnD.from +
		(entities.getDims().interEntitySpacing -
			2 * constants_1.default.LINE_WIDTH) -
		FOLD_SIZE -
		constants_1.default.LINE_WIDTH;
	var lStart =
		lOnD.from -
		(entities.getDims().interEntitySpacing -
			3 * constants_1.default.LINE_WIDTH -
			lMaxDepthCorrection) /
			2 -
		(gChart.maxDepth - pArc.depth) * 2 * constants_1.default.LINE_WIDTH;
	var lGroup = svgelementfactory.createGroup();
	if (!lLabelContentAlreadyDetermined) {
		pArc.label = pArc.kind + (pArc.label ? ": " + pArc.label : "");
	}
	var lTextGroup = renderlabels.createLabel(
		pArc,
		{
			x: lStart + constants_1.default.LINE_WIDTH - lMaxWidth / 2,
			y: pY + gChart.arcRowHeight / 4,
			width: lMaxWidth,
		},
		{
			alignLeft: true,
			ownBackground: false,
			wordwraparcs: gChart.wordWrapArcs,
		},
	);
	var lBBox = svgutensils.getBBox(lTextGroup);
	var lHeight = Math.max(
		lBBox.height + 2 * constants_1.default.LINE_WIDTH,
		gChart.arcRowHeight / 2 - 2 * constants_1.default.LINE_WIDTH,
	);
	var lWidth = Math.min(
		lBBox.width + 2 * constants_1.default.LINE_WIDTH,
		lMaxWidth,
	);
	var lBox = svgelementfactory.createEdgeRemark(
		{
			width: lWidth - constants_1.default.LINE_WIDTH + FOLD_SIZE,
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
function createInlineExpressionBox(pOAndD, pArc, pHeight, pY) {
	/* begin: same as createBox */
	var lMaxDepthCorrection =
		gChart.maxDepth * 2 * constants_1.default.LINE_WIDTH;
	var lWidth =
		pOAndD.to -
		pOAndD.from +
		entities.getDims().interEntitySpacing -
		2 * constants_1.default.LINE_WIDTH -
		lMaxDepthCorrection; // px
	var lStart =
		pOAndD.from -
		(entities.getDims().interEntitySpacing -
			2 * constants_1.default.LINE_WIDTH -
			lMaxDepthCorrection) /
			2;
	/* end: same as createBox */
	var lArcDepthCorrection =
		(gChart.maxDepth - pArc.depth) * 2 * constants_1.default.LINE_WIDTH;
	return svgelementfactory.createRect(
		{
			width: lWidth + lArcDepthCorrection * 2,
			height: pHeight
				? pHeight
				: gChart.arcRowHeight - 2 * constants_1.default.LINE_WIDTH,
			x: lStart - lArcDepthCorrection,
			y: pY,
		},
		{
			class: "box inline_expression ".concat(pArc.kind),
			color: pArc.linecolor,
			bgColor: pArc.textbgcolor,
		},
	);
}
function renderInlineExpressions(pInlineExpressions) {
	pInlineExpressions.forEach(function (pInlineExpression) {
		gChart.layers.inline.appendChild(
			renderInlineExpression(
				pInlineExpression,
				rowmemory.get(pInlineExpression.rownum).y,
			),
		);
	});
}
function renderInlineExpression(pArcMem, pY) {
	var lFromY = rowmemory.get(pArcMem.rownum).y;
	var lToY = rowmemory.get(pArcMem.rownum + pArcMem.arc.numberofrows + 1).y;
	var lHeight = lToY - lFromY;
	pArcMem.arc.label = "";
	return createInlineExpressionBox(
		entities.getOAndD(pArcMem.arc.from, pArcMem.arc.to),
		pArcMem.arc,
		lHeight,
		pY,
	);
}
function createLifeLines(pEntities, pClass, pHeight, pY) {
	/* istanbul ignore if */
	if (pHeight < gChart.arcRowHeight) {
		pHeight = gChart.arcRowHeight;
	}
	return pEntities.map(function (pEntity) {
		var lLine = svgelementfactory.createLine(
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
			lLine.setAttribute("style", "stroke:".concat(pEntity.linecolor, ";"));
		}
		return lLine;
	});
}
function createSelfRefArc(pKind, pX, pYTo, pDouble, pY, pLineColor) {
	// globals: (gChart ->) arcRowHeight, (entities ->) interEntitySpacing
	var lHeight = 2 * (gChart.arcRowHeight / 5);
	var lWidth = entities.getDims().interEntitySpacing / 2;
	var lRetval = {};
	var lClass = "arc "
		.concat(kind2class.getAggregateClass(pKind), " ")
		.concat(kind2class.getClass(pKind));
	if (pDouble) {
		lRetval = svgelementfactory.createGroup();
		var lInnerTurn = svgelementfactory.createUTurn(
			{
				x: pX,
				y: pY,
				width: lWidth - 2 * constants_1.default.LINE_WIDTH,
				height: lHeight,
			},
			pY + pYTo + lHeight - 2 * constants_1.default.LINE_WIDTH, // pY
			{
				class: lClass,
				dontHitHome: pKind !== "::",
				lineWidth: constants_1.default.LINE_WIDTH,
			},
		);
		/* we need a middle turn to attach the arrow to */
		var lMiddleTurn_1 = svgelementfactory.createUTurn(
			{
				x: pX,
				y: pY,
				width: lWidth,
				height: lHeight,
			},
			pY + pYTo + lHeight - constants_1.default.LINE_WIDTH,
			{ lineWidth: constants_1.default.LINE_WIDTH },
		);
		var lOuterTurn = svgelementfactory.createUTurn(
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
				lineWidth: constants_1.default.LINE_WIDTH,
			},
		);
		if (!!pLineColor) {
			lInnerTurn.setAttribute("style", "stroke:".concat(pLineColor));
		}
		markermanager
			.getAttributes(idmanager.get(), pKind, pLineColor, pX, pX)
			.forEach(function (pAttribute) {
				lMiddleTurn_1.setAttribute(pAttribute.name, pAttribute.value);
			});
		lMiddleTurn_1.setAttribute("style", "stroke:transparent;");
		if (Boolean(pLineColor)) {
			lOuterTurn.setAttribute("style", "stroke:".concat(pLineColor));
		}
		lRetval.appendChild(lInnerTurn);
		lRetval.appendChild(lOuterTurn);
		lRetval.appendChild(lMiddleTurn_1);
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
				lineWidth: constants_1.default.LINE_WIDTH,
			},
		);
		markermanager
			.getAttributes(idmanager.get(), pKind, pLineColor, pX, pX)
			.forEach(function (pAttribute) {
				lRetval.setAttribute(pAttribute.name, pAttribute.value);
			});
	}
	return lRetval;
}
function renderEmptyArc(pArc, pY) {
	if (pArc.kind === "---") {
		return createComment(pArc, entities.getOAndD(pArc.from, pArc.to), pY);
	} else {
		/* "..." / "|||" */
		return createLifeLinesText(pArc, entities.getOAndD(pArc.from, pArc.to), pY);
	}
}
function determineYToAbsolute(pRowNumber, pArcGradient, pArcSkip) {
	var lRetval = rowmemory.get(pRowNumber).y + pArcGradient;
	if (!!pArcSkip) {
		var lWholeArcSkip = Math.floor(pArcSkip);
		var lRestArcSkip = pArcSkip - lWholeArcSkip;
		var lCurrentRealRowNumber = rowmemory.get(pRowNumber).realRowNumber;
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
function determineDirectionClass(pArcKind) {
	if (pArcKind === "<:>") {
		return "bidi ";
	} else if (pArcKind === "::") {
		return "nodi ";
	}
	return "";
}
function createArc(pArc, pXFrom, pXTo, pRowNumber, pOptions) {
	var lGroup = svgelementfactory.createGroup();
	var lClass = "arc ";
	lClass += determineDirectionClass(pArc.kind);
	lClass += ""
		.concat(kind2class.getAggregateClass(pArc.kind), " ")
		.concat(kind2class.getClass(pArc.kind));
	var lDoubleLine = [":>", "::", "<:>"].includes(pArc.kind);
	var lYToAbsolute = determineYToAbsolute(
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
		var lTextWidth = (2 * entities.getDims().interEntitySpacing) / 3;
		lGroup.appendChild(
			renderlabels.createLabel(
				pArc,
				{
					x: pXFrom + 1.5 * constants_1.default.LINE_WIDTH - lTextWidth / 2,
					y:
						rowmemory.get(pRowNumber).y -
						gChart.arcRowHeight / 5 -
						constants_1.default.LINE_WIDTH / 2,
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
		var lLine_1 = svgelementfactory.createLine(
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
			.forEach(function (pAttribute) {
				lLine_1.setAttribute(pAttribute.name, pAttribute.value);
			});
		lGroup.appendChild(lLine_1);
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
function createLifeLinesText(pArc, pOAndD, pY) {
	var lArcStart = 0;
	var lArcEnd = gChart.arcEndX;
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
function createComment(pArc, pOAndD, pY) {
	var lStartX = 0;
	var lEndX = gChart.arcEndX;
	var lClass = "comment";
	var lGroup = svgelementfactory.createGroup();
	if (pArc.from && pArc.to) {
		var lMaxDepthCorrection =
			gChart.maxDepth * 1 * constants_1.default.LINE_WIDTH;
		var lArcDepthCorrection =
			(gChart.maxDepth - pArc.depth) * 2 * constants_1.default.LINE_WIDTH;
		lStartX =
			pOAndD.from -
			(entities.getDims().interEntitySpacing +
				2 * constants_1.default.LINE_WIDTH) /
				2 -
			(lArcDepthCorrection - lMaxDepthCorrection);
		lEndX =
			pOAndD.to +
			(entities.getDims().interEntitySpacing +
				2 * constants_1.default.LINE_WIDTH) /
				2 +
			(lArcDepthCorrection - lMaxDepthCorrection);
		lClass = "inline_expression_divider";
	}
	var lLine = svgelementfactory.createLine(
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
		lLine.setAttribute("style", "stroke:".concat(pArc.linecolor, ";"));
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
function createBox(pOAndD, pArc, pY, pOptions) {
	/* begin: same as createInlineExpressionBox */
	var lMaxDepthCorrection =
		gChart.maxDepth * 2 * constants_1.default.LINE_WIDTH;
	var lWidth =
		pOAndD.to -
		pOAndD.from +
		entities.getDims().interEntitySpacing -
		2 * constants_1.default.LINE_WIDTH -
		lMaxDepthCorrection; // px
	var lStart =
		pOAndD.from -
		(entities.getDims().interEntitySpacing -
			2 * constants_1.default.LINE_WIDTH -
			lMaxDepthCorrection) /
			2;
	/* end: same as createInlineExpressionBox */
	var lGroup = svgelementfactory.createGroup();
	var lBox;
	var lTextGroup = renderlabels.createLabel(
		pArc,
		{ x: lStart, y: pY, width: lWidth },
		pOptions,
	);
	var lTextBBox = svgutensils.getBBox(lTextGroup);
	var lHeight = Math.max(
		lTextBBox.height + 2 * constants_1.default.LINE_WIDTH,
		gChart.arcRowHeight - 2 * constants_1.default.LINE_WIDTH,
	);
	var lBBox = {
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
				lineWidth: constants_1.default.LINE_WIDTH,
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
var clean = function (pParentElementId, pWindow) {
	gChart.document = renderskeleton.init(pWindow);
	svgutensils.init(gChart.document);
	svgutensils.removeRenderedSVGFromElement(pParentElementId);
};
exports.clean = clean;
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
function render(pAST, pWindow, pParentElementId, pRenderOptions) {
	var lFlattenedAST = Object.freeze((0, flatten_1.flatten)(pAST));
	var lParentElement = getParentElement(pWindow, pParentElementId);
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
