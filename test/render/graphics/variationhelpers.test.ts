import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";

const variationhelpers = require("../../../src/render/graphics/svgelementfactory/variationhelpers");

describe("#geometry", () => {

    describe("#getDirection", () => {
        it("returns -1,1,1 for (10,0),(0,10)", () => {
            deepEqual(
                variationhelpers.getDirection(
                    {xFrom: 10, yFrom: 0, xTo: 0, yTo: 10},
                ),
            
                {
                    signX: -1,
                    signY: 1,
                    dy: 1,
                },
            );
        });
        it("returns -1,1,-Infinity for (0,0),(0,10)", () => {
            deepEqual(
                variationhelpers.getDirection(
                    {xFrom: 0, yFrom: 0, xTo: 0, yTo: 10},
                ),
            
                {
                    signX: -1,
                    signY: 1,
                    dy: -Infinity,
                },
            );
        });
        it("returns -1,1,0 for (0,0),(10,0)", () => {
            deepEqual(
                variationhelpers.getDirection(
                    {xFrom: 0, yFrom: 0, xTo: 10, yTo: 0},
                ),
            
                {
                    signX: 1,
                    signY: -1,
                    dy: 0,
                },
            );
        });
    });
});
