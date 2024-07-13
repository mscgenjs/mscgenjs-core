import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
const path = require("path");
const JSDOM = require("jsdom").JSDOM;
const renderer = require("../../../src/render/graphics/renderast");
const tst = require("../../testutensils");

global.window = new JSDOM("<html><body></body></html>").window;

function ast2svg(pASTString, lWindow, pOptions, pRenderOptions?) {
  const lAST = JSON.parse(pASTString);

  renderer.clean("__svg", lWindow);
  if (Boolean(pOptions.useNew)) {
    renderer.render(lAST, lWindow, "__svg", pRenderOptions);
  } else if (Boolean(pOptions.includeSource)) {
    renderer.render(lAST, lWindow, "__svg", { source: pASTString });
  } else {
    renderer.render(lAST, lWindow, "__svg", { source: null });
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

    function processAndCompare(
      pExpectedFile,
      pInputFile,
      pOptions,
      pRenderOptions?
    ) {
      tst.assertequalProcessingXML(pExpectedFile, pInputFile, (pInput) =>
        ast2svg(pInput, lWindow, pOptions, pRenderOptions)
      );
    }
    it("should be ok with an empty AST", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/astempty.svg"),
        path.join(__dirname, "../../fixtures/astempty.json"),
        { includeSource: true }
      );
    });
    it("should given given a simple syntax tree, render an svg", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/astsimple.svg"),
        path.join(__dirname, "../../fixtures/astsimple.json"),
        { includeSource: true }
      );
    });
    it("should given given a simple syntax tree, render an svg - with source omitted from svg", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/astsimplenosource.svg"),
        path.join(__dirname, "../../fixtures/astsimple.json"),
        false
      );
    });
    it("should not omit empty lines", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/astemptylinesinboxes.svg"),
        path.join(__dirname, "../../fixtures/astemptylinesinboxes.json"),
        { includeSource: true }
      );
    });
    it("should render colors", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/rainbow.svg"),
        path.join(__dirname, "../../fixtures/rainbow.json"),
        { includeSource: true }
      );
    });
    it("should render ids & urls", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/idsnurls.svg"),
        path.join(__dirname, "../../fixtures/idsnurls.json"),
        { includeSource: true }
      );
    });
    it("should wrap text in boxes well", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/test19_multiline_lipsum.svg"),
        path.join(__dirname, "../../fixtures/test19_multiline_lipsum.json"),
        { includeSource: true }
      );
    });
    it("should render empty inline expressions correctly", () => {
      processAndCompare(
        path.join(
          __dirname,
          "../../fixtures/test20_empty_inline_expression.svg"
        ),
        path.join(
          __dirname,
          "../../fixtures/test20_empty_inline_expression.json"
        ),
        { includeSource: true }
      );
    });
    it('should render "alt" lines in inline expressions correctly', () => {
      processAndCompare(
        path.join(
          __dirname,
          "../../fixtures/test21_inline_expression_alt_lines.svg"
        ),
        path.join(
          __dirname,
          "../../fixtures/test21_inline_expression_alt_lines.json"
        ),
        { includeSource: true }
      );
    });
    it("should render all possible arcs", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/test01_all_possible_arcs.svg"),
        path.join(__dirname, "../../fixtures/test01_all_possible_arcs.json"),
        { includeSource: true }
      );
    });
    it("should render with a viewBox instead of a width & height", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/astautoscale.svg"),
        path.join(__dirname, "../../fixtures/astautoscale.json"),
        { includeSource: true }
      );
    });
    it('should not render "mirrored entities" when not specified (inline expression last)', () => {
      processAndCompare(
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-off-inline-last.svg"
        ),
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-off-inline-last.json"
        ),
        { includeSource: false, useNew: true }
      );
    });
    it('should render "mirrored entities" when specified (inline expression last)', () => {
      processAndCompare(
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-on-inline-last.svg"
        ),
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-on-inline-last.json"
        ),
        { includeSource: false, useNew: true },
        { mirrorEntitiesOnBottom: true }
      );
    });
    it('should not render "mirrored entities" when not specified (regular arc last)', () => {
      processAndCompare(
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-off-regular-arc-last.svg"
        ),
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-off-regular-arc-last.json"
        ),
        { includeSource: false, useNew: true },
        { mirrorEntitiesOnBottom: false }
      );
    });
    it('should render "mirrored entities" when  specified (regular arc last)', () => {
      processAndCompare(
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-on-regular-arc-last.svg"
        ),
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-on-regular-arc-last.json"
        ),
        { includeSource: false, useNew: true },
        { mirrorEntitiesOnBottom: true }
      );
    });
    it("when style additions specified, they are included in the resulting svg", () => {
      processAndCompare(
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-on-regular-arc-last-with-style-additions.svg"
        ),
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-on-regular-arc-last.json"
        ),
        { includeSource: false, useNew: true },
        { styleAdditions: ".an-added-class {}" }
      );
    });
    it("when an existing style additions template is specified, that is included in the svg", () => {
      processAndCompare(
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-on-regular-arc-last-with-named-style-addition.svg"
        ),
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-on-regular-arc-last.json"
        ),
        { includeSource: false, useNew: true },
        { additionalTemplate: "inverted" }
      );
    });
    it("when an non-existing style additions template is specified, the svg styles are untouched", () => {
      processAndCompare(
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-off-regular-arc-last.svg"
        ),
        path.join(
          __dirname,
          "../../fixtures/mirrorentities-on-regular-arc-last.json"
        ),
        { includeSource: false, useNew: true },
        { additionalTemplate: "not an existing template" }
      );
    });
    it("On arcs, self referencing arcs, broadcast arcs and boxes titles get rendered in a <title> element", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/titletags.svg"),
        path.join(__dirname, "../../fixtures/titletags.json"),
        { includeSource: false, useNew: true }
      );
    });
  });

  describe("#renderAST in own element", () => {
    const lWindow = new JSDOM(
      "<html><body><span id='__svg'></span></body></html>"
    ).window;

    function processAndCompare(
      pExpectedFile,
      pInputFile,
      pIncludeSource,
      pUseOwnElement
    ) {
      tst.assertequalProcessingXML(pExpectedFile, pInputFile, (pInput) =>
        ast2svg(pInput, lWindow, {
          includeSource: pIncludeSource,
          useOwnElement: pUseOwnElement,
        })
      );
    }
    it("should be ok with an empty AST", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/astempty.svg"),
        path.join(__dirname, "../../fixtures/astempty.json"),
        true,
        true
      );
    });
    it("should given a simple syntax tree, render an svg", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/astsimple.svg"),
        path.join(__dirname, "../../fixtures/astsimple.json"),
        true,
        true
      );
    });
    it("should not bump boxes into inline expressions they're running in parallel with", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/bumpingboxes.svg"),
        path.join(__dirname, "../../fixtures/bumpingboxes.json"),
        true,
        true
      );
    });
    it("should render stuff running in parallel with inline expressions", () => {
      processAndCompare(
        path.join(
          __dirname,
          "../../fixtures/inline-expressions-and-parallel-stuff.svg"
        ),
        path.join(
          __dirname,
          "../../fixtures/inline-expressions-and-parallel-stuff.json"
        ),
        true,
        true
      );
    });
    it("should wrap entity text when wordwrapentities is unspecified", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/wordwrapentitiesunspecified.svg"),
        path.join(__dirname, "../../fixtures/wordwrapentitiesunspecified.json"),
        true,
        true
      );
    });
    it("when wordwrapentities === false should only wrap at explicit line ends", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/wordwrapentitiesfalse.svg"),
        path.join(__dirname, "../../fixtures/wordwrapentitiesfalse.json"),
        true,
        true
      );
    });
    it("when wordwrapboxes === true should wrap things in boxes", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/wordwrapboxestrue.svg"),
        path.join(__dirname, "../../fixtures/wordwrapboxestrue.json"),
        true,
        true
      );
    });
    it("when wordwrapboxes === false should only wrap at explicit line ends", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/wordwrapboxesfalse.svg"),
        path.join(__dirname, "../../fixtures/wordwrapboxesfalse.json"),
        true,
        true
      );
    });
  });

  describe("#renderAST arcskips", () => {
    const lWindow = new JSDOM(
      "<html><body><span id='__svg'></span></body></html>"
    ).window;

    function processAndCompare(
      pExpectedFile,
      pInputFile,
      pIncludeSource,
      pUseOwnElement
    ) {
      tst.assertequalProcessingXML(pExpectedFile, pInputFile, (pInput) =>
        ast2svg(pInput, lWindow, {
          includeSource: pIncludeSource,
          useOwnElement: pUseOwnElement,
        })
      );
    }
    it("one row arcskip, with a row height <= normal row height", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip01.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip01.json"),
        false,
        true
      );
    });

    it("two row arcskips, with row heights <= normal row height", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip02.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip02.json"),
        false,
        true
      );
    });

    it("one row arcskips, with row height > normal row height; caused by current arc", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip03.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip03.json"),
        false,
        true
      );
    });

    it("one row arcskips, with row height > normal row height; caused by another arc in the same row", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip04.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip04.json"),
        false,
        true
      );
    });

    it("two row arcskips, with the row after it having a height > normal", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip05.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip05.json"),
        false,
        true
      );
    });

    it("two row arcskips, with the row it should point to having a height > normal", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip06.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip06.json"),
        false,
        true
      );
    });

    it("1/2 row arcskip, with a row height <= normal row height", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip07.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip07.json"),
        false,
        true
      );
    });

    it("1.5 row arcskip, with a row height <= normal row height", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip08.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip08.json"),
        false,
        true
      );
    });

    it("42 row arcskip - beyond the end of the chart", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip09.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip09.json"),
        false,
        true
      );
    });

    it("one row arcskip, with a row height <= normal row height within an inline expression", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip11.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip11.json"),
        false,
        true
      );
    });

    it("one row arcskip accross an inline expression, with a row height <= normal row height", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip12.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip12.json"),
        false,
        true
      );
    });

    it("one row arcskip accross two nested inline expression, with a row height <= normal row height", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip13.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip13.json"),
        false,
        true
      );
    });

    it("if there's a regular arc and an inline expression on the same row - count it as a real and not a virtual row", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip14.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip14.json"),
        false,
        true
      );
    });

    it("if there's an inline expression and a regular arc on the same row - count it as a real and not a virtual row", () => {
      processAndCompare(
        path.join(__dirname, "../../fixtures/arcskip/arcskip15.svg"),
        path.join(__dirname, "../../fixtures/arcskip/arcskip15.json"),
        false,
        true
      );
    });
  });
});
