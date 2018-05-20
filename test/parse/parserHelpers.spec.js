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

describe('parserHelpers.checkForUndeclaredEntities', () => {
    test("throws EntityNotDefinedError when to or from not in entities", () => {
        expect(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [],
                    [[{from: 'doesnotexist', kind: '=>', to: '*'}]]
                )
        ).toThrow(parserHelpers.EntityNotDefinedError);
        expect(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [],
                    [[{from: '*', kind: '<=', to: 'doesnotexist'}]]
                )
        ).toThrow(parserHelpers.EntityNotDefinedError);
        expect(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [],
                    [[{from: 'doesnotexist', kind: '->', to: 'doesnotexist either'}]]
                )
        ).toThrow(parserHelpers.EntityNotDefinedError);
    });

    test("does not throw when to and from are okidoki entities", () => {
        expect(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [{name:'this entity exists'}, {name:'this entity exists too'}],
                    [[{from: 'this entity exists', kind: '=>', to: 'this entity exists too'}]]
                )
        ).not.toThrow();
        expect(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [{name:'this entity exists'}, {name:'this entity exists too'}],
                    [[{from: 'this entity exists', kind: '=>', to: '*'}]]
                )
        ).not.toThrow();
        expect(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [{name:'this entity exists'}, {name:'this entity exists too'}],
                    [[{from: '*', kind: '<-', to: 'this entity exists'}]]
                )
        ).not.toThrow();
    });
});

describe('parserHelpers.getMetaInfo', () => {
    const lNoExtendedFeatures = {"extendedArcTypes": false, "extendedFeatures": false, "extendedOptions": false};
    const lExtendedOptions    = {"extendedArcTypes": false, "extendedFeatures": true,  "extendedOptions": true};
    const lExtendedArcTypes   = {"extendedArcTypes": true,  "extendedFeatures": true,  "extendedOptions": false};
    const lFullOrgan          = {"extendedArcTypes": true,  "extendedFeatures": true,  "extendedOptions": true};

    test('boundary values deliver meta info with everything on false', () => {
        expect(parserHelpers.getMetaInfo()).toEqual(lNoExtendedFeatures);
        expect(parserHelpers.getMetaInfo(null, null)).toEqual(lNoExtendedFeatures);
        expect(parserHelpers.getMetaInfo(undefined, undefined)).toEqual(lNoExtendedFeatures);
        expect(parserHelpers.getMetaInfo({}, [])).toEqual(lNoExtendedFeatures);
    });

    test('standard mscgen options deliver meta info with everything on false', () => {
        expect(parserHelpers.getMetaInfo({wordwraparcs:true})).toEqual(lNoExtendedFeatures);
        expect(parserHelpers.getMetaInfo({width:481})).toEqual(lNoExtendedFeatures);
    });

    test('no options but regular arcs deliver meta info with everything on false', () => {
        expect(parserHelpers.getMetaInfo({}, require('../fixtures/astemptylinesinboxes.json').arcs)).toEqual(lNoExtendedFeatures);
        expect(parserHelpers.getMetaInfo({}, require('../fixtures/test01_all_possible_arcs_mscgen.json').arcs)).toEqual(lNoExtendedFeatures);
    });

    test('extended options deliver meta info with options & features on true', () => {
        expect(parserHelpers.getMetaInfo({watermark:"extended!!"})).toEqual(lExtendedOptions);
        expect(parserHelpers.getMetaInfo({width:"auto"})).toEqual(lExtendedOptions);
    });

    test('no options but extended arc types deliver meta info arctypes & features on true', () => {
        expect(parserHelpers.getMetaInfo({}, require('../fixtures/bumpingboxes.json').arcs)).toEqual(lExtendedArcTypes);
        expect(parserHelpers.getMetaInfo({}, require('../fixtures/test01_all_possible_arcs.json').arcs)).toEqual(lExtendedArcTypes);
    });

    test('extended options extended arc types deliver meta info with everything on true', () => {
        expect(parserHelpers.getMetaInfo({wordwrapentities: true}, require('../fixtures/bumpingboxes.json').arcs)).toEqual(lFullOrgan);
        expect(parserHelpers.getMetaInfo({wordwrapboxes: true}, require('../fixtures/test01_all_possible_arcs.json').arcs)).toEqual(lFullOrgan);
    });
});
