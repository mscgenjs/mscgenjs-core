const path     = require("path");
const JSDOM    = require("jsdom").JSDOM;
const renderer = require("../../../src/render/graphics/renderast").default;
const tst      = require("../../testutensils");

function ast2svg(pASTString, lWindow, pOptions, pRenderOptions) {
    const lAST = JSON.parse(pASTString);

    renderer.clean("__svg", lWindow);
    if (Boolean(pOptions.useNew)) {
        renderer.render(lAST, lWindow, "__svg", pRenderOptions);
    } else if (Boolean(pOptions.includeSource)) {
        renderer.render(lAST, lWindow, "__svg", {source: pASTString});
    } else {
        renderer.render(lAST, lWindow, "__svg", {source: null});
    }

    if (Boolean(pOptions.useOwnElement)) {
        return lWindow.__svg.innerHTML;
    } else {
        return lWindow.document.body.innerHTML;
    }
}

describe("render/graphics/renderast", () => {
    describe("#renderAST in body", () => {
        const lWindow = new JSDOM("<html><body></body></html>").window;

        function processAndCompare(pExpectedFile, pInputFile, pOptions, pRenderOptions) {
            tst.assertequalProcessingXML(pExpectedFile, pInputFile, (pInput) => ast2svg(pInput, lWindow, pOptions, pRenderOptions));
        }
        test("should be ok with an empty AST", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/astempty.svg"),
                path.join(__dirname, "../../fixtures/astempty.json"), {includeSource: true});
        });
        test("should given given a simple syntax tree, render an svg", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/astsimple.svg"),
                path.join(__dirname, "../../fixtures/astsimple.json"), {includeSource: true});
        });
        test(
            "should given given a simple syntax tree, render an svg - with source omitted from svg",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/astsimplenosource.svg"),
                    path.join(__dirname, "../../fixtures/astsimple.json"), false);
            },
        );
        test("should not omit empty lines", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/astemptylinesinboxes.svg"),
                path.join(__dirname, "../../fixtures/astemptylinesinboxes.json"), {includeSource: true});
        });
        test("should render colors", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/rainbow.svg"),
                path.join(__dirname, "../../fixtures/rainbow.json"), {includeSource: true});
        });
        test("should render ids & urls", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/idsnurls.svg"),
                path.join(__dirname, "../../fixtures/idsnurls.json"), {includeSource: true});
        });
        test("should wrap text in boxes well", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/test19_multiline_lipsum.svg"),
                path.join(__dirname, "../../fixtures/test19_multiline_lipsum.json"), {includeSource: true});
        });
        test("should render empty inline expressions correctly", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/test20_empty_inline_expression.svg"),
                path.join(__dirname, "../../fixtures/test20_empty_inline_expression.json"), {includeSource: true});
        });
        test('should render "alt" lines in inline expressions correctly', () => {
            processAndCompare(path.join(__dirname, "../../fixtures/test21_inline_expression_alt_lines.svg"),
                path.join(__dirname, "../../fixtures/test21_inline_expression_alt_lines.json"), {includeSource: true});
        });
        test("should render all possible arcs", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/test01_all_possible_arcs.svg"),
                path.join(__dirname, "../../fixtures/test01_all_possible_arcs.json"), {includeSource: true});
        });
        test("should render with a viewBox instead of a width & height", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/astautoscale.svg"),
                path.join(__dirname, "../../fixtures/astautoscale.json"), {includeSource: true});
        });
        test(
            'should not render "mirrored entities" when not specified (inline expression last)',
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/mirrorentities-off-inline-last.svg"),
                    path.join(__dirname, "../../fixtures/mirrorentities-off-inline-last.json"),
                    {includeSource: false, useNew: true});
            },
        );
        test(
            'should render "mirrored entities" when specified (inline expression last)',
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/mirrorentities-on-inline-last.svg"),
                    path.join(__dirname, "../../fixtures/mirrorentities-on-inline-last.json"),
                    {includeSource: false, useNew: true},
                    {mirrorEntitiesOnBottom: true});
            },
        );
        test(
            'should not render "mirrored entities" when not specified (regular arc last)',
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/mirrorentities-off-regular-arc-last.svg"),
                    path.join(__dirname, "../../fixtures/mirrorentities-off-regular-arc-last.json"),
                    {includeSource: false, useNew: true},
                    {mirrorEntitiesOnBottom: false});
            },
        );
        test(
            'should render "mirrored entities" when  specified (regular arc last)',
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/mirrorentities-on-regular-arc-last.svg"),
                    path.join(__dirname, "../../fixtures/mirrorentities-on-regular-arc-last.json"),
                    {includeSource: false, useNew: true},
                    {mirrorEntitiesOnBottom: true});
            },
        );
        test(
            "when style additions specified, they are included in the resulting svg",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/mirrorentities-on-regular-arc-last-with-style-additions.svg"),
                    path.join(__dirname, "../../fixtures/mirrorentities-on-regular-arc-last.json"),
                    {includeSource: false, useNew: true},
                    {styleAdditions: ".an-added-class {}"});
            },
        );
        test(
            "when an existing style additions template is specified, that is included in the svg",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/mirrorentities-on-regular-arc-last-with-named-style-addition.svg"),
                    path.join(__dirname, "../../fixtures/mirrorentities-on-regular-arc-last.json"),
                    {includeSource: false, useNew: true},
                    {additionalTemplate: "inverted"});
            },
        );
        test(
            "when an non-existing style additions template is specified, the svg styles are untouched",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/mirrorentities-off-regular-arc-last.svg"),
                    path.join(__dirname, "../../fixtures/mirrorentities-on-regular-arc-last.json"),
                    {includeSource: false, useNew: true},
                    {additionalTemplate: "not an existing template"});
            },
        );
        test(
            "On arcs, self referencing arcs, broadcast arcs and boxes titles get rendered in a <title> element",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/titletags.svg"),
                    path.join(__dirname, "../../fixtures/titletags.json"),
                    {includeSource: false, useNew: true},
                );
            },
        );
    });

    describe("#renderAST in own element", () => {
        const lWindow = new JSDOM("<html><body><span id='__svg'></span></body></html>").window;

        function processAndCompare(pExpectedFile, pInputFile, pIncludeSource, pUseOwnElement) {
            tst.assertequalProcessingXML(pExpectedFile, pInputFile, (pInput) => ast2svg(
                pInput,
                lWindow,
                {
                    includeSource: pIncludeSource,
                    useOwnElement: pUseOwnElement,
                },
            ));
        }
        test("should be ok with an empty AST", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/astempty.svg"),
                path.join(__dirname, "../../fixtures/astempty.json"), true, true);
        });
        test("should given a simple syntax tree, render an svg", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/astsimple.svg"),
                path.join(__dirname, "../../fixtures/astsimple.json"), true, true);
        });
        test(
            "should not bump boxes into inline expressions they're running in parallel with",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/bumpingboxes.svg"),
                    path.join(__dirname, "../../fixtures/bumpingboxes.json"), true, true);
            },
        );
        test(
            "should render stuff running in parallel with inline expressions",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/inline-expressions-and-parallel-stuff.svg"),
                    path.join(__dirname, "../../fixtures/inline-expressions-and-parallel-stuff.json"), true, true);
            },
        );
        test(
            "should wrap entity text when wordwrapentities is unspecified",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/wordwrapentitiesunspecified.svg"),
                    path.join(__dirname, "../../fixtures/wordwrapentitiesunspecified.json"), true, true);
            },
        );
        test(
            "when wordwrapentities === false should only wrap at explicit line ends",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/wordwrapentitiesfalse.svg"),
                    path.join(__dirname, "../../fixtures/wordwrapentitiesfalse.json"), true, true);
            },
        );
        test("when wordwrapboxes === true should wrap things in boxes", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/wordwrapboxestrue.svg"),
                path.join(__dirname, "../../fixtures/wordwrapboxestrue.json"), true, true);
        });
        test(
            "when wordwrapboxes === false should only wrap at explicit line ends",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/wordwrapboxesfalse.svg"),
                    path.join(__dirname, "../../fixtures/wordwrapboxesfalse.json"), true, true);
            },
        );
    });

    describe("#renderAST arcskips", () => {
        const lWindow = new JSDOM("<html><body><span id='__svg'></span></body></html>").window;

        function processAndCompare(pExpectedFile, pInputFile, pIncludeSource, pUseOwnElement) {
            tst.assertequalProcessingXML(pExpectedFile, pInputFile, (pInput) => ast2svg(
                pInput,
                lWindow,
                {
                    includeSource: pIncludeSource,
                    useOwnElement: pUseOwnElement,
                },
            ));
        }
        test("one row arcskip, with a row height <= normal row height", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip01.svg"),
                path.join(__dirname, "../../fixtures/arcskip/arcskip01.json"), false, true);
        });

        test("two row arcskips, with row heights <= normal row height", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip02.svg"),
                path.join(__dirname, "../../fixtures/arcskip/arcskip02.json"), false, true);
        });

        test(
            "one row arcskips, with row height > normal row height; caused by current arc",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip03.svg"),
                    path.join(__dirname, "../../fixtures/arcskip/arcskip03.json"), false, true);
            },
        );

        test(
            "one row arcskips, with row height > normal row height; caused by another arc in the same row",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip04.svg"),
                    path.join(__dirname, "../../fixtures/arcskip/arcskip04.json"), false, true);
            },
        );

        test(
            "two row arcskips, with the row after it having a height > normal",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip05.svg"),
                    path.join(__dirname, "../../fixtures/arcskip/arcskip05.json"), false, true);
            },
        );

        test(
            "two row arcskips, with the row it should point to having a height > normal",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip06.svg"),
                    path.join(__dirname, "../../fixtures/arcskip/arcskip06.json"), false, true);
            },
        );

        test("1/2 row arcskip, with a row height <= normal row height", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip07.svg"),
                path.join(__dirname, "../../fixtures/arcskip/arcskip07.json"), false, true);
        });

        test("1.5 row arcskip, with a row height <= normal row height", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip08.svg"),
                path.join(__dirname, "../../fixtures/arcskip/arcskip08.json"), false, true);
        });

        test("42 row arcskip - beyond the end of the chart", () => {
            processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip09.svg"),
                path.join(__dirname, "../../fixtures/arcskip/arcskip09.json"), false, true);
        });

        test(
            "one row arcskip, with a row height <= normal row height within an inline expression",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip11.svg"),
                    path.join(__dirname, "../../fixtures/arcskip/arcskip11.json"), false, true);
            },
        );

        test(
            "one row arcskip accross an inline expression, with a row height <= normal row height",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip12.svg"),
                    path.join(__dirname, "../../fixtures/arcskip/arcskip12.json"), false, true);
            },
        );

        test(
            "one row arcskip accross two nested inline expression, with a row height <= normal row height",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip13.svg"),
                    path.join(__dirname, "../../fixtures/arcskip/arcskip13.json"), false, true);
            },
        );

        test(
            "if there's a regular arc and an inline expression on the same row - count it as a real and not a virtual row",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip14.svg"),
                    path.join(__dirname, "../../fixtures/arcskip/arcskip14.json"), false, true);
            },
        );

        test(
            "if there's an inline expression and a regular arc on the same row - count it as a real and not a virtual row",
            () => {
                processAndCompare(path.join(__dirname, "../../fixtures/arcskip/arcskip15.svg"),
                    path.join(__dirname, "../../fixtures/arcskip/arcskip15.json"), false, true);
            },
        );
    });
});
