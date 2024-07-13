import { describe, it } from "node:test";
import { equal } from "node:assert/strict";
const fs = require("fs");
const path = require("path");
import * as renderer from "../../../src/render/text/ast2mscgen";
const fix = require("../../astfixtures.json");
const snapshots = require("./__snapshots__/ast2mscgen");

describe("render/text/ast2mscgen", () => {
  describe("#renderAST() - simple syntax tree", () => {
    it("should, given a simple syntax tree, render a mscgen script", () => {
      equal(renderer.render(fix.astSimple), snapshots.astSimple);
    });

    it("should, given a simple syntax tree, render a mscgen script (explicitly not minified)", () => {
      equal(renderer.render(fix.astSimple), snapshots.astSimple);
    });

    it('should, given a simple syntax tree, render a "minified" mscgen script', () => {
      equal(renderer.render(fix.astSimple, true), snapshots.astSimpleMinified);
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

    it("correctly renders multiple options", () => {
      equal(renderer.render(fix.astOptionsMscgen), snapshots.astOptionsMscgen);
    });

    it("correctly renders parallel calls", () => {
      equal(
        renderer.render(fix.astSimpleParallel),
        snapshots.astSimpleParallel,
      );
    });
  });

  describe("#renderAST() - minification", () => {
    it('should render a "minified" mscgen script', () => {
      equal(
        renderer.render(fix.astOptions, true),
        snapshots.astOptionsMinified,
      );
    });

    it('should render a "minified" mscgen script', () => {
      equal(renderer.render(fix.astBoxes, true), snapshots.astBoxesMinified);
    });
  });

  describe("#renderAST() - xu compatible", () => {
    it("alt only - render correct script", () => {
      equal(renderer.render(fix.astOneAlt), snapshots.astOneAlt);
    });
    it("When presented with an unsupported option, renders the script by simply omitting it", () => {
      equal(
        renderer.render(fix.astWithAWatermark),
        snapshots.astWithAWatermark,
      );
    });
    it("Does not render width when that equals 'auto'", () => {
      equal(renderer.render(fix.auto, true), snapshots.auto);
    });
    it("Puts entities with mscgen keyword for a name in quotes", () => {
      equal(
        renderer.render(fix.entityWithMscGenKeywordAsName, true),
        snapshots.entityWithMscGenKeywordAsName,
      );
    });
  });
  describe("#renderAST() - file based tests", () => {
    it("should render all arcs", () => {
      const lASTString = fs.readFileSync(
        path.join(
          __dirname,
          "../../fixtures/test01_all_possible_arcs_mscgen.json",
        ),
        { encoding: "utf8" },
      );
      const lAST = JSON.parse(lASTString);
      // expect(renderer.render(lAST)).toMatchSnapshot();
      equal(renderer.render(lAST), snapshots.allArcs);
    });
  });
});
