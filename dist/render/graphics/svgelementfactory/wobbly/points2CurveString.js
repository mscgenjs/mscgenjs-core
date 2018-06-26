"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svgprimitives_1 = require("../svgprimitives");
const variationhelpers_1 = require("../variationhelpers");
const index_1 = require("./index");
function points2CurveString(pCurveSections) {
    return pCurveSections.map((pCurveSection) => `${svgprimitives_1.default.pathPoint2String("S", pCurveSection.controlX, pCurveSection.controlY)} ` +
        `${svgprimitives_1.default.point2String(pCurveSection)}`).join(" ");
}
exports.points2CurveString = points2CurveString;
function line2CurveString(pLine) {
    return points2CurveString(variationhelpers_1.default.getBetweenPoints(pLine, index_1.SEGMENT_LENGTH, index_1.WOBBLE_FACTOR));
}
exports.line2CurveString = line2CurveString;
