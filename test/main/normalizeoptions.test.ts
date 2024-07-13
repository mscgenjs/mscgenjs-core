import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
const normalizeOptions = require("../../src/main/normalizeoptions").default;
import { JSDOM } from "jsdom";
const { window } = new JSDOM("");

// @ts-expect-error whatever
global.window = window;

describe("normalizeOptions", () => {
  it("Boundary - empty object as first parameter", () => {
    deepEqual(normalizeOptions({}), {
      inputType: "mscgen",
      elementId: "__svg",
      window,
      includeSource: true,
      source: undefined,
      styleAdditions: null,
      additionalTemplate: "basic",
      mirrorEntitiesOnBottom: false,
      regularArcTextVerticalAlignment: "middle",
    });
  });

  it('Boundary - only "includeSource" is false', () => {
    deepEqual(normalizeOptions({ includeSource: false }), {
      inputType: "mscgen",
      elementId: "__svg",
      window,
      includeSource: false,
      source: null,
      styleAdditions: null,
      additionalTemplate: "basic",
      mirrorEntitiesOnBottom: false,
      regularArcTextVerticalAlignment: "middle",
    });
  });
});

/* global window */
