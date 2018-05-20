/* eslint max-nested-callbacks: 0 */
// const mscgenjs = require("../index-lazy");
const JSDOM    = require("jsdom").JSDOM;
const chai     = require("chai");
const version  = require("../package.json").version;
const fix      = require("./astfixtures.json");

const chaiExpect   = chai.expect;
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


[require("../src"), require("../src/index-lazy")].forEach((mscgenjs) => {
    describe('index', () => {
        describe('#translateMsc()', () => {
            test('no params translates mscgen to json', () => {
                mscgenjs.translateMsc(SIMPLE_MSCGEN, null, (pError, pResult) => {
                    /* eslint no-unused-expression:0 */
                    expect(pError).toBeNull();
                    expect(
                        JSON.parse(pResult)
                    ).toEqual(
                        fix.astSimple
                    );
                });
            });

            test('explicit mscgen & json params translates mscgen to json too', () => {
                mscgenjs.translateMsc(
                    SIMPLE_MSCGEN,
                    {inputType: "mscgen", outputType: "json"},
                    (pError, pResult) => {
                        expect(pError).toBeNull();
                        expect(
                            JSON.parse(pResult)
                        ).toEqual(
                            fix.astSimple
                        );
                    });
            });
            test('ast translates mscgen to an AST object', () => {
                mscgenjs.translateMsc(SIMPLE_MSCGEN, {outputType: "ast"}, (pError, pResult) => {
                    /* eslint no-unused-expression:0 */
                    expect(pError).toBeNull();
                    expect(
                        pResult
                    ).toEqual(
                        fix.astSimple
                    );
                });
            });
            test('invalid mscgen throws an error', () => {
                mscgenjs.translateMsc(
                    SIMPLE_XU,
                    {inputType: "mscgen", outputType: "msgenny"},
                    (pError, pResult) => {
                        expect(pError).not.toBeNull();
                        expect(pError).toBeInstanceOf(Error);
                        expect(pResult).toBeNull();
                    });
            });
            test('downgrading xu -> mscgen works', () => {
                mscgenjs.translateMsc(
                    JSON.stringify(fix.astOneAlt, null, ""),
                    {inputType: "json", outputType: "mscgen"},
                    (pError, pResult) => {
                        expect(pError).toBeNull();
                        expect(pResult).toBe(gExpectedMscGenOutput);
                    });
            });
            test('translating a raw javascript object works', () => {
                mscgenjs.translateMsc(
                    fix.astOneAlt,
                    {inputType: "json", outputType: "mscgen"},
                    (pError, pResult) => {
                        expect(pError).toBeNull();
                        expect(pResult).toBe(gExpectedMscGenOutput);
                    });
            });
            test('returns a version number equal to the one in package.json', () => {
                expect(mscgenjs.version).toBe(version);
            });
        });


        describe('#renderMsc()', () => {
            const lWindow = new JSDOM("<html><body><span id='__svg'></span></body></html>").window;

            test('should given given a simple MscGen program, render an svg', () => {
                mscgenjs.renderMsc(
                    SIMPLE_MSCGEN,
                    {window: lWindow},
                    (pError, pResult) => {
                        expect(pError).toBeNull();
                        chaiExpect(pResult).xml.to.be.valid();
                    }
                );
            });
            test('should given given an invalid MscGen program, throw an error', () => {
                mscgenjs.renderMsc(
                    SIMPLE_XU,
                    {window: lWindow},
                    (pError, pResult) => {
                        expect(pError).not.toBeNull();
                        expect(pError).toBeInstanceOf(Error);
                        expect(pResult).toBeNull();
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
                    (pError, pResult) => {
                        expect(pError).toBeNull();
                        chaiExpect(pResult).xml.to.be.valid();
                    }
                );
            });
        });

        describe('#getAllowedValues()', () => {

            test('returns possible input types', () => {
                expect(mscgenjs.getAllowedValues()).toHaveProperty('inputType');
            });

            test('returns possible output types', () => {
                expect(mscgenjs.getAllowedValues()).toHaveProperty('outputType');
            });

            test('returns possible regularArcTextVerticalAlignment types', () => {
                expect(mscgenjs.getAllowedValues()).toHaveProperty('regularArcTextVerticalAlignment');
            });

            test('returns possible namedStyles', () => {
                expect(mscgenjs.getAllowedValues()).toHaveProperty('namedStyle');
            });
        });
    });
});
