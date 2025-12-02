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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextRenderer =
	exports.getGraphicsRenderer =
	exports.getParser =
		void 0;
var mscgenparser = __importStar(require("../parse/mscgenparser"));
var msgennyparser = __importStar(require("../parse/msgennyparser"));
var xuparser = __importStar(require("../parse/xuparser"));
var renderast = __importStar(require("../render/graphics/renderast"));
var ast2dot = __importStar(require("../render/text/ast2dot"));
var ast2doxygen = __importStar(require("../render/text/ast2doxygen"));
var ast2mscgen = __importStar(require("../render/text/ast2mscgen"));
var ast2msgenny = __importStar(require("../render/text/ast2msgenny"));
var ast2xu = __importStar(require("../render/text/ast2xu"));
var DEFAULT_PARSER = mscgenparser;
var DEFAULT_TEXT_RENDERER = ast2mscgen;
var gLang2Parser = Object.freeze({
	mscgen: mscgenparser,
	xu: xuparser,
	msgenny: msgennyparser,
});
var gLang2TextRenderer = Object.freeze({
	mscgen: ast2mscgen,
	msgenny: ast2msgenny,
	xu: ast2xu,
	dot: ast2dot,
	doxygen: ast2doxygen,
});
var getParser = function (pLanguage) {
	if (["ast", "json"].includes(pLanguage)) {
		return JSON;
	}
	return gLang2Parser[pLanguage] || DEFAULT_PARSER;
};
exports.getParser = getParser;
var getGraphicsRenderer = function () {
	return renderast;
};
exports.getGraphicsRenderer = getGraphicsRenderer;
var getTextRenderer = function (pLanguage) {
	return gLang2TextRenderer[pLanguage] || DEFAULT_TEXT_RENDERER;
};
exports.getTextRenderer = getTextRenderer;
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
