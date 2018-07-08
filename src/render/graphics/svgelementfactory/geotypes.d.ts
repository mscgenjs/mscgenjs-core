/**
 * Bounding box
 */
export interface IBBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IDimension {
    width: number;
    height: number;
}
/**
 * 
 */
export interface ILine {
    xFrom: number;
    yFrom: number;
    xTo: number;
    yTo: number;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface ICurveSection {
    controlX: number;
    controlY: number;
    x: number;
    y: number;
}

export interface IDirection {
    signX: number;
    signY: number;
    dy: number;
}

