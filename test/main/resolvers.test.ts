import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
import * as tst from "../testutensils.js";
import * as fs from "fs";
import * as path from "path";

const fix = JSON.parse(
  fs.readFileSync(path.join(`${__dirname}`, "..", "astfixtures.json"), "utf-8"),
);

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
  require("../../src/main/lazy-resolver"),
].forEach((mscgenjs) => {
  describe("resolver", () => {
    function isMscGenParser(pParser) {
      tst.assertSyntaxError(
        'xu { watermark="this is only valid in xu"; a,b; a->b;}',
        pParser,
      );
      deepEqual(
        pParser.parse(
          'msc { a,"b space"; a => "b space" [label="a simple script"];}',
        ),
        fix.astSimple,
      );
    }

    function isMscGenTextRenderer(pRenderer) {
      deepEqual(pRenderer.render(fix.astOneAlt), gExpectedMscGenOutput);
    }

    describe("#getParser()", () => {
      it("Returns the mscgen parser when not provided with arguments", () => {
        isMscGenParser(mscgenjs.getParser());
      });
      it("Returns the MscGen parser when not provided with a valid argument", () => {
        isMscGenParser(mscgenjs.getParser("c++"));
      });
    });

    describe("#getTextRenderer()", () => {
      it("Returns the ast2mscgen renderer when not provided with arguments", () => {
        isMscGenTextRenderer(mscgenjs.getTextRenderer());
      });

      it("Returns the ast2mscgen renderer when not with a valid argument", () => {
        isMscGenTextRenderer(mscgenjs.getTextRenderer("some weird xmi format"));
      });
    });
  });
});
