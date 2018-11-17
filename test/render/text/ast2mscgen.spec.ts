const fs       = require("fs");
const path     = require("path");
import * as renderer from "../../../src/render/text/ast2mscgen";
const fix      = require("../../astfixtures.json");

describe("render/text/ast2mscgen", () => {
    describe("#renderAST() - simple syntax tree", () => {
        test("should, given a simple syntax tree, render a mscgen script", () => {
            expect(renderer.render(fix.astSimple)).toMatchSnapshot();
        });

        test("should, given a simple syntax tree, render a mscgen script", () => {
            expect(renderer.render(fix.astSimple, false)).toMatchSnapshot();
        });

        test(
            'should, given a simple syntax tree, render a "minified" mscgen script',
            () => {
                expect(renderer.render(fix.astSimple, true)).toMatchSnapshot();
            },
        );

        test("should preserve the comments at the start of the ast", () => {
            expect(renderer.render(fix.astWithPreComment)).toMatchSnapshot();
        });

        test("should preserve attributes", () => {
            expect(renderer.render(fix.astAttributes)).toMatchSnapshot();
        });

        test("correctly renders multiple options", () => {
            expect(renderer.render(fix.astOptionsMscgen)).toMatchSnapshot();
        });

        test("correctly renders parallel calls", () => {
            expect(renderer.render(fix.astSimpleParallel)).toMatchSnapshot();
        });
    });

    describe("#renderAST() - minification", () => {
        test('should render a "minified" mscgen script', () => {
            expect(renderer.render(fix.astOptions, true)).toMatchSnapshot();
        });

        test('should render a "minified" mscgen script', () => {
            expect(renderer.render(fix.astBoxes, true)).toMatchSnapshot();
        });
    });

    describe("#renderAST() - xu compatible", () => {
        test("alt only - render correct script", () => {
            expect(renderer.render(fix.astOneAlt)).toMatchSnapshot();
        });
        test(
            "When presented with an unsupported option, renders the script by simply omitting it",
            () => {
                expect(renderer.render(fix.astWithAWatermark)).toMatchSnapshot();
            },
        );
        test("Does not render width when that equals 'auto'", () => {
            expect(renderer.render(fix.auto, true)).toMatchSnapshot();
        });
        test("Puts entities with mscgen keyword for a name in quotes", () => {
            expect(renderer.render(fix.entityWithMscGenKeywordAsName, true)).toMatchSnapshot();
        });
    });
    describe("#renderAST() - file based tests", () => {
        test("should render all arcs", () => {
            const lASTString = fs.readFileSync(
                path.join(__dirname, "../../fixtures/test01_all_possible_arcs_mscgen.json"),
                {encoding: "utf8"},
            );
            const lAST = JSON.parse(lASTString);
            expect(renderer.render(lAST)).toMatchSnapshot();
        });
    });
});
