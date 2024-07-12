import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";

const renderutensils = require("../../../src/render/graphics/renderutensils");

describe("#renderutensils.determineDepthCorrection", () => {
    it("returns 0 (no depth correction) if presented with no params", () => {
        deepEqual(renderutensils.determineDepthCorrection(),0);
    });
});
