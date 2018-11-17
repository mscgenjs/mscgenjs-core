import _cloneDeep from "lodash.clonedeep";
export function scaleCanvasToWidth(pWidth, pCanvas) {
    const lCanvas = _cloneDeep(pCanvas);
    lCanvas.scale = (pWidth / lCanvas.width);
    lCanvas.width *= lCanvas.scale;
    lCanvas.height *= lCanvas.scale;
    lCanvas.horizontaltransform *= lCanvas.scale;
    lCanvas.verticaltransform *= lCanvas.scale;
    lCanvas.x = 0 - lCanvas.horizontaltransform;
    lCanvas.y = 0 - lCanvas.verticaltransform;
    return lCanvas;
}
export function determineDepthCorrection(pDepth, pLineWidth) {
    return pDepth ? 2 * ((pDepth + 1) * 2 * pLineWidth) : 0;
}
export function determineArcXTo(pKind, pFrom, pTo) {
    if ("-x" === pKind) {
        return pFrom + (pTo - pFrom) * (3 / 4);
    }
    else {
        return pTo;
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
