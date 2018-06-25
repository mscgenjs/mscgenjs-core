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


[require("../dist"), require("../dist/index-lazy")].forEach((mscgenjs) => {
    describe('index', () => {
        describe('#translateMsc()', () => {
            test('no params translates mscgen to json', () => {
                expect(JSON.parse(mscgenjs.translateMsc(SIMPLE_MSCGEN))).toEqual(fix.astSimple);
            });

            test('explicit mscgen & json params translates mscgen to json too', () => {
                expect(
                    JSON.parse(mscgenjs.translateMsc(SIMPLE_MSCGEN, {inputType: "mscgen", outputType: "json"}))
                ).toEqual(fix.astSimple);
            });

            test('ast translates mscgen to an AST object', () => {
                expect(
                    mscgenjs.translateMsc(SIMPLE_MSCGEN, {inputType: "mscgen", outputType: "ast"})
                ).toEqual(fix.astSimple);
            });

            test('invalid mscgen throws an error', () => {
                expect(
                    () => mscgenjs.translateMsc(
                        SIMPLE_XU,
                        {inputType: "mscgen", outputType: "msgenny"}
                    )
                ).toThrow();
            });

            test('downgrading xu -> mscgen works', () => {
                expect(
                    mscgenjs.translateMsc(
                        JSON.stringify(fix.astOneAlt, null, ""),
                        {inputType: "json", outputType: "mscgen"}
                    )
                ).toBe(gExpectedMscGenOutput);
            });

            test('translating a raw javascript object works', () => {
                expect(
                    mscgenjs.translateMsc(
                        fix.astOneAlt,
                        {inputType: "json", outputType: "mscgen"}
                    )
                ).toBe(gExpectedMscGenOutput);
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
                    null,
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
