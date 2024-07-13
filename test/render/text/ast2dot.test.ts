import { describe, it } from "node:test";
// using deepEqual instead of deepStrictEqual because with deepStrictEqual the 
// explodeBroadCasts test fails for unclear reasons (the objects are the same
// for all _practical_ purposes)
import { deepEqual } from "node:assert";
import { equal } from "node:assert/strict";
const fs = require("fs");
const path = require("path");
import { render, explodeBroadcasts } from "../../../src/render/text/ast2dot";
const fix = require("../../astfixtures.json");
const snapshots = require("./__snapshots__/ast2dot");

describe("render/text/ast2dot", () => {
  describe("#renderAST() - mscgen classic compatible - simple syntax trees", () => {
    it("should, given an 'empty' syntax tree, render a dot script", () => {
      equal(render(fix.astEmpty), snapshots.astEmpty);
    });

    it("should, given a simple syntax tree, render a dot script", () => {
      equal(render(fix.astSimple), snapshots.astSimple);
    });

    it("should, given a syntax tree with boxes, render a dot script", () => {
      equal(render(fix.astBoxArcs), snapshots.astBoxArcs);
    });
  });

  describe("#renderAST() - xu compatible", () => {
    it("alt only - render correct script", () => {
      equal(render(fix.astOneAlt), snapshots.astOneAlt);
    });
    it("alt within loop - render correct script", () => {
      equal(render(fix.astAltWithinLoop), snapshots.astAltWithinLoop);
    });
  });

  describe("#renderAST() - file based tests", () => {
    it("should render all arcs", () => {
      const lASTString = fs.readFileSync(
        path.join(
          __dirname,
          "../../fixtures/test01_all_possible_arcs_mscgen.json"
        ),
        { encoding: "utf8" }
      );
      const lAST = JSON.parse(lASTString);
      // expect(render(lAST)).toMatchSnapshot();
      equal(render(lAST), snapshots.allArcs);
    });
  });

  describe("explodeBroadcasts", () => {
    it("leave asts without broadcasts alone", () => {
      deepEqual(explodeBroadcasts(fix.astAltWithinLoop), 
        fix.astAltWithinLoop
      );
    });
    it("explode b->* to parallel calls to all other entities", () => {
      deepEqual(explodeBroadcasts(fix.astSimpleBroadcast), 
        fix.astSimpleBroadcastExploded
      );
    });
    it("explode a little more complex broadcast ast to parallel calls to all other entities", () => {
      deepEqual(explodeBroadcasts(fix.astComplexerBroadcast), 
        fix.astComplexerBroadcastExploded
      );
    });
    it("correctly explode a broadcast that has other arcs in the same arc row", () => {
      deepEqual(explodeBroadcasts(fix.astSameArcRowBroadcast), 
        fix.astSameArcRowBroadcastExploded
      );
    });
  });
});
