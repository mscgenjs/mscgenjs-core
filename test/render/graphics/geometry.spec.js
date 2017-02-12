var geo    = require("../../../render/graphics/svgelementfactory/geometry");
var expect = require("chai").expect;

describe('#geometry', function() {
    describe('#getDiagonalAngle', function () {
        it("returns -45 degrees for a square box", function(){
            expect(geo.getDiagonalAngle({height: 10, width: 10})).to.equal(-45);
        });
        it("returns -90 degrees for a zero width box", function(){
            expect(geo.getDiagonalAngle({height: 10, width: 0})).to.equal(-90);
        });
        it("returns -0 degrees for a zero height box", function(){
            expect(geo.getDiagonalAngle({height: 0, width: 10})).to.equal(0);
        });
        it("returns ~ -36.9 degrees for a 640*480 box", function(){
            expect(geo.getDiagonalAngle({height: 480, width: 640})).to.equal(-36.86989764584402);
        });
    });
});
