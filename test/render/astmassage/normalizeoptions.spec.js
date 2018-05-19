var expect           = require("chai").expect;
var normalizeoptions = require("../../../render/astmassage/normalizeoptions");


describe('render/astmassage/normalizeoptions', () => {
    test(
        'normalize no options to the default values for wordwrap* stuff',
        () => {
            expect(
                normalizeoptions()
            ).to.deep.equal({
                wordwraparcs: false,
                wordwrapentities: true,
                wordwrapboxes: true
            });
        }
    );

    test(
        'normalize empty options to the default values for wordwrap* stuff',
        () => {
            expect(
                normalizeoptions({})
            ).to.deep.equal({
                wordwraparcs: false,
                wordwrapentities: true,
                wordwrapboxes: true
            });
        }
    );

    test(
        'normalize options to the default values for wordwrap* stuff - leave the rest alone',
        () => {
            expect(
                normalizeoptions({
                    hscale: 3.14,
                    watermark: "shark wheels"
                })
            ).to.deep.equal({
                hscale: 3.14,
                watermark: "shark wheels",
                wordwraparcs: false,
                wordwrapentities: true,
                wordwrapboxes: true
            });
        }
    );

    test(
        'only take the default values for wordrap* things if they weren\'t in the source',
        () => {
            expect(
                normalizeoptions({
                    wordwrapentities: false
                })
            ).to.deep.equal({
                wordwraparcs: false,
                wordwrapentities: false,
                wordwrapboxes: true
            });
        }
    );
});
