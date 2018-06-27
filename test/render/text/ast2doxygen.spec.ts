/* eslint max-len:0 */
const renderer = require("../../../src/render/text/ast2doxygen").default;
const fix      = require("../../astfixtures.json");

describe('render/text/ast2doxygen', () => {
    describe('#renderAST() - simple syntax tree', () => {
        test('should, given a simple syntax tree, render a mscgen script', () => {
            expect(renderer.render(fix.astSimple)).toMatchSnapshot();
        });

        test("should preserve the comments at the start of the ast", () => {
            expect(renderer.render(fix.astWithPreComment)).toMatchSnapshot();
        });

        test("should preserve attributes", () => {
            expect(renderer.render(fix.astAttributes)).toMatchSnapshot();
        });
    });

    describe('#renderAST() - xu compatible', () => {
        test('alt only - render correct script', () => {
            expect(renderer.render(fix.astOneAlt)).toMatchSnapshot();
        });
        test('alt within loop - render correct script', () => {
            expect(renderer.render(fix.astAltWithinLoop)).toMatchSnapshot();
        });
        test(
            'When presented with an unsupported option, renders the script by simply omitting it',
            () => {
                expect(renderer.render(fix.astWithAWatermark)).toMatchSnapshot();
            }
        );
        test("Does not render width when that equals 'auto'", () => {
            expect(renderer.render(fix.auto, true)).toMatchSnapshot();
        });
        test("Render width when that is a number", () => {
            expect(renderer.render(fix.fixedwidth, true)).toMatchSnapshot();
        });
        test("Puts entities with mscgen keyword for a name in quotes", () => {
            expect(renderer.render(fix.entityWithMscGenKeywordAsName, true)).toMatchSnapshot();
        });
    });
});
