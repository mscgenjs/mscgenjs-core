import * as mscgenjsast from "../../parse/mscgenjsast";
import constants from "./constants";
import renderlabels from "./renderlabels";
import * as geotypes from "./svgelementfactory/geotypes";
import svgelementfactory from "./svgelementfactory/index";
import svgutensils from "./svgutensils";

export interface IOandD {
    from: number;
    to: number;
}

const DEFAULT_INTER_ENTITY_SPACING = 160; // px
const DEFAULT_ENTITY_WIDTH         = 100; // px
const DEFAULT_ENTITY_HEIGHT        = 34; // px

export class Thing {
    private interEntitySpacing = DEFAULT_INTER_ENTITY_SPACING;
    private height             = DEFAULT_ENTITY_HEIGHT;
    private width              = DEFAULT_ENTITY_WIDTH;
    private entityXHWM         = 0;
    private entity2x = {};

    constructor(pHScale) {
        if (pHScale) {
            this.interEntitySpacing = pHScale * DEFAULT_INTER_ENTITY_SPACING;
            this.width              = pHScale * DEFAULT_ENTITY_WIDTH;
        }
    }

    public getX(pName) {
        return this.entity2x[pName];
    }

    public getDims() {
        return ({
            interEntitySpacing: this.interEntitySpacing,
            height: this.height,
            width: this.width,
            entityXHWM: this.entityXHWM
        });
    }

    public getOAndD(pFrom, pTo): IOandD {
        return {
            from: this.getX(pFrom) < this.getX(pTo) ? this.getX(pFrom) : this.getX(pTo),
            to: this.getX(pTo) > this.getX(pFrom) ? this.getX(pTo) : this.getX(pFrom),
        };
    }

    public renderEntities(pEntities: any[], pEntityYPos: number, pOptions: mscgenjsast.IOptionsNormalized) {
        const lEntityGroup = svgelementfactory.createGroup();

        this.entityXHWM = 0;
        this.height = this.getMaxEntityHeight(pEntities, pOptions) + constants.LINE_WIDTH * 2;

        pEntities.forEach((pEntity) => {
            lEntityGroup.appendChild(this.renderEntity(pEntity, this.entityXHWM, pEntityYPos, pOptions));
            this.setX(pEntity, this.entityXHWM);
            this.entityXHWM += this.interEntitySpacing;
        });

        return lEntityGroup;
    }

    private setX(pEntity, pX) {
        this.entity2x[pEntity.name] = pX + (this.width / 2);
    }

    private getNoEntityLines(pLabel, pFontSize, pChartOptions: mscgenjsast.IOptionsNormalized) {
        return renderlabels.splitLabel(pLabel, "entity", this.width, pFontSize, pChartOptions).length;
    }

    private sizeEntityBoxToLabel(pLabel, pBBox: geotypes.IBBox) {
        const lLabelWidth = Math.min(
            svgutensils.getBBox(pLabel).width + (4 * constants.LINE_WIDTH),
            (this.interEntitySpacing / 3) + pBBox.width,
        );
        /* istanbul ignore if */
        if (lLabelWidth >= pBBox.width) {
            pBBox.x -= (lLabelWidth - pBBox.width) / 2;
            pBBox.width = lLabelWidth;
        }
        return pBBox;
    }

    private renderEntity(pEntity, pX: number, pY: number, pOptions: mscgenjsast.IOptionsNormalized): SVGGElement {
        const lGroup = svgelementfactory.createGroup();
        const lBBox: geotypes.IBBox = {
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
            Object.assign ({}, lBBox, {y: lBBox.y + (lBBox.height / 2)},
            ),
            pOptions,
        );

        lGroup.appendChild(
            svgelementfactory.createRect(
                this.sizeEntityBoxToLabel(lLabel, lBBox),
                {
                    class: "entity",
                    color: pEntity.linecolor,
                    bgColor: pEntity.textbgcolor,
                },

            ),
        );
        lGroup.appendChild(lLabel);
        return lGroup;
    }

    private getMaxEntityHeight(pEntities, pOptions) {
        let lHighestEntity = pEntities[0];
        let lHWM = 2;
        pEntities.forEach((pEntity) => {
            const lNoEntityLines = this.getNoEntityLines(pEntity.label, constants.FONT_SIZE, pOptions);
            if (lNoEntityLines > lHWM) {
                lHWM = lNoEntityLines;
                lHighestEntity = pEntity;
            }
        });

        if (lHWM > 2) {
            return Math.max(
                this.height,
                svgutensils.getBBox(
                    this.renderEntity(lHighestEntity, 0, 0, pOptions),
                ).height,
            );
        }
        return this.height;
    }
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
