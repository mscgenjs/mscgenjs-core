import { describe, it } from "node:test";
import { equal } from "node:assert/strict";
import type { ISequenceChart } from "../../../src/parse/mscgenjsast";
import * as renderer from "../../../src/render/text/ast2msgenny";
const fix = require("../../astfixtures.json");
const snapshots = require("./__snapshots__/ast2msgenny");

describe("render/text/ast2msgenny", () => {
  describe("#renderAST() - mscgen classic compatible - simple syntax trees", () => {
    it("should, given a simple syntax tree, render a msgenny script", () => {
      equal(renderer.render(fix.astSimple), snapshots.astSimple);
    });

    it("should wrap labels with a , in quotes", () => {
      const lAST = {
        entities: [
          {
            name: "a",
            label: "comma,",
          },
        ],
      } as ISequenceChart;
      equal(renderer.render(lAST), snapshots.astSimpleComma);
    });

    it("should wrap labels with a ; in quotes", () => {
      const lAST = {
        entities: [
          {
            name: "a",
            label: "semi; colon",
          },
        ],
      } as ISequenceChart;
      equal(renderer.render(lAST), snapshots.astSimpleSemiColon);
    });

    it("should wrap entity names with a space in quotes", () => {
      const lAST = {
        entities: [
          {
            name: "space space",
          },
        ],
      } as ISequenceChart;
      equal(renderer.render(lAST), snapshots.astSimpleSpace);
    });

    it("should not wrap the '*' pseudo entity", () => {
      const lAST = {
        entities: [
          {
            name: "a",
          },
          {
            name: "b",
          },
          {
            name: "c",
          },
        ],
        arcs: [
          [
            {
              kind: "=>>",
              from: "b",
              to: "*",
              label: "",
            },
          ],
        ],
      } as ISequenceChart;
      equal(renderer.render(lAST), snapshots.astSimpleStar);
    });

    it("should render options when they're in the syntax tree", () => {
      equal(renderer.render(fix.astOptions), snapshots.astOptions);
    });

    it("should ignore all attributes, except label and name", () => {
      equal(renderer.render(fix.astAllAttributes), snapshots.astAllAttributes);
    });

    it("should preserve the comments at the start of the ast", () => {
      equal(renderer.render(fix.astWithPreComment), snapshots.astWithPreComment);
    });

    it("should correctly render parallel calls", () => {
      equal(renderer.render(fix.astSimpleParallel), snapshots.astSimpleParallel);
    });
  });

  describe("#renderAST() - xu compatible", () => {
    it("alt only - render correct script", () => {
      equal(renderer.render(fix.astOneAlt), snapshots.astOneAlt);
    });
    it("alt within loop - render correct script", () => {
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
      equal(renderer.render(<ISequenceChart>lFixture), snapshots.astEmptyInlineExpression);
    });
    it("Does not put entities with mscgen keyword for a name in quotes", () => {
      equal(renderer.render(fix.entityWithMscGenKeywordAsName), snapshots.entityWithMscGenKeywordAsName);
    });
  });
});
