import { describe, it } from "node:test";
import { equal } from "node:assert/strict";
import * as renderer from "../../../src/render/text/ast2doxygen";
const fix = require("../../astfixtures.json");
const snapshots = require("./__snapshots__/ast2doxygen");

describe("render/text/ast2doxygen", () => {
  describe("#renderAST() - simple syntax tree", () => {
    it("should, given a simple syntax tree, render a mscgen script", () => {
      equal(renderer.render(fix.astSimple), snapshots.astSimple);
    });

    it("should preserve the comments at the start of the ast", () => {
      equal(
        renderer.render(fix.astWithPreComment),
        snapshots.astWithPreComment,
      );
    });

    it("should preserve attributes", () => {
      equal(renderer.render(fix.astAttributes), snapshots.astAttributes);
    });
  });

  describe("#renderAST() - xu compatible", () => {
    it("alt only - render correct script", () => {
      equal(renderer.render(fix.astOneAlt), snapshots.astOneAlt);
    });
    it("alt within loop - render correct script", () => {
      equal(renderer.render(fix.astAltWithinLoop), snapshots.astAltWithinLoop);
    });
    it("When presented with an unsupported option, renders the script by simply omitting it", () => {
      equal(
        renderer.render(fix.astWithAWatermark),
        snapshots.astWithAWatermark,
      );
    });
    it("Does not render width when that equals 'auto'", () => {
      equal(renderer.render(fix.auto), snapshots.auto);
    });
    it("Render width when that is a number", () => {
      equal(renderer.render(fix.fixedwidth), snapshots.fixedwidth);
    });
    it("Puts entities with mscgen keyword for a name in quotes", () => {
      equal(
        renderer.render(fix.entityWithMscGenKeywordAsName),
        snapshots.entityWithMscGenKeywordAsName,
      );
    });
  });
});
