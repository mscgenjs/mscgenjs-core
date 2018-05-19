var expect = require("chai").expect;
var geo    = require("../../../render/graphics/svgelementfactory/geometry");

describe('#geometry', () => {
    describe('#getDiagonalAngle', () => {
        test("returns -45 degrees for a square box", () => {
            expect(geo.getDiagonalAngle({height: 10, width: 10})).to.equal(-45);
        });
        test("returns -90 degrees for a zero width box", () => {
            expect(geo.getDiagonalAngle({height: 10, width: 0})).to.equal(-90);
        });
        test("returns -0 degrees for a zero height box", () => {
            expect(geo.getDiagonalAngle({height: 0, width: 10})).to.equal(0);
        });
        test("returns ~ -36.9 degrees for a 640*480 box", () => {
            expect(geo.getDiagonalAngle({height: 480, width: 640})).to.equal(-36.86989764584402);
        });
    });
});
