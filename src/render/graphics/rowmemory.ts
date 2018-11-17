/**
 * Functions to help determine the correct height and
 * y position of rows befor rendering them.
 */
let gRowInfoArray: IRowMemorySlot[] = [];
let gDefaultEntityHeight = 0;
let gDefaultArcRowHeight = 0;

export interface IRowMemorySlot {
    y: number;
    height: number;
    realRowNumber: number;
}

/**
 * get() - returns the row info for a given pRowNumber.
 * If the row info was not set earlier with a setRowinfo call
 * the function returns a best guess, based on defaults
 *
 * @param <int> pRowNumber
 */
export function get(pRowNumber: number): IRowMemorySlot {
    if (gRowInfoArray[pRowNumber]) {
        return gRowInfoArray[pRowNumber];
    } else {
        return {
            y : (gDefaultEntityHeight + (1.5 * gDefaultArcRowHeight)) + pRowNumber * gDefaultArcRowHeight,
            height : gDefaultArcRowHeight,
            realRowNumber: gRowInfoArray.length - 1,
        };
    }
}

export function getLast(): IRowMemorySlot {
    return get(gRowInfoArray.length - 1);
}

/**
 * clear() - resets the helper array to an empty one
 */
export function clear(pEntityHeight: number, pArcRowHeight: number): void {
    gRowInfoArray = [];
    gDefaultEntityHeight = pEntityHeight;
    gDefaultArcRowHeight = pArcRowHeight;
}

/**
 *  the row info for a given pRealRowNumber.
 *
 * If the function couldn't find the real row number it'll
 * return the virtual instead.
 *
 * @param <int> pRealRowNumber
 */
export function getByRealRowNumber(pRealRowNumber): IRowMemorySlot {
    let lRetval = gRowInfoArray.find((pRowInfo) => pRowInfo.realRowNumber === pRealRowNumber);

    if (typeof lRetval === "undefined") {
        // most likely asking for something below the bottom of the chart => return the bottom
        lRetval = getLast();
    }
    return lRetval;
}

/**
 * set() - stores the pHeight for the given pRowNumber, and sets
 *         the y coordinate of the row
 *
 * @param <int> pRowNumber
 * @param <int> pHeight
 */
export function set(pRowNumber: number, pHeight: number, pRealRowNumber: number = -1): void {
    const lPreviousRowInfo = get(pRowNumber - 1);

    gRowInfoArray[pRowNumber] = {
        y : lPreviousRowInfo.y + (lPreviousRowInfo.height + pHeight) / 2,
        height : pHeight,
        realRowNumber : pRealRowNumber,
    };
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
