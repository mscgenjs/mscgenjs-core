import * as mscgenjsast from "../../parse/mscgenjsast";
import constants from "./constants";
import renderlabels from "./renderlabels";
import * as geotypes from "./svgelementfactory/geotypes";
import svgelementfactory from "./svgelementfactory/index";
import svgutensils from "./svgutensils";

const DEFAULT_INTER_ENTITY_SPACING = 160; // px
const DEFAULT_ENTITY_WIDTH         = 100; // px
const DEFAULT_ENTITY_HEIGHT        = 34; // px

const gEntityDims = Object.seal({
    interEntitySpacing : DEFAULT_INTER_ENTITY_SPACING,
    height             : DEFAULT_ENTITY_HEIGHT,
    width              : DEFAULT_ENTITY_WIDTH,
    entityXHWM         : 0,
});

let gEntity2X = {};

function getX(pName) {
    return gEntity2X[pName];
}

function setX(pEntity, pX) {
    gEntity2X[pEntity.name] = pX + (gEntityDims.width / 2);
}

function getDims() {
    return gEntityDims;
}

function getNoEntityLines(pLabel, pFontSize, pChartOptions: mscgenjsast.IOptionsNormalized) {
    return renderlabels.splitLabel(pLabel, "entity", gEntityDims.width, pFontSize, pChartOptions).length;
}

function sizeEntityBoxToLabel(pLabel, pBBox: geotypes.IBBox) {
    const lLabelWidth = Math.min(
        svgutensils.getBBox(pLabel).width + (4 * constants.LINE_WIDTH),
        (gEntityDims.interEntitySpacing / 3) + pBBox.width,
    );
    /* istanbul ignore if */
    if (lLabelWidth >= pBBox.width) {
        pBBox.x -= (lLabelWidth - pBBox.width) / 2;
        pBBox.width = lLabelWidth;
    }
    return pBBox;
}

function renderEntity(pEntity, pX: number, pY: number, pOptions: mscgenjsast.IOptionsNormalized): SVGGElement {
    const lGroup = svgelementfactory.createGroup();
    const lBBox: geotypes.IBBox = {
        x: pX || 0,
        y: pY || 0,
        width: gEntityDims.width,
        height: gEntityDims.height,
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
            sizeEntityBoxToLabel(lLabel, lBBox),
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

function renderEntities(pEntities: any[], pEntityYPos: number, pOptions: mscgenjsast.IOptionsNormalized) {
    const lEntityGroup = svgelementfactory.createGroup();

    gEntityDims.entityXHWM = 0;
    gEntityDims.height = getMaxEntityHeight(pEntities, pOptions) + constants.LINE_WIDTH * 2;

    pEntities.forEach((pEntity) => {
        lEntityGroup.appendChild(renderEntity(pEntity, gEntityDims.entityXHWM, pEntityYPos, pOptions));
        setX(pEntity, gEntityDims.entityXHWM);
        gEntityDims.entityXHWM += gEntityDims.interEntitySpacing;
    });

    return lEntityGroup;
}

/**
 * getMaxEntityHeight() -
 * crude method for determining the max entity height;
 * - take the entity with the most number of lines
 * - if that number > 2 (default entity hight easily fits 2 lines of text)
 *   - render that entity
 *   - return the height of its bbox
 *
 * @param <object> - pEntities - the entities subtree of the AST
 * @return <int> - height - the height of the heighest entity
 */
function getMaxEntityHeight(pEntities, pOptions) {
    let lHighestEntity = pEntities[0];
    let lHWM = 2;
    pEntities.forEach((pEntity) => {
        const lNoEntityLines = getNoEntityLines(pEntity.label, constants.FONT_SIZE, pOptions);
        if (lNoEntityLines > lHWM) {
            lHWM = lNoEntityLines;
            lHighestEntity = pEntity;
        }
    });

    if (lHWM > 2) {
        return Math.max(
            gEntityDims.height,
            svgutensils.getBBox(
                renderEntity(lHighestEntity, 0, 0, pOptions),
            ).height,
        );
    }
    return gEntityDims.height;
}

export default {
    init(pHScale) {
        gEntityDims.interEntitySpacing = DEFAULT_INTER_ENTITY_SPACING;
        gEntityDims.height             = DEFAULT_ENTITY_HEIGHT;
        gEntityDims.width              = DEFAULT_ENTITY_WIDTH;
        gEntityDims.entityXHWM         = 0;

        if (pHScale) {
            gEntityDims.interEntitySpacing = pHScale * DEFAULT_INTER_ENTITY_SPACING;
            gEntityDims.width              = pHScale * DEFAULT_ENTITY_WIDTH;
        }
        gEntity2X = {};
    },
    getX,
    getOAndD(pFrom, pTo) {
        return {
            from: getX(pFrom) < getX(pTo) ? getX(pFrom) : getX(pTo),
            to: getX(pTo) > getX(pFrom) ? getX(pTo) : getX(pFrom),
        };
    },
    getDims,
    renderEntities,
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
