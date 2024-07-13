import { describe, it } from "node:test";
import { equal } from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import type { ISequenceChart } from "../../../src/parse/mscgenjsast";
import * as renderer from "../../../src/render/text/ast2xu";
const fix = require("../../astfixtures.json");
const snapshots = require("./__snapshots__/ast2xu");

describe(`render/text/ast2xu`, () => {
  describe(`#renderAST() - simple syntax tree`, () => {
    it(`should, given a simple syntax tree, render a mscgen script`, () => {
      equal(renderer.render(fix.astSimple), snapshots.astSimple);
    });

    it(`should, given a simple syntax tree, render a mscgen script, minified explicitly set to false`, () => {
      equal(renderer.render(fix.astSimple), snapshots.astSimple);
    });

    it(`should, given a simple syntax tree, render a "minified" mscgen script`, () => {
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

  describe(`#renderAST() - minification`, () => {
    it(`should render a "minified" mscgen script`, () => {
      equal(
        renderer.render(fix.astOptions, true),
        snapshots.astOptionsMinified,
      );
    });

    it(`should render a "minified" mscgen script`, () => {
      equal(renderer.render(fix.astBoxes, true), snapshots.astBoxesMinified);
    });
  });

  describe(`#renderAST() - xu compatible`, () => {
    it(`alt only - render correct script`, () => {
      equal(renderer.render(fix.astOneAlt), snapshots.astOneAlt);
    });
    it(`alt within loop - render correct script`, () => {
      equal(renderer.render(fix.astAltWithinLoop), snapshots.astAltWithinLoop);
    });
    it("should correctly render empty inline expressions", () => {
      const lFixture = {
        meta: {
          extendedOptions: false,
          extendedArcTypes: true,
          extendedFeatures: true,
        },
        entities: [
          {
            name: "a",
          },
          {
            name: "b",
          },
        ],
        arcs: [
          [
            {
              kind: "opt",
              from: "a",
              to: "b",
              arcs: null,
            },
          ],
        ],
      } as unknown;
      equal(
        renderer.render(<ISequenceChart>lFixture),
        snapshots.astEmptyInlineExpression,
      );
    });
    it("Puts entities with mscgen keyword for a name in quotes", () => {
      equal(
        renderer.render(fix.entityWithMscGenKeywordAsName, true),
        snapshots.astEntityWithMscGenKeywordAsName,
      );
    });
    it("Re-renders title attributes", () => {
      equal(renderer.render(fix.astTitleOnArc, true), snapshots.astTitleOnArc);
    });
    it("Re-renders the activation attribute (on)", () => {
      equal(renderer.render(fix.astActivate, true), snapshots.astActivate);
    });
    it("Re-renders the activation attribute (off)", () => {
      equal(renderer.render(fix.astDeActivate, true), snapshots.astDeActivate);
    });
  });

  describe(`#renderAST() - file based tests`, () => {
    it(`should render all arcs`, () => {
      const lASTString = fs.readFileSync(
        path.join(__dirname, "../../fixtures/test01_all_possible_arcs.json"),
        {
          encoding: "utf8",
        },
      );
      const lAST = JSON.parse(lASTString);
      equal(renderer.render(lAST), snapshots.astAllPossibleArcs);
    });
  });
});
