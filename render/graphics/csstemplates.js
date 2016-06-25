/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";
    return {
        baseTemplate : "svg.<%=fenceClass%>{font-family:Helvetica,sans-serif;font-size:<%=fontSize%>px;font-weight:normal;font-style:normal;text-decoration:none;background-color:white;stroke:black;stroke-width:<%=lineWidth%>;color:black;}.<%=fenceClass%> rect{fill:none;stroke:black;}.<%=fenceClass%> rect.entity{fill:white;}.<%=fenceClass%> rect.label-text-background{fill:white;stroke:white;stroke-width:0;}.<%=fenceClass%> rect.bglayer{fill:white;stroke:white;stroke-width:0;}.<%=fenceClass%> line{stroke:black;}.<%=fenceClass%> line.return{stroke-dasharray:5,2;}.<%=fenceClass%> line.comment{stroke-dasharray:5,2;}.<%=fenceClass%> line.inline_expression_divider{stroke-dasharray:10,5;}.<%=fenceClass%> text{color:inherit;stroke:none;text-anchor:middle;}.<%=fenceClass%> text.entity-text{text-decoration:underline;}.<%=fenceClass%> text.anchor-start{text-anchor:start;}.<%=fenceClass%> path{stroke:black;color:black;fill:none;}.<%=fenceClass%> .arrow-marker{overflow:visible;}.<%=fenceClass%> .arrow-style{stroke-width:1;}.<%=fenceClass%> .arcrowomit{stroke-dasharray:2,2;}.<%=fenceClass%> rect.box, .<%=fenceClass%> path.box{fill:white;}.<%=fenceClass%> .inherit{stroke:inherit;color:inherit;}.<%=fenceClass%> .inherit-fill{fill:inherit;}.<%=fenceClass%> .watermark{stroke:black;color:black;fill:black;font-size:48pt;font-weight:bold;opacity:0.14;}",
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

