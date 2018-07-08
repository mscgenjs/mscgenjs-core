const fs       = require("fs");
const path     = require("path");
const renderer = require("../../../src/render/text/ast2xu").default;
const fix      = require("../../astfixtures.json");

describe(`render/text/ast2xu`, () => {
    describe(`#renderAST() - simple syntax tree`, () => {
        test(`should, given a simple syntax tree, render a mscgen script`, () => {
            expect(renderer.render(fix.astSimple)).toMatchSnapshot();
        });

        test(`should, given a simple syntax tree, render a mscgen script`, () => {
            expect(renderer.render(fix.astSimple, false)).toMatchSnapshot();
        });

        test(
            `should, given a simple syntax tree, render a "minified" mscgen script`,
            () => {
                expect(renderer.render(fix.astSimple, true)).toMatchSnapshot();
            }
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

    describe(`#renderAST() - minification`, () => {
        test(`should render a "minified" mscgen script`, () => {
            expect(renderer.render(fix.astOptions, true)).toMatchSnapshot();
        });

        test(`should render a "minified" mscgen script`, () => {
            expect(renderer.render(fix.astBoxes, true)).toMatchSnapshot();
        });
    });

    describe(`#renderAST() - xu compatible`, () => {
        test(`alt only - render correct script`, () => {
            expect(renderer.render(fix.astOneAlt)).toMatchSnapshot();
        });
        test(`alt within loop - render correct script`, () => {
            expect(renderer.render(fix.astAltWithinLoop)).toMatchSnapshot();
        });
        test("should correctly render empty inline expressions", () => {
            const lFixture = {
                "meta": {
                    "extendedOptions": false,
                    "extendedArcTypes": true,
                    "extendedFeatures": true
                },
                "entities": [
                    {
                        "name": "a"
                    },
                    {
                        "name": "b"
                    }
                ],
                "arcs": [
                    [
                        {
                            "kind": "opt",
                            "from": "a",
                            "to": "b",
                            "arcs": null
                        }
                    ]
                ]
            };
            expect(renderer.render(lFixture)).toMatchSnapshot();
        });
        test("Puts entities with mscgen keyword for a name in quotes", () => {
            expect(renderer.render(fix.entityWithMscGenKeywordAsName, true)).toMatchSnapshot();
        });
        test("Re-renders title attributes", () => {
            expect(renderer.render(fix.astTitleOnArc, true)).toMatchSnapshot();
        });
    });

    describe(`#renderAST() - file based tests`, () => {
        test(`should render all arcs`, () => {

            const lASTString = fs.readFileSync(path.join(__dirname, "../../fixtures/test01_all_possible_arcs.json"), {
                "encoding" : "utf8"
            });
            const lAST = JSON.parse(lASTString);
            expect(renderer.render(lAST)).toMatchSnapshot();
        });
    });

});
