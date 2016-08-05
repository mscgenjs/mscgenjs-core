/* eslint max-nested-callbacks: 0 */
// const mscgenjs = require("../index-lazy");
const fix      = require("./astfixtures.json");
const jsdom    = require("jsdom");
const chai     = require("chai");
const expect   = chai.expect;
const version  = require("../package.json").version;
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


[require("../"), require("../index-lazy")].forEach(mscgenjs => {
    describe('index', () => {
        describe('#translateMsc()', () => {
            it('no params translates mscgen to json', () => {
                mscgenjs.translateMsc(SIMPLE_MSCGEN, null, function(pError, pResult){
                    /* eslint no-unused-expression:0 */
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
            it('returns a version number equal to the one in package.json', () => {
                expect(mscgenjs.version).to.equal(version);
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
                            window: pWindow,
                            includeSource: false
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
});
