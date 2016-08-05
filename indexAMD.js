/**
 * @deprecated - here only for backward compatibility reasons.
 *               Will be removed in version 2.0.0 and higher.
 *               Instead use index.js. It provides the same
 *               functionality with the same interface
 */
define(["./index"], function(index) {
    "use strict";

    return {
        renderMsc    : index.renderMsc,
        translateMsc : index.translateMsc,
        version      : index.version
    };
});
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
