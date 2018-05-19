var flatten = require("../../../render/astmassage/flatten");
var fix     = require("../../astfixtures.json");

describe('render/astmassage/flatten', () => {
    describe('unwind', () => {
        test('should return an "unwound" version of the simple one alt ', () => {
            expect(
                flatten.unwind(fix.astOneAlt)
            ).toEqual(fix.astOneAltUnwound);
        });
        test(
            'should return an "unwound" version of an alt within a loop ',
            () => {
                expect(
                    flatten.unwind(fix.astAltWithinLoop)
                ).toEqual(fix.astAltWithinLoopUnWound);
            }
        );
        test('should keep comments within arc spanning arc bounds', () => {
            expect(
                flatten.unwind(fix.astOptWithComment)
            ).toEqual(fix.astOptWithCommentUnWound);
        });
        test(
            'should distribute the arc* colors to underlying arcs (one level)',
            () => {
                expect(
                    flatten.unwind(fix.astInlineWithArcColor)
                ).toEqual(fix.astInlineWithArcColorUnWound);
            }
        );
        test(
            'should distribute the arc* colors to underlying arcs (one level, but not more)',
            () => {
                expect(
                    flatten.unwind(fix.astNestedInlinesWithArcColor)
                ).toEqual(fix.astNestedInlinesWithArcColorUnWound);
            }
        );
    });

    describe('explodeBroadcasts', () => {
        test('leave asts without broadcasts alone', () => {
            expect(
                flatten.explodeBroadcasts(fix.astAltWithinLoop)
            ).toEqual(fix.astAltWithinLoop);
        });
        test('explode b->* to parallel calls to all other entities', () => {
            expect(
                flatten.explodeBroadcasts(fix.astSimpleBroadcast)
            ).toEqual(fix.astSimpleBroadcastExploded);
        });
        test(
            'explode a little more complex broadcast ast to parallel calls to all other entities',
            () => {
                expect(
                    flatten.explodeBroadcasts(fix.astComplexerBroadcast)
                ).toEqual(fix.astComplexerBroadcastExploded);
            }
        );
        test(
            'correctly explode a broadcast that has other arcs in the same arc row',
            () => {
                expect(
                    flatten.explodeBroadcasts(fix.astSameArcRowBroadcast)
                ).toEqual(fix.astSameArcRowBroadcastExploded);
            }
        );
    });

});
