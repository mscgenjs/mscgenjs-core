var expect           = require("chai").expect;
var normalizeoptions = require("../../../render/astmassage/normalizeoptions");


describe('render/astmassage/normalizeoptions', function() {
    it('normalize no options to the default values for wordwrap* stuff', function() {
        expect(
            normalizeoptions()
        ).to.deep.equal({
            wordwraparcs: false,
            wordwrapentities: true,
            wordwrapboxes: true
        });
    });

    it('normalize empty options to the default values for wordwrap* stuff', function() {
        expect(
            normalizeoptions({})
        ).to.deep.equal({
            wordwraparcs: false,
            wordwrapentities: true,
            wordwrapboxes: true
        });
    });

    it('normalize options to the default values for wordwrap* stuff - leave the rest alone', function() {
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
    });

    it('only take the default values for wordrap* things if they weren\'t in the source', function() {
        expect(
            normalizeoptions({
                wordwrapentities: false
            })
        ).to.deep.equal({
            wordwraparcs: false,
            wordwrapentities: false,
            wordwrapboxes: true
        });
    });
});
