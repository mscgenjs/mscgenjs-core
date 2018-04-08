var expect = require("chai").expect;
var round = require("../../../render/graphics/svgelementfactory/round");

describe('#round', function() {
    it("rounds to whole numbers when not passed a precision", function() {
        expect(round(3.14)).to.equal(3);
    });

    it("rounds to whole numbers when passed a precision of 0", function() {
        expect(round(3.14, 0)).to.equal(3);
    });

    it("rounds to tenths when passed a precision of 1", function() {
        expect(round(3.14, 1)).to.equal(3.1);
        expect(round(3.15, 1)).to.equal(3.2);
    });
});
