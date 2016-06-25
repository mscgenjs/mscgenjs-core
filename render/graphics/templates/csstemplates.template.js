/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";
    return {
        baseTemplate : "<%= baseTemplateString %>",
        additionalTemplates : [{
            "name":"inverted",
            "css":"svg.<%=fenceClass%>{filter:invert(1);-webkit-filter:invert(1);}"
        }, {
            "name": "grayscaled",
            "css": "/* grayscaled */svg.<%=fenceClass%>{filter:grayscale(1);-webkit-filter:grayscale(1);}"
        }, {
            "name": "lazy",
            "css": "/* lazy */.<%=fenceClass%> text.entity-text{font-weight:bold;text-decoration:none;}.<%=fenceClass%> text.return-text{font-style:italic}.<%=fenceClass%> path.note{fill:#FFFFCC}.<%=fenceClass%> rect.label-text-background{opacity:0.9}.<%=fenceClass%> line.comment,.<%=fenceClass%> rect.inline_expression,.<%=fenceClass%> .inline_expression_divider,.<%=fenceClass%> .inline_expression_label{stroke:grey}"
        }]
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
