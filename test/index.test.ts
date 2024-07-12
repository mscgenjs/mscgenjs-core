import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
import { JSDOM } from "jsdom";
import chai from "chai";
import { notDeepEqual, throws } from "node:assert";
const version = require("../package.json").version;
const fix = require("./astfixtures.json");

const { window } = new JSDOM("");

// @ts-expect-error whatever
global.window = window;

const chaiExpect = chai.expect;

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

const SIMPLE_MSCGEN =
  'msc { a,"b space"; a => "b space" [label="a simple script"];}';
const SIMPLE_XU = 'xu { watermark="this is only valid in xu"; a,b; a->b;}';

[require("../src"), require("../src/index-lazy")].forEach((mscgenjs) => {
  describe("index", () => {
    describe("#translateMsc()", () => {
      it("no params translates mscgen to json", () => {
        deepEqual(JSON.parse(mscgenjs.translateMsc(SIMPLE_MSCGEN)), fix.astSimple);
      });

      it("explicit mscgen & json params translates mscgen to json too", () => {
        deepEqual(
          JSON.parse(
            mscgenjs.translateMsc(SIMPLE_MSCGEN, {
              inputType: "mscgen",
              outputType: "json",
            })
          ), fix.astSimple);
      });

      it("ast translates mscgen to an AST object", () => {
        deepEqual(
          mscgenjs.translateMsc(SIMPLE_MSCGEN, {
            inputType: "mscgen",
            outputType: "ast",
          }), fix.astSimple);
      });

      it("invalid mscgen throws an error", () => {
        throws(() =>
          mscgenjs.translateMsc(SIMPLE_XU, {
            inputType: "mscgen",
            outputType: "msgenny",
          })
        );
      });

      it("downgrading xu -> mscgen works", () => {
        deepEqual(
          mscgenjs.translateMsc(JSON.stringify(fix.astOneAlt, null, ""), {
            inputType: "json",
            outputType: "mscgen",
          }), gExpectedMscGenOutput);
      });

      it("translating a raw javascript object works", () => {
        deepEqual(
          mscgenjs.translateMsc(fix.astOneAlt, {
            inputType: "json",
            outputType: "mscgen",
          }), gExpectedMscGenOutput);
      });

      it("returns a version number equal to the one in package.json", () => {
        deepEqual(mscgenjs.version, version);
      });
    });

    describe("#renderMsc()", () => {
      const lWindow = new JSDOM(
        "<html><body><span id='__svg'></span></body></html>"
      ).window;

      it("should given given a simple MscGen program, render an svg", () => {
        mscgenjs.renderMsc(
          SIMPLE_MSCGEN,
          { window: lWindow },
          (pError, pResult) => {
            deepEqual(pError, null);
            chaiExpect(pResult).xml.to.be.valid();
          }
        );
      });

      it("should given given an invalid MscGen program, throw an error", () => {
        mscgenjs.renderMsc(SIMPLE_XU, null, (pError, pResult) => {
          notDeepEqual(pError, null);
          deepEqual(pError instanceof Error, true);
          
          deepEqual(pResult, null);
        });
      });

      it("should given given a simple AST, render an svg", () => {
        mscgenjs.renderMsc(
          JSON.stringify(fix.astOneAlt, null, ""),
          {
            inputType: "json",
            window: lWindow,
            includeSource: false,
          },
          (pError, pResult) => {
            deepEqual(pError, null);
            chaiExpect(pResult).xml.to.be.valid();
          }
        );
      });
    });

    describe("#getAllowedValues()", () => {
      it("returns possible input types", () => {
        deepEqual(Object.hasOwn(mscgenjs.getAllowedValues(), "inputType"), true);
      });

      it("returns possible output types", () => {
        deepEqual(Object.hasOwn(mscgenjs.getAllowedValues(), "outputType"), true);
      });

      it("returns possible regularArcTextVerticalAlignment types", () => {
        deepEqual(Object.hasOwn(mscgenjs.getAllowedValues(), "regularArcTextVerticalAlignment"), true);
      });

      it("returns possible namedStyles", () => {
        deepEqual(Object.hasOwn(mscgenjs.getAllowedValues(), "namedStyle"), true);
      });
    });
  });
});
