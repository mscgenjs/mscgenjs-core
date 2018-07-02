import { IArc, IEntity, ISequenceChart } from "../../parse/mscgenjsast";

type EntityTransformFunctionType = (pEntity: IEntity) => void;
type ArcTransformFunctionType    = (pArc: IArc, pEntities?: IEntity[], pArcRow?: IArc[]) => void;

function transformEntities(pEntities: IEntity[], pFunctionAry: EntityTransformFunctionType[]) {
    if (pEntities && pFunctionAry) {
        pEntities.forEach((pEntity) => {
            pFunctionAry.forEach((pFunction) => {
                pFunction(pEntity);
            });
        });
    }
}

function transformArc(pEntities: IEntity[], pArcRow: IArc[], pArc: IArc, pFunctionAry: ArcTransformFunctionType[]) {
    if (pFunctionAry) {
        pFunctionAry.forEach((pFunction) => {
            pFunction(pArc, pEntities, pArcRow);
        });
    }
}

function transformArcRow(pEntities: IEntity[], pArcRow: IArc[], pFunctionAry: ArcTransformFunctionType[]) {
    pArcRow.forEach((pArc) => {
        transformArc(pEntities, pArcRow, pArc, pFunctionAry);
        if (pArc.arcs) {
            transformArcRows(pEntities, pArc.arcs, pFunctionAry);
        }
    });
}

function transformArcRows(pEntities: IEntity[], pArcRows: IArc[][], pFunctionAry: ArcTransformFunctionType[]) {
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
export default (
    pAST: ISequenceChart,
    pEntityTransforms: EntityTransformFunctionType[],
    pArcRowTransforms: ArcTransformFunctionType[],
) => {
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
