import flatten from "../../../src/render/astmassage/flatten";
const fix     = require("../../astfixtures.json");

describe("render/astmassage/flatten", () => {
    describe("normalize", () => {
        test('should return an "unwound" version of the simple one alt ', () => {
            expect(
                flatten.normalize(fix.astOneAlt),
            ).toEqual(fix.astOneAltUnwound);
        });
        test(
            'should return an "unwound" version of an alt within a loop ',
            () => {
                expect(
                    flatten.normalize(fix.astAltWithinLoop),
                ).toEqual(fix.astAltWithinLoopUnWound);
            },
        );
        test("should keep comments within arc spanning arc bounds", () => {
            expect(
                flatten.normalize(fix.astOptWithComment),
            ).toEqual(fix.astOptWithCommentUnWound);
        });
        test(
            "should distribute the arc* colors to underlying arcs (one level)",
            () => {
                expect(
                    flatten.normalize(fix.astInlineWithArcColor),
                ).toEqual(fix.astInlineWithArcColorUnWound);
            },
        );
        test(
            "should distribute the arc* colors to underlying arcs (one level, but not more)",
            () => {
                expect(
                    flatten.normalize(fix.astNestedInlinesWithArcColor),
                ).toEqual(fix.astNestedInlinesWithArcColorUnWound);
            },
        );
    });
});
