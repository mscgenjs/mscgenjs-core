/* eslint max-nested-callbacks: 0 */
// const mscgenjs = require("../index-lazy");
const JSDOM    = require("jsdom").JSDOM;
const chai     = require("chai");
const version  = require("../package.json").version;
const fix      = require("./astfixtures.json");

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


[require("../"), require("../index-lazy")].forEach(mscgenjs => {
    describe('index', () => {
        describe('#translateMsc()', () => {
            test('no params translates mscgen to json', () => {
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

            test('explicit mscgen & json params translates mscgen to json too', () => {
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
            test('ast translates mscgen to an AST object', () => {
                mscgenjs.translateMsc(SIMPLE_MSCGEN, {outputType: "ast"}, function(pError, pResult){
                    /* eslint no-unused-expression:0 */
                    expect(pError).to.be.null;
                    expect(
                        pResult
                    ).to.deep.equal(
                        fix.astSimple
                    );
                });
            });
            test('invalid mscgen throws an error', () => {
                mscgenjs.translateMsc(
                    SIMPLE_XU,
                    {inputType: "mscgen", outputType: "msgenny"},
                    function(pError, pResult){
                        expect(pError).to.be.not.null;
                        expect(pError).to.be.instanceof(Error);
                        expect(pResult).to.be.null;
                    });
            });
            test('downgrading xu -> mscgen works', () => {
                mscgenjs.translateMsc(
                    JSON.stringify(fix.astOneAlt, null, ""),
                    {inputType: "json", outputType: "mscgen"},
                    function(pError, pResult){
                        expect(pError).to.be.null;
                        expect(pResult).to.equal(gExpectedMscGenOutput);
                    });
            });
            test('translating a raw javascript object works', () => {
                mscgenjs.translateMsc(
                    fix.astOneAlt,
                    {inputType: "json", outputType: "mscgen"},
                    function(pError, pResult){
                        expect(pError).to.be.null;
                        expect(pResult).to.equal(gExpectedMscGenOutput);
                    });
            });
            test('returns a version number equal to the one in package.json', () => {
                expect(mscgenjs.version).to.equal(version);
            });
        });


        describe('#renderMsc()', () => {
            const lWindow = new JSDOM("<html><body><span id='__svg'></span></body></html>").window;

            test('should given given a simple MscGen program, render an svg', () => {
                mscgenjs.renderMsc(
                    SIMPLE_MSCGEN,
                    {window: lWindow},
                    function(pError, pResult){
                        expect(pError).to.be.null;
                        expect(pResult).xml.to.be.valid();
                    }
                );
            });
            test('should given given an invalid MscGen program, throw an error', () => {
                mscgenjs.renderMsc(
                    SIMPLE_XU,
                    {window: lWindow},
                    function(pError, pResult){
                        expect(pError).to.be.not.null;
                        expect(pError).to.be.instanceof(Error);
                        expect(pResult).to.be.null;
                    }
                );
            });
            test('should given given a simple AST, render an svg', () => {
                mscgenjs.renderMsc(
                    JSON.stringify(fix.astOneAlt, null, ""),
                    {
                        inputType: "json",
                        window: lWindow,
                        includeSource: false
                    },
                    function(pError, pResult){
                        expect(pError).to.be.null;
                        expect(pResult).xml.to.be.valid();
                    }
                );
            });
        });

        describe('#getAllowedValues()', () => {

            test('returns possible input types', () => {
                expect(mscgenjs.getAllowedValues()).to.haveOwnProperty('inputType');
            });

            test('returns possible output types', () => {
                expect(mscgenjs.getAllowedValues()).to.haveOwnProperty('outputType');
            });

            test('returns possible regularArcTextVerticalAlignment types', () => {
                expect(mscgenjs.getAllowedValues()).to.haveOwnProperty('regularArcTextVerticalAlignment');
            });

            test('returns possible namedStyles', () => {
                expect(mscgenjs.getAllowedValues()).to.haveOwnProperty('namedStyle');
            });
        });
    });
});
