const parserHelpers = require('../../parse/parserHelpers');

describe('parserHelpers.nameValue2Option', () => {
    test('Name and value return a name/ value object', () => {
        expect(
            parserHelpers.nameValue2Option('thisisaname', 'thisisavalue')
        ).toEqual({thisisaname: 'thisisavalue'});
    });

    test('Name and value return a name/ value object; lowercasing the name', () => {
        expect(
            parserHelpers.nameValue2Option('THISISANAME', 'thisisavalue')
        ).toEqual({thisisaname: 'thisisavalue'});
    });
});

describe('parserHelpers.flattenBoolean', () => {
    test('truthy strings equal true', () => {
        expect(parserHelpers.flattenBoolean('on')).toBe(true);
        expect(parserHelpers.flattenBoolean('true')).toBe(true);
        expect(parserHelpers.flattenBoolean('1')).toBe(true);
    });

    test('non-truthy strings equal false', () => {
        expect(parserHelpers.flattenBoolean('off')).toBe(false);
        expect(parserHelpers.flattenBoolean('false')).toBe(false);
        expect(parserHelpers.flattenBoolean('0')).toBe(false);
        expect(parserHelpers.flattenBoolean('blabbermouth')).toBe(false);
        expect(parserHelpers.flattenBoolean('')).toBe(false);
    });
});

describe('parserHelpers.entityExists', () => {
    const lEntitiesFixture = [
        {name: "actor"},
        {name: "front end system"},
        {name: "API layer"},
        {name: "back end system"}
    ];

    test('returns true if an entity exists with the given name', () => {
        expect(parserHelpers.entityExists(lEntitiesFixture, "API layer")).toBe(true);
        expect(parserHelpers.entityExists(lEntitiesFixture, "actor")).toBe(true);
    });

    test('returns false if no entity exists with the given name', () => {
        expect(parserHelpers.entityExists(lEntitiesFixture, "SOAP layer")).toBe(false);
        expect(parserHelpers.entityExists(lEntitiesFixture, "user")).toBe(false);
        expect(parserHelpers.entityExists(lEntitiesFixture, "")).toBe(false);
    });

    test('returns true the name of the entity is the speical "*" -> all entities', () => {
        expect(parserHelpers.entityExists(lEntitiesFixture, "*")).toBe(true);
    });

    test('returns true if the name of the entity is not defined', () => {
        expect(parserHelpers.entityExists(lEntitiesFixture)).toBe(true);
        /* eslint no-undefined:0 */
        /* we want to test this explicitly - hence the exception for allowing undefined here */
        expect(parserHelpers.entityExists(lEntitiesFixture, undefined)).toBe(true);
    });
});


describe('parserHelpers.isMscGenKeyword', () => {
    test('returns true for MscGen keywords', () => {
        expect(parserHelpers.isMscGenKeyword('note')).toBe(true);
        expect(parserHelpers.isMscGenKeyword('rbox')).toBe(true);
        expect(parserHelpers.isMscGenKeyword('textcolor')).toBe(true);
        expect(parserHelpers.isMscGenKeyword('textcolour')).toBe(true);
    });

    test('returns false for things that aren\'t MscGen keywords', () => {
        expect(parserHelpers.isMscGenKeyword('snok')).toBe(false);
        expect(parserHelpers.isMscGenKeyword('watermark')).toBe(false);
        expect(parserHelpers.isMscGenKeyword('')).toBe(false);
    });

    test('returns false for boundary values (wrong data type, null, empty, ...)', () => {
        expect(parserHelpers.isMscGenKeyword()).toBe(false);
        expect(parserHelpers.isMscGenKeyword(null)).toBe(false);
        expect(parserHelpers.isMscGenKeyword(undefined)).toBe(false);
        expect(parserHelpers.isMscGenKeyword(666)).toBe(false);
        expect(parserHelpers.isMscGenKeyword(true)).toBe(false);
        expect(parserHelpers.isMscGenKeyword('')).toBe(false);
    });
});