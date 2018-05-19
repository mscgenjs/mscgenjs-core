var expect  = require("chai").expect;
var flatten = require("../../../render/astmassage/flatten");
var fix     = require("../../astfixtures.json");

describe('render/astmassage/flatten', () => {
    describe('unwind', () => {
        test('should return an "unwound" version of the simple one alt ', () => {
            expect(
                flatten.unwind(fix.astOneAlt)
            ).to.deep.equal(fix.astOneAltUnwound);
        });
        test(
            'should return an "unwound" version of an alt within a loop ',
            () => {
                expect(
                    flatten.unwind(fix.astAltWithinLoop)
                ).to.deep.equal(fix.astAltWithinLoopUnWound);
            }
        );
        test('should keep comments within arc spanning arc bounds', () => {
            expect(
                flatten.unwind(fix.astOptWithComment)
            ).to.deep.equal(fix.astOptWithCommentUnWound);
        });
        test(
            'should distribute the arc* colors to underlying arcs (one level)',
            () => {
                expect(
                    flatten.unwind(fix.astInlineWithArcColor)
                ).to.deep.equal(fix.astInlineWithArcColorUnWound);
            }
        );
        test(
            'should distribute the arc* colors to underlying arcs (one level, but not more)',
            () => {
                expect(
                    flatten.unwind(fix.astNestedInlinesWithArcColor)
                ).to.deep.equal(fix.astNestedInlinesWithArcColorUnWound);
            }
        );
    });

    describe('explodeBroadcasts', () => {
        test('leave asts without broadcasts alone', () => {
            expect(
                flatten.explodeBroadcasts(fix.astAltWithinLoop)
            ).to.deep.equal(fix.astAltWithinLoop);
        });
        test('explode b->* to parallel calls to all other entities', () => {
            expect(
                flatten.explodeBroadcasts(fix.astSimpleBroadcast)
            ).to.deep.equal(fix.astSimpleBroadcastExploded);
        });
        test(
            'explode a little more complex broadcast ast to parallel calls to all other entities',
            () => {
                expect(
                    flatten.explodeBroadcasts(fix.astComplexerBroadcast)
                ).to.deep.equal(fix.astComplexerBroadcastExploded);
            }
        );
        test(
            'correctly explode a broadcast that has other arcs in the same arc row',
            () => {
                expect(
                    flatten.explodeBroadcasts(fix.astSameArcRowBroadcast)
                ).to.deep.equal(fix.astSameArcRowBroadcastExploded);
            }
        );
    });

});
