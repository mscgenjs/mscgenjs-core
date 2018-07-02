const variationhelpers = require("../../../src/render/graphics/svgelementfactory/variationhelpers").default;

describe("#geometry", () => {

    describe("#getDirection", () => {
        test("returns -1,1,1 for (10,0),(0,10)", () => {
            expect(
                variationhelpers.getDirection(
                    {xFrom: 10, yFrom: 0, xTo: 0, yTo: 10},
                ),
            ).toEqual(
                {
                    signX: -1,
                    signY: 1,
                    dy: 1,
                },
            );
        });
        test("returns -1,1,-Infinity for (0,0),(0,10)", () => {
            expect(
                variationhelpers.getDirection(
                    {xFrom: 0, yFrom: 0, xTo: 0, yTo: 10},
                ),
            ).toEqual(
                {
                    signX: -1,
                    signY: 1,
                    dy: -Infinity,
                },
            );
        });
        test("returns -1,1,0 for (0,0),(10,0)", () => {
            expect(
                variationhelpers.getDirection(
                    {xFrom: 0, yFrom: 0, xTo: 10, yTo: 0},
                ),
            ).toEqual(
                {
                    signX: 1,
                    signY: -1,
                    dy: 0,
                },
            );
        });
    });
});
