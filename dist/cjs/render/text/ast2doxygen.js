"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.render = void 0;
var ast2mscgen_1 = require("./ast2mscgen");
var DoxygenAdaptor = /** @class */ (function (_super) {
    __extends(DoxygenAdaptor, _super);
    function DoxygenAdaptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DoxygenAdaptor.prototype.init = function () {
        var INDENT = "  ";
        var EOL = "\n";
        var LINE_PREFIX = " * ";
        _super.prototype.init.call(this, {
            program: {
                opener: "".concat(LINE_PREFIX, "\\msc").concat(EOL),
                closer: "".concat(LINE_PREFIX, "\\endmsc")
            },
            option: {
                opener: LINE_PREFIX + INDENT,
                separator: ",".concat(EOL).concat(LINE_PREFIX).concat(INDENT),
                closer: ";".concat(EOL).concat(LINE_PREFIX).concat(EOL)
            },
            entity: {
                opener: LINE_PREFIX + INDENT,
                separator: ",".concat(EOL).concat(LINE_PREFIX).concat(INDENT),
                closer: ";".concat(EOL).concat(LINE_PREFIX).concat(EOL)
            },
            arcline: {
                opener: LINE_PREFIX + INDENT,
                separator: ",".concat(EOL).concat(LINE_PREFIX).concat(INDENT),
                closer: ";".concat(EOL)
            },
            inline: {
                opener: ";".concat(EOL),
                closer: "".concat(LINE_PREFIX, "#")
            }
        });
    };
    DoxygenAdaptor.prototype.renderComments = function () {
        /* rendering comments within comments, that are eventually output
         * to doxygen html - don't think that's going to be necessary
         * or desired functionality. If it is remember to be able to
         * - have a solution for nested comments (otherwise: interesting results)
         * - have a solution for comments that have an other meaning (# this is
         *    a comment -> doxygen translates this as markdown title)
         * - handling languages different from c/ java/ d that have alternative
         *   comment/ documentation sections
         */
        return "";
    };
    return DoxygenAdaptor;
}(ast2mscgen_1.MscGenAdaptor));
var render = function (pAST) {
    var lAdaptor = new DoxygenAdaptor(false);
    return lAdaptor.render(pAST);
};
exports.render = render;
