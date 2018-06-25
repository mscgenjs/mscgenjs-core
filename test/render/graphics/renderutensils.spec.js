const renderutensils = require("../../../dist/render/graphics/renderutensils").default;

describe('#renderutensils.determineDepthCorrection', () => {
    test("returns 0 (no depth correction) if presented with no params", () => {
        expect(renderutensils.determineDepthCorrection()).toBe(0);
    });
});
