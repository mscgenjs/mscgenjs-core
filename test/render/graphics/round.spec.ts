const round = require("../../../src/render/graphics/svgelementfactory/round").default;

describe("#round", () => {
    test("rounds to whole numbers when not passed a precision", () => {
        expect(round(3.14)).toBe(3);
    });

    test("rounds to whole numbers when passed a precision of 0", () => {
        expect(round(3.14, 0)).toBe(3);
    });

    test("rounds to tenths when passed a precision of 1", () => {
        expect(round(3.14, 1)).toBe(3.1);
        expect(round(3.15, 1)).toBe(3.2);
    });
});
