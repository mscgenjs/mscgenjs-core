const normalizeOptions = require('../../src/main/normalizeoptions');

describe('normalizeOptions', () => {
    test('Boundary - no parameters', () => {
        expect(
            normalizeOptions()
        ).toEqual({
            inputType              : "mscgen",
            elementId              : "__svg",
            window                 : window,
            includeSource          : true,
            source                 : undefined,
            styleAdditions         : null,
            additionalTemplate     : "basic",
            mirrorEntitiesOnBottom : false,
            regularArcTextVerticalAlignment: "middle"
        });
    });

    test('Boundary - empty object as first parameter', () => {
        expect(
            normalizeOptions({})
        ).toEqual({
            inputType              : "mscgen",
            elementId              : "__svg",
            window                 : window,
            includeSource          : true,
            source                 : undefined,
            styleAdditions         : null,
            additionalTemplate     : "basic",
            mirrorEntitiesOnBottom : false,
            regularArcTextVerticalAlignment: "middle"
        });
    });

    test('Boundary - only "includeSource" is false', () => {
        expect(
            normalizeOptions({includeSource:false})
        ).toEqual({
            inputType              : "mscgen",
            elementId              : "__svg",
            window                 : window,
            includeSource          : false,
            source                 : null,
            styleAdditions         : null,
            additionalTemplate     : "basic",
            mirrorEntitiesOnBottom : false,
            regularArcTextVerticalAlignment: "middle"
        });
    });
});

/* global window */
/* eslint no-undefined:0 */
/* eslint object-shorthand:0 */
