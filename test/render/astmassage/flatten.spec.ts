import flatten from "../../../src/render/astmassage/flatten";
const fix     = require("../../astfixtures.json");

describe("render/astmassage/flatten", () => {
    describe("unwind", () => {
        test('should return an "unwound" version of the simple one alt ', () => {
            expect(
                flatten.unwind(fix.astOneAlt),
            ).toEqual(fix.astOneAltUnwound);
        });
        test(
            'should return an "unwound" version of an alt within a loop ',
            () => {
                expect(
                    flatten.unwind(fix.astAltWithinLoop),
                ).toEqual(fix.astAltWithinLoopUnWound);
            },
        );
        test("should keep comments within arc spanning arc bounds", () => {
            expect(
                flatten.unwind(fix.astOptWithComment),
            ).toEqual(fix.astOptWithCommentUnWound);
        });
        test(
            "should distribute the arc* colors to underlying arcs (one level)",
            () => {
                expect(
                    flatten.unwind(fix.astInlineWithArcColor),
                ).toEqual(fix.astInlineWithArcColorUnWound);
            },
        );
        test(
            "should distribute the arc* colors to underlying arcs (one level, but not more)",
            () => {
                expect(
                    flatten.unwind(fix.astNestedInlinesWithArcColor),
                ).toEqual(fix.astNestedInlinesWithArcColorUnWound);
            },
        );
    });
});
