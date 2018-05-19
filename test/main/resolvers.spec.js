/* eslint max-nested-callbacks: 0 */
// const mscgenjs = require("../index-lazy");
const chai     = require("chai");
const tst      = require("../testutensils");
const fix      = require("../astfixtures.json");

const expect   = chai.expect;
chai.use(require("chai-xml"));

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


[require("../../main/static-resolver"), require("../../main/lazy-resolver")].forEach(mscgenjs => {
    describe('resolver', () =>{
        function isMscGenParser(pParser){
            tst.assertSyntaxError('xu { watermark="this is only valid in xu"; a,b; a->b;}', pParser);
            expect(
                pParser.parse('msc { a,"b space"; a => "b space" [label="a simple script"];}')
            ).to.deep.equal(
                fix.astSimple
            );
        }

        function isMscGenTextRenderer(pRenderer){
            expect(pRenderer.render(fix.astOneAlt)).to.equal(gExpectedMscGenOutput);
        }

        describe('#getParser()', () => {
            test("Returns the mscgen parser when not provided with arguments", () => {
                isMscGenParser(mscgenjs.getParser());
            });
            test(
                'Returns the MscGen parser when not provided with a valid argument',
                () => {
                    isMscGenParser(mscgenjs.getParser("c++"));
                }
            );
        });

        describe('#getTextRenderer()', () => {
            test(
                'Returns the ast2mscgen renderer when not provided with arguments',
                () => {
                    isMscGenTextRenderer(mscgenjs.getTextRenderer());
                }
            );

            test('Returns the ast2mscgen renderer when not with a valid argument', () => {
                isMscGenTextRenderer(mscgenjs.getTextRenderer("some weird xmi format"));
            });
        });
    });
});
