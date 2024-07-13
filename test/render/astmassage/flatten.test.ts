import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
import * as flatten from "../../../src/render/astmassage/flatten";
const fix = require("../../astfixtures.json");

describe("render/astmassage/flatten", () => {
  describe("normalize", () => {
    it('should return an "unwound" version of the simple one alt ', () => {
      deepEqual(flatten.normalize(fix.astOneAlt), fix.astOneAltUnwound);
    });
    it('should return an "unwound" version of an alt within a loop ', () => {
      deepEqual(
        flatten.normalize(fix.astAltWithinLoop),
        fix.astAltWithinLoopUnWound,
      );
    });
    it("should keep comments within arc spanning arc bounds", () => {
      deepEqual(
        flatten.normalize(fix.astOptWithComment),
        fix.astOptWithCommentUnWound,
      );
    });
    it("should distribute the arc* colors to underlying arcs (one level)", () => {
      deepEqual(
        flatten.normalize(fix.astInlineWithArcColor),
        fix.astInlineWithArcColorUnWound,
      );
    });
    it("should distribute the arc* colors to underlying arcs (one level, but not more)", () => {
      deepEqual(
        flatten.normalize(fix.astNestedInlinesWithArcColor),
        fix.astNestedInlinesWithArcColorUnWound,
      );
    });
  });
});
