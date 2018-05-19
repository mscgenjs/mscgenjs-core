var assert = require("assert");
var wrap   = require("../../../render/textutensils/wrap");

describe('render/textutensils/wrap', () => {
    describe('#wrap(x, 10) - string with spaces', () => {
        var lWrapThis = "Aap noot mies wim zus jet teun vuur gijs lam kees bok weide does hok duif schapen.";
        var lWrapAry = wrap.wrap(lWrapThis, 10);

        test('should break up in 8 pieces', () => {
            assert.equal(lWrapAry.length, 8);
        });
        test('should have "Aap noot" in the first line', () => {
            assert.equal(lWrapAry[0], "Aap noot");
        });
        test('should have "schapen." as the last line', () => {
            assert.equal(lWrapAry[lWrapAry.length - 1], "schapen.");
        });
    });

    describe('#wrap(x, 10) - string without spaces', () => {
        var lWrapSpaceless = "Aap_noot_mies_wim_zus_jet_teun_vuur_gijs_lam_kees_bok_weide_does_hok_duif_schapen.";
        var lWrapSpacelessAry = wrap.wrap(lWrapSpaceless, 10);

        test('should break up in 9 pieces', () => {
            assert.equal(lWrapSpacelessAry.length, 9);
        });
        test('should have "Aap_noot_m" in the first line', () => {
            assert.equal(lWrapSpacelessAry[0], "Aap_noot_m");
        });
        test('should have "schapen." as the last line', () => {
            assert.equal(lWrapSpacelessAry[lWrapSpacelessAry.length - 1], "n.");
        });

    });

    describe('#wrap(x, 10) - empty string', () => {
        var lEmptyString = "";
        var lEmptyStringAry = wrap.wrap(lEmptyString, 10);

        test('should break up in 1 piece', () => {
            assert.equal(lEmptyStringAry.length, 1);
        });
        test('should have the empty string in its only component', () => {
            assert.equal(lEmptyStringAry[0], "");
        });
    });

    describe('#wrap(x, 100) - string with spaces', () => {
        var lWrapThis = "Aap noot mies wim zus jet teun vuur gijs lam kees bok weide does hok duif schapen.";
        var lWrapAry = wrap.wrap(lWrapThis, 100);

        test('should break up in 1 piece', () => {
            assert.equal(lWrapAry.length, 1);
        });
        test('should have the complete lWrapThis in the first line', () => {
            assert.equal(lWrapAry[0], lWrapThis);
        });
    });

});
