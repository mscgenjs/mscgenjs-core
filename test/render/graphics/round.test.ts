import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
import round from "../../../src/render/graphics/svgelementfactory/round";

describe("#round", () => {
  it("rounds to whole numbers when not passed a precision", () => {
    deepEqual(round(3.14), 3);
  });

  it("rounds to whole numbers when passed a precision of 0", () => {
    deepEqual(round(3.14, 0), 3);
  });

  it("rounds to tenths when passed a precision of 1", () => {
    deepEqual(round(3.14, 1), 3.1);
    deepEqual(round(3.15, 1), 3.2);
  });
});
