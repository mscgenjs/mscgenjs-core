"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var constants_1 = __importDefault(require("./constants"));
var renderlabels_1 = __importDefault(require("./renderlabels"));
var index_1 = __importDefault(require("./svgelementfactory/index"));
var svgutensils = __importStar(require("./svgutensils"));
var DEFAULT_INTER_ENTITY_SPACING = 160; // px
var DEFAULT_ENTITY_WIDTH = 100; // px
var DEFAULT_ENTITY_HEIGHT = 34; // px
var Thing = /** @class */ (function () {
    function Thing(pHScale) {
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
    Thing.prototype.getX = function (pName) {
        return this.entity2x[pName];
    };
    Thing.prototype.getDims = function () {
        return ({
            interEntitySpacing: this.interEntitySpacing,
            height: this.height,
            width: this.width,
            entityXHWM: this.entityXHWM
        });
    };
    Thing.prototype.getOAndD = function (pFrom, pTo) {
        return {
            from: this.getX(pFrom) < this.getX(pTo) ? this.getX(pFrom) : this.getX(pTo),
            to: this.getX(pTo) > this.getX(pFrom) ? this.getX(pTo) : this.getX(pFrom)
        };
    };
    Thing.prototype.renderEntities = function (pEntities, pEntityYPos, pOptions) {
        var _this = this;
        var lEntityGroup = index_1["default"].createGroup();
        this.entityXHWM = 0;
        this.height = this.getMaxEntityHeight(pEntities, pOptions) + constants_1["default"].LINE_WIDTH * 2;
        pEntities.forEach(function (pEntity) {
            lEntityGroup.appendChild(_this.renderEntity(pEntity, _this.entityXHWM, pEntityYPos, pOptions));
            _this.setX(pEntity, _this.entityXHWM);
            _this.entityXHWM += _this.interEntitySpacing;
        });
        return lEntityGroup;
    };
    Thing.prototype.setX = function (pEntity, pX) {
        this.entity2x[pEntity.name] = pX + (this.width / 2);
    };
    Thing.prototype.getNoEntityLines = function (pLabel, pFontSize, pChartOptions) {
        return renderlabels_1["default"].splitLabel(pLabel, "entity", this.width, pFontSize, pChartOptions).length;
    };
    Thing.prototype.sizeEntityBoxToLabel = function (pLabel, pBBox) {
        var lLabelWidth = Math.min(svgutensils.getBBox(pLabel).width + (4 * constants_1["default"].LINE_WIDTH), (this.interEntitySpacing / 3) + pBBox.width);
        /* istanbul ignore if */
        if (lLabelWidth >= pBBox.width) {
            pBBox.x -= (lLabelWidth - pBBox.width) / 2;
            pBBox.width = lLabelWidth;
        }
        return pBBox;
    };
    Thing.prototype.renderEntity = function (pEntity, pX, pY, pOptions) {
        var lGroup = index_1["default"].createGroup();
        var lBBox = {
            x: pX || 0,
            y: pY || 0,
            width: this.width,
            height: this.height
        };
        var lLabel = renderlabels_1["default"].createLabel(Object.assign({
            kind: "entity"
        }, pEntity), Object.assign({}, lBBox, { y: lBBox.y + (lBBox.height / 2) }), pOptions);
        lGroup.appendChild(index_1["default"].createRect(this.sizeEntityBoxToLabel(lLabel, lBBox), {
            "class": "entity",
            color: pEntity.linecolor,
            bgColor: pEntity.textbgcolor
        }));
        lGroup.appendChild(lLabel);
        return lGroup;
    };
    Thing.prototype.getMaxEntityHeight = function (pEntities, pOptions) {
        var _this = this;
        var lHighestEntity = pEntities[0];
        var lHWM = 2;
        pEntities.forEach(function (pEntity) {
            var lNoEntityLines = _this.getNoEntityLines(pEntity.label, constants_1["default"].FONT_SIZE, pOptions);
            if (lNoEntityLines > lHWM) {
                lHWM = lNoEntityLines;
                lHighestEntity = pEntity;
            }
        });
        if (lHWM > 2) {
            return Math.max(this.height, svgutensils.getBBox(this.renderEntity(lHighestEntity, 0, 0, pOptions)).height);
        }
        return this.height;
    };
    return Thing;
}());
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
