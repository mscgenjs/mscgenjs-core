const getDiagonalAngle = require("../../../src/render/graphics/svgelementfactory/getdiagonalangle").default;

describe('#geometry', () => {
    describe('#getDiagonalAngle', () => {
        test("returns -45 degrees for a square box", () => {
            expect(getDiagonalAngle({height: 10, width: 10})).toBe(-45);
        });
        test("returns -90 degrees for a zero width box", () => {
            expect(getDiagonalAngle({height: 10, width: 0})).toBe(-90);
        });
        test("returns -0 degrees for a zero height box", () => {
            expect(getDiagonalAngle({height: 0, width: 10})).toBe(0);
        });
        test("returns ~ -36.9 degrees for a 640*480 box", () => {
            expect(getDiagonalAngle({height: 480, width: 640})).toBe(-36.86989764584402);
        });
    });
});
