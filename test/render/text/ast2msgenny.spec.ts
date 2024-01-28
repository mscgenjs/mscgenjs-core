import type { ISequenceChart } from "../../../src/parse/mscgenjsast";
import * as renderer from "../../../src/render/text/ast2msgenny";
const fix = require("../../astfixtures.json");

describe("render/text/ast2msgenny", () => {
  describe("#renderAST() - mscgen classic compatible - simple syntax trees", () => {
    test("should, given a simple syntax tree, render a msgenny script", () => {
      expect(renderer.render(fix.astSimple)).toMatchSnapshot();
    });

    test("should wrap labels with a , in quotes", () => {
      const lAST = {
        entities: [
          {
            name: "a",
            label: "comma,",
          },
        ],
      } as ISequenceChart;
      expect(renderer.render(lAST)).toMatchSnapshot();
    });

    test("should wrap labels with a ; in quotes", () => {
      const lAST = {
        entities: [
          {
            name: "a",
            label: "semi; colon",
          },
        ],
      } as ISequenceChart;
      expect(renderer.render(lAST)).toMatchSnapshot();
    });

    test("should wrap entity names with a space in quotes", () => {
      const lAST = {
        entities: [
          {
            name: "space space",
          },
        ],
      } as ISequenceChart;
      expect(renderer.render(lAST)).toMatchSnapshot();
    });

    test("should not wrap the '*' pseudo entity", () => {
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
      expect(renderer.render(lAST)).toMatchSnapshot();
    });

    test("should render options when they're in the syntax tree", () => {
      expect(renderer.render(fix.astOptions)).toMatchSnapshot();
    });

    test("should ignore all attributes, except label and name", () => {
      expect(renderer.render(fix.astAllAttributes)).toMatchSnapshot();
    });

    test("should preserve the comments at the start of the ast", () => {
      expect(renderer.render(fix.astWithPreComment)).toMatchSnapshot();
    });

    test("should correctly render parallel calls", () => {
      expect(renderer.render(fix.astSimpleParallel)).toMatchSnapshot();
    });
  });

  describe("#renderAST() - xu compatible", () => {
    test("alt only - render correct script", () => {
      expect(renderer.render(fix.astOneAlt)).toMatchSnapshot();
    });
    test("alt within loop - render correct script", () => {
      expect(renderer.render(fix.astAltWithinLoop)).toMatchSnapshot();
    });
    test("should correctly render empty inline expressions", () => {
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
      expect(renderer.render(<ISequenceChart>lFixture)).toMatchSnapshot();
    });
    test("Does not put entities with mscgen keyword for a name in quotes", () => {
      expect(
        renderer.render(fix.entityWithMscGenKeywordAsName)
      ).toMatchSnapshot();
    });
  });
});
