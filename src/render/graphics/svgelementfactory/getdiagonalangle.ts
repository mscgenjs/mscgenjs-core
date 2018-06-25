function rad2deg(pDegrees) {
    return (pDegrees * 360) / (2 * Math.PI);
}

/**
 * returns the angle (in degrees) of the line from the
 * bottom left to the top right of the bounding box.
 *
 * @param {object} pBBox - the bounding box (only width and height used)
 * @returns {number} - the angle in degrees
 */
export default (pBBox) => 0 - rad2deg(Math.atan(pBBox.height / pBBox.width));

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
