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
exports.Thing = void 0;
const constants_1 = __importDefault(require("./constants"));
const renderlabels = __importStar(require("./renderlabels"));
const svgelementfactory = __importStar(require("./svgelementfactory/index"));
const svgutensils = __importStar(require("./svgutensils"));
const DEFAULT_INTER_ENTITY_SPACING = 160; // px
const DEFAULT_ENTITY_WIDTH = 100; // px
const DEFAULT_ENTITY_HEIGHT = 34; // px
class Thing {
	constructor(pHScale) {
		this.interEntitySpacing = DEFAULT_INTER_ENTITY_SPACING;
		this.height = DEFAULT_ENTITY_HEIGHT;
		this.width = DEFAULT_ENTITY_WIDTH;
		this.entityXHWM = 0;
		this.entity2x = {};
		if (pHScale) {
			this.interEntitySpacing = pHScale * DEFAULT_INTER_ENTITY_SPACING;
			this.width = pHScale * DEFAULT_ENTITY_WIDTH;
		}
	}
	getX(pName) {
		return this.entity2x[pName];
	}
	getDims() {
		return {
			interEntitySpacing: this.interEntitySpacing,
			height: this.height,
			width: this.width,
			entityXHWM: this.entityXHWM,
		};
	}
	getOAndD(pFrom, pTo) {
		return {
			from:
				this.getX(pFrom) < this.getX(pTo) ? this.getX(pFrom) : this.getX(pTo),
			to: this.getX(pTo) > this.getX(pFrom) ? this.getX(pTo) : this.getX(pFrom),
		};
	}
	renderEntities(pEntities, pEntityYPos, pOptions) {
		const lEntityGroup = svgelementfactory.createGroup();
		this.entityXHWM = 0;
		this.height =
			this.getMaxEntityHeight(pEntities, pOptions) +
			constants_1.default.LINE_WIDTH * 2;
		pEntities.forEach((pEntity) => {
			lEntityGroup.appendChild(
				this.renderEntity(pEntity, this.entityXHWM, pEntityYPos, pOptions),
			);
			this.setX(pEntity, this.entityXHWM);
			this.entityXHWM += this.interEntitySpacing;
		});
		return lEntityGroup;
	}
	setX(pEntity, pX) {
		this.entity2x[pEntity.name] = pX + this.width / 2;
	}
	getNoEntityLines(pLabel, pFontSize, pChartOptions) {
		return renderlabels.splitLabel(
			pLabel,
			"entity",
			this.width,
			pFontSize,
			pChartOptions,
		).length;
	}
	sizeEntityBoxToLabel(pLabel, pBBox) {
		const lLabelWidth = Math.min(
			svgutensils.getBBox(pLabel).width + 4 * constants_1.default.LINE_WIDTH,
			this.interEntitySpacing / 3 + pBBox.width,
		);
		/* c8 ignore start */
		if (lLabelWidth >= pBBox.width) {
			pBBox.x -= (lLabelWidth - pBBox.width) / 2;
			pBBox.width = lLabelWidth;
		}
		/* c8 ignore stop */
		return pBBox;
	}
	renderEntity(pEntity, pX, pY, pOptions) {
		const lGroup = svgelementfactory.createGroup();
		const lBBox = {
			x: pX || 0,
			y: pY || 0,
			width: this.width,
			height: this.height,
		};
		const lLabel = renderlabels.createLabel(
			Object.assign(
				{
					kind: "entity",
				},
				pEntity,
			),
			Object.assign({}, lBBox, { y: lBBox.y + lBBox.height / 2 }),
			pOptions,
		);
		lGroup.appendChild(
			svgelementfactory.createRect(this.sizeEntityBoxToLabel(lLabel, lBBox), {
				class: "entity",
				color: pEntity.linecolor,
				bgColor: pEntity.textbgcolor,
			}),
		);
		lGroup.appendChild(lLabel);
		return lGroup;
	}
	getMaxEntityHeight(pEntities, pOptions) {
		let lHighestEntity = pEntities[0];
		let lHWM = 2;
		pEntities.forEach((pEntity) => {
			const lNoEntityLines = this.getNoEntityLines(
				pEntity.label,
				constants_1.default.FONT_SIZE,
				pOptions,
			);
			if (lNoEntityLines > lHWM) {
				lHWM = lNoEntityLines;
				lHighestEntity = pEntity;
			}
		});
		if (lHWM > 2) {
			return Math.max(
				this.height,
				svgutensils.getBBox(this.renderEntity(lHighestEntity, 0, 0, pOptions))
					.height,
			);
		}
		return this.height;
	}
}
exports.Thing = Thing;
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
