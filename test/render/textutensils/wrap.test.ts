import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";

import wrap from "../../../src/render/textutensils/wrap";

describe("render/textutensils/wrap", () => {
  describe("#wrap(x, 10) - string with spaces", () => {
    const lWrapThis =
      "Aap noot mies wim zus jet teun vuur gijs lam kees bok weide does hok duif schapen.";
    const lWrapAry = wrap(lWrapThis, 10);

    it("should break up in 8 pieces", () => {
      deepEqual(lWrapAry.length, 8);
    });
    it('should have "Aap noot" in the first line', () => {
      deepEqual(lWrapAry[0], "Aap noot");
    });
    it('should have "schapen." as the last line', () => {
      deepEqual(lWrapAry[lWrapAry.length - 1], "schapen.");
    });
  });

  describe("#wrap(x, 10) - string without spaces", () => {
    const lWrapSpaceless =
      "Aap_noot_mies_wim_zus_jet_teun_vuur_gijs_lam_kees_bok_weide_does_hok_duif_schapen.";
    const lWrapSpacelessAry = wrap(lWrapSpaceless, 10);

    it("should break up in 9 pieces", () => {
      deepEqual(lWrapSpacelessAry.length, 9);
    });
    it('should have "Aap_noot_m" in the first line', () => {
      deepEqual(lWrapSpacelessAry[0], "Aap_noot_m");
    });
    it('should have "schapen." as the last line', () => {
      deepEqual(lWrapSpacelessAry[lWrapSpacelessAry.length - 1], "n.");
    });
  });

  describe("#wrap(x, 10) - empty string", () => {
    const lEmptyString = "";
    const lEmptyStringAry = wrap(lEmptyString, 10);

    it("should break up in 1 piece", () => {
      deepEqual(lEmptyStringAry.length, 1);
    });
    it("should have the empty string in its only component", () => {
      deepEqual(lEmptyStringAry[0], "");
    });
  });

  describe("#wrap(x, 100) - string with spaces", () => {
    const lWrapThis =
      "Aap noot mies wim zus jet teun vuur gijs lam kees bok weide does hok duif schapen.";
    const lWrapAry = wrap(lWrapThis, 100);

    it("should break up in 1 piece", () => {
      deepEqual(lWrapAry.length, 1);
    });
    it("should have the complete lWrapThis in the first line", () => {
      deepEqual(lWrapAry[0], lWrapThis);
    });
  });
});
