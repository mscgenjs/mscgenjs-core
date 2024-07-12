import { describe, it } from "node:test";
import { deepEqual} from "node:assert/strict";
import getDiagonalAngle from "../../../src/render/graphics/svgelementfactory/getdiagonalangle";

describe("#geometry", () => {
    describe("#getDiagonalAngle", () => {
        it("returns -45 degrees for a square box", () => {
            deepEqual(getDiagonalAngle({height: 10, width: 10}), -45);
        });
        it("returns -90 degrees for a zero width box", () => {
            deepEqual(getDiagonalAngle({height: 10, width: 0}), -90);
        });
        it("returns -0 degrees for a zero height box", () => {
            deepEqual(getDiagonalAngle({height: 0, width: 10}), 0);
        });
        it("returns ~ -36.9 degrees for a 640*480 box", () => {
            deepEqual(getDiagonalAngle({height: 480, width: 640}), -36.86989764584402);
        });
    });
});
