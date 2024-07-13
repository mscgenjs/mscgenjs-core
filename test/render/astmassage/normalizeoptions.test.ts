import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
import normalizeoptions from "../../../src/render/astmassage/normalizeoptions";

describe("render/astmassage/normalizeoptions", () => {
  it("normalize no options to the default values for wordwrap* stuff", () => {
    deepEqual(normalizeoptions(), {
      wordwraparcs: false,
      wordwrapentities: true,
      wordwrapboxes: true,
    });
  });

  it("normalize empty options to the default values for wordwrap* stuff", () => {
    deepEqual(normalizeoptions({}), {
      wordwraparcs: false,
      wordwrapentities: true,
      wordwrapboxes: true,
    });
  });

  it("normalize options to the default values for wordwrap* stuff - leave the rest alone", () => {
    deepEqual(
      normalizeoptions({
        hscale: 3.14,
        watermark: "shark wheels",
      }),
      {
        hscale: 3.14,
        watermark: "shark wheels",
        wordwraparcs: false,
        wordwrapentities: true,
        wordwrapboxes: true,
      },
    );
  });

  it("only take the default values for wordrap* things if they weren't in the source", () => {
    deepEqual(
      normalizeoptions({
        wordwrapentities: false,
      }),
      {
        wordwraparcs: false,
        wordwrapentities: false,
        wordwrapboxes: true,
      },
    );
  });
});
