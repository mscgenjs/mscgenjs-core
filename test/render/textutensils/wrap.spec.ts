const wrap   = require("../../../src/render/textutensils/wrap").default;

describe('render/textutensils/wrap', () => {
    describe('#wrap(x, 10) - string with spaces', () => {
        const lWrapThis = "Aap noot mies wim zus jet teun vuur gijs lam kees bok weide does hok duif schapen.";
        const lWrapAry = wrap(lWrapThis, 10);

        test('should break up in 8 pieces', () => {
            expect(lWrapAry.length).toBe(8);
        });
        test('should have "Aap noot" in the first line', () => {
            expect(lWrapAry[0]).toBe("Aap noot");
        });
        test('should have "schapen." as the last line', () => {
            expect(lWrapAry[lWrapAry.length - 1]).toBe("schapen.");
        });
    });

    describe('#wrap(x, 10) - string without spaces', () => {
        const lWrapSpaceless = "Aap_noot_mies_wim_zus_jet_teun_vuur_gijs_lam_kees_bok_weide_does_hok_duif_schapen.";
        const lWrapSpacelessAry = wrap(lWrapSpaceless, 10);

        test('should break up in 9 pieces', () => {
            expect(lWrapSpacelessAry.length).toBe(9);
        });
        test('should have "Aap_noot_m" in the first line', () => {
            expect(lWrapSpacelessAry[0]).toBe("Aap_noot_m");
        });
        test('should have "schapen." as the last line', () => {
            expect(lWrapSpacelessAry[lWrapSpacelessAry.length - 1]).toBe("n.");
        });

    });

    describe('#wrap(x, 10) - empty string', () => {
        const lEmptyString = "";
        const lEmptyStringAry = wrap(lEmptyString, 10);

        test('should break up in 1 piece', () => {
            expect(lEmptyStringAry.length).toBe(1);
        });
        test('should have the empty string in its only component', () => {
            expect(lEmptyStringAry[0]).toBe("");
        });
    });

    describe('#wrap(x, 100) - string with spaces', () => {
        const lWrapThis = "Aap noot mies wim zus jet teun vuur gijs lam kees bok weide does hok duif schapen.";
        const lWrapAry = wrap(lWrapThis, 100);

        test('should break up in 1 piece', () => {
            expect(lWrapAry.length).toBe(1);
        });
        test('should have the complete lWrapThis in the first line', () => {
            expect(lWrapAry[0]).toBe(lWrapThis);
        });
    });

});
