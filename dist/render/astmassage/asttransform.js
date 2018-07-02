"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function transformEntities(pEntities, pFunctionAry) {
    if (pEntities && pFunctionAry) {
        pEntities.forEach((pEntity) => {
            pFunctionAry.forEach((pFunction) => {
                pFunction(pEntity);
            });
        });
    }
}
function transformArc(pEntities, pArcRow, pArc, pFunctionAry) {
    if (pFunctionAry) {
        pFunctionAry.forEach((pFunction) => {
            pFunction(pArc, pEntities, pArcRow);
        });
    }
}
function transformArcRow(pEntities, pArcRow, pFunctionAry) {
    pArcRow.forEach((pArc) => {
        transformArc(pEntities, pArcRow, pArc, pFunctionAry);
        if (pArc.arcs) {
            transformArcRows(pEntities, pArc.arcs, pFunctionAry);
        }
    });
}
function transformArcRows(pEntities, pArcRows, pFunctionAry) {
    if (pArcRows && pFunctionAry) {
        pArcRows.forEach((pArcRow) => {
            transformArcRow(pEntities, pArcRow, pFunctionAry);
        });
    }
}
/**
 * Generic function for performing manipulations on abstract syntax trees. It takes a
 * series of functions as arguments and applies them to the entities and arc
 * rows in the syntax tree respectively.
 *
 * @param {ast} pAST - the syntax tree to transform
 * @param {Array} pEntityTransforms - an array of functions. Each function shall take
 * an entity as input an return the modified entity
 * @param {Array} pArcRowTransforms - an array of functions. Each function shall take
 * an arc row and entities as input return the modified arc row
 * @return {ast} - the modified syntax tree
 */
exports.default = (pAST, pEntityTransforms, pArcRowTransforms) => {
    transformEntities(pAST.entities, pEntityTransforms);
    if (pAST.arcs) {
        transformArcRows(pAST.entities, pAST.arcs, pArcRowTransforms);
    }
    return pAST;
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
