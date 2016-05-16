const mscgenjs = require("../");
const tst      = require("./testutensils");
const fix      = require("./astfixtures.json");
const jsdom    = require("jsdom");
const chai     = require("chai");
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

/*
 * NOTE: the cli/t_actions.js already excercises index.js for most scenarios.
 *       These tests cover the rest
 */

const SIMPLE_MSCGEN = 'msc { a,"b space"; a => "b space" [label="a simple script"];}';
const SIMPLE_XU     = 'xu { watermark="this is only valid in xu"; a,b; a->b;}';

describe('index', () => {

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
        it("Returns the mscgen parser when not provided with arguments", () => {
            isMscGenParser(mscgenjs.getParser());
        });
        it('Returns the MscGen parser when not provided with a valid argument', () => {
            isMscGenParser(mscgenjs.getParser("c++"));
        });
    });

    describe('#getTextRenderer()', () => {
        it('Returns the ast2mscgen renderer when not provided with arguments', () => {
            isMscGenTextRenderer(mscgenjs.getTextRenderer());
        });

        it('Returns the ast2mscgen renderer when not with a valid argument', () => {
            isMscGenTextRenderer(mscgenjs.getTextRenderer("some weird xmi format"));
        });
    });

    describe('#translateMsc()', () => {
        it('no params translates mscgen to json', () => {
            mscgenjs.translateMsc(SIMPLE_MSCGEN, null, function(pError, pResult){
                expect(pError).to.be.null;
                expect(
                    JSON.parse(pResult)
                ).to.deep.equal(
                    fix.astSimple
                );
            });
        });

        it('explicit mscgen & json params translates mscgen to json too', () => {
            mscgenjs.translateMsc(
                SIMPLE_MSCGEN,
                {inputType: "mscgen", outputType: "json"},
                function(pError, pResult){
                    expect(pError).to.be.null;
                    expect(
                        JSON.parse(pResult)
                    ).to.deep.equal(
                        fix.astSimple
                    );
                });
        });
        it('invalid mscgen throws an error', () => {
            mscgenjs.translateMsc(
                SIMPLE_XU,
                {inputType: "mscgen", outputType: "msgenny"},
                function(pError, pResult){
                    expect(pError).to.be.not.null;
                    expect(pError).to.be.instanceof(Error);
                    expect(pResult).to.be.null;
                });
        });
        it('downgrading xu -> mscgen works', () => {
            mscgenjs.translateMsc(
                JSON.stringify(fix.astOneAlt, null, ""),
                {inputType: "json", outputType: "mscgen"},
                function(pError, pResult){
                    expect(pError).to.be.null;
                    expect(pResult).to.equal(gExpectedMscGenOutput);
                });
        });
        it('translating a raw javascript object works', () => {
            mscgenjs.translateMsc(
                fix.astOneAlt,
                {inputType: "json", outputType: "mscgen"},
                function(pError, pResult){
                    expect(pError).to.be.null;
                    expect(pResult).to.equal(gExpectedMscGenOutput);
                });
        });
    });
    jsdom.env("<html><body><span id='__svg'></span></body></html>", function(err, pWindow) {
        describe('#renderMsc()', () => {
            it('should given given a simple MscGen program, render an svg', () => {
                mscgenjs.renderMsc(
                    SIMPLE_MSCGEN,
                    {window: pWindow},
                    function(pError, pResult){
                        expect(pError).to.be.null;
                        expect(pResult).xml.to.be.valid();
                    }
                );
            });
            it('should given given an invalid MscGen program, throw an error', () => {
                mscgenjs.renderMsc(
                    SIMPLE_XU,
                    {window: pWindow},
                    function(pError, pResult){
                        expect(pError).to.be.not.null;
                        expect(pError).to.be.instanceof(Error);
                        expect(pResult).to.be.null;
                    }
                );
            });
            it('should given given a simple AST, render an svg', () => {
                mscgenjs.renderMsc(
                    JSON.stringify(fix.astOneAlt, null, ""),
                    {
                        inputType: "json",
                        window: pWindow
                    },
                    function(pError, pResult){
                        expect(pError).to.be.null;
                        expect(pResult).xml.to.be.valid();
                    }
                );
            });
        });
    });
    it('dummy so mocha executes the tests wrapped in jsdom', () => {
        return true;
    });
});
