const tst = require("../testutensils");
const fix = require("../astfixtures.json");

const gExpectedMscGenOutput = `msc {\n\
  a,\n\
  b,\n\
  c;\n\
\n\
  a => b;\n\
  b -- c;\n\
    b => c;\n\
    c >> b;\n\
#;\n\
}`;

[
    require("../../src/main/static-resolver"),
    require("../../src/main/lazy-resolver")
].forEach((mscgenjs) => {
    describe("resolver", () => {
        function isMscGenParser(pParser) {
            tst.assertSyntaxError('xu { watermark="this is only valid in xu"; a,b; a->b;}', pParser);
            expect(
                pParser.parse('msc { a,"b space"; a => "b space" [label="a simple script"];}'),
            ).toEqual(
                fix.astSimple,
            );
        }

        function isMscGenTextRenderer(pRenderer) {
            expect(pRenderer.render(fix.astOneAlt)).toBe(gExpectedMscGenOutput);
        }

        describe("#getParser()", () => {
            test("Returns the mscgen parser when not provided with arguments", () => {
                isMscGenParser(mscgenjs.getParser());
            });
            test(
                "Returns the MscGen parser when not provided with a valid argument",
                () => {
                    isMscGenParser(mscgenjs.getParser("c++"));
                },
            );
        });

        describe("#getTextRenderer()", () => {
            test(
                "Returns the ast2mscgen renderer when not provided with arguments",
                () => {
                    isMscGenTextRenderer(mscgenjs.getTextRenderer());
                },
            );

            test("Returns the ast2mscgen renderer when not with a valid argument", () => {
                isMscGenTextRenderer(mscgenjs.getTextRenderer("some weird xmi format"));
            });
        });
    });
});
