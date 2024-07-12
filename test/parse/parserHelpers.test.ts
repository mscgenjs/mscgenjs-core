import * as parserHelpers from "../../src/parse/parserHelpers";
import { describe, it } from "node:test";
import  { deepEqual, throws, doesNotThrow } from "node:assert/strict";

describe("parserHelpers.nameValue2Option", () => {
    it("Name and value return a name/ value object", () => {
        deepEqual(
            parserHelpers.nameValue2Option("thisisaname", "thisisavalue"),
        {thisisaname: "thisisavalue"});
    });

    it("Name and value return a name/ value object; lowercasing the name", () => {
        deepEqual(
            parserHelpers.nameValue2Option("THISISANAME", "thisisavalue"),
        {thisisaname: "thisisavalue"});
    });
});

describe("parserHelpers.flattenBoolean", () => {
    it("truthy strings equal true", () => {
        deepEqual(parserHelpers.flattenBoolean("on"),true);
        deepEqual(parserHelpers.flattenBoolean("true"),true);
        deepEqual(parserHelpers.flattenBoolean("1"),true);
    });

    it("non-truthy strings equal false", () => {
        deepEqual(parserHelpers.flattenBoolean("off"),false);
        deepEqual(parserHelpers.flattenBoolean("false"),false);
        deepEqual(parserHelpers.flattenBoolean("0"),false);
        deepEqual(parserHelpers.flattenBoolean("blabbermouth"),false);
        deepEqual(parserHelpers.flattenBoolean(""),false);
    });
});

describe("parserHelpers.entityExists", () => {
    const lEntitiesFixture = [
        {name: "actor"},
        {name: "front end system"},
        {name: "API layer"},
        {name: "back end system"},
    ];

    it("returns true if an entity exists with the given name", () => {
        deepEqual(parserHelpers.entityExists(lEntitiesFixture, "API layer"),true);
        deepEqual(parserHelpers.entityExists(lEntitiesFixture, "actor"),true);
    });

    it("returns false if no entity exists with the given name", () => {
        deepEqual(parserHelpers.entityExists(lEntitiesFixture, "SOAP layer"),false);
        deepEqual(parserHelpers.entityExists(lEntitiesFixture, "user"),false);
        deepEqual(parserHelpers.entityExists(lEntitiesFixture, ""),false);
    });

    it('returns true the name of the entity is the speical "*" -> all entities', () => {
        deepEqual(parserHelpers.entityExists(lEntitiesFixture, "*"),true);
    });

    it("returns true if the name of the entity is not defined", () => {
        deepEqual(parserHelpers.entityExists(lEntitiesFixture),true);
        /* tslint no-undefined:0 */
        /* we want to it this explicitly - hence the exception for allowing undefined here */
        deepEqual(parserHelpers.entityExists(lEntitiesFixture, undefined),true);
    });
});

describe("parserHelpers.isMscGenKeyword", () => {
    it("returns true for MscGen keywords", () => {
        deepEqual(parserHelpers.isMscGenKeyword("note"),true);
        deepEqual(parserHelpers.isMscGenKeyword("rbox"),true);
        deepEqual(parserHelpers.isMscGenKeyword("textcolor"),true);
        deepEqual(parserHelpers.isMscGenKeyword("textcolour"),true);
    });

    it("returns false for things that aren't MscGen keywords", () => {
        deepEqual(parserHelpers.isMscGenKeyword("snok"),false);
        deepEqual(parserHelpers.isMscGenKeyword("watermark"),false);
        deepEqual(parserHelpers.isMscGenKeyword(""),false);
    });

    it("returns false for boundary values (wrong data type, null, empty, ...)", () => {
        deepEqual(parserHelpers.isMscGenKeyword(),false);
        deepEqual(parserHelpers.isMscGenKeyword(null),false);
        deepEqual(parserHelpers.isMscGenKeyword(undefined),false);
        deepEqual(parserHelpers.isMscGenKeyword(666),false);
        deepEqual(parserHelpers.isMscGenKeyword(true),false);
        deepEqual(parserHelpers.isMscGenKeyword(""),false);
    });
});

describe("parserHelpers.checkForUndeclaredEntities", () => {
    it("throws EntityNotDefinedError when to or from not in entities", () => {
        throws(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [],
                    [[{from: "doesnotexist", kind: "=>", to: "*"}]],
                ),
         parserHelpers.EntityNotDefinedError);
        throws(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [],
                    [[{from: "*", kind: "<=", to: "doesnotexist"}]],
                ),
        parserHelpers.EntityNotDefinedError);
        throws(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [],
                    [[{from: "doesnotexist", kind: "->", to: "doesnotexist either"}]],
                ),
        parserHelpers.EntityNotDefinedError);
    });

    it("does not throw when to and from are okidoki entities", () => {
        doesNotThrow(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [{name: "this entity exists"}, {name: "this entity exists too"}],
                    [[{from: "this entity exists", kind: "=>", to: "this entity exists too"}]],
                ),
        );
        doesNotThrow(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [{name: "this entity exists"}, {name: "this entity exists too"}],
                    [[{from: "this entity exists", kind: "=>", to: "*"}]],
                ),
        );
        doesNotThrow(
            () =>
                parserHelpers.checkForUndeclaredEntities(
                    [{name: "this entity exists"}, {name: "this entity exists too"}],
                    [[{from: "*", kind: "<-", to: "this entity exists"}]],
                ),
        );
    });
});

describe("parserHelpers.getMetaInfo", () => {
    const lNoExtendedFeatures = {extendedArcTypes: false, extendedFeatures: false, extendedOptions: false};
    const lExtendedOptions    = {extendedArcTypes: false, extendedFeatures: true,  extendedOptions: true};
    const lExtendedArcTypes   = {extendedArcTypes: true,  extendedFeatures: true,  extendedOptions: false};
    const lFullOrgan          = {extendedArcTypes: true,  extendedFeatures: true,  extendedOptions: true};

    it("boundary values deliver meta info with everything on false", () => {
        deepEqual(parserHelpers.getMetaInfo(), lNoExtendedFeatures);
        deepEqual(parserHelpers.getMetaInfo(null, null), lNoExtendedFeatures);
        deepEqual(parserHelpers.getMetaInfo(undefined, undefined), lNoExtendedFeatures);
        deepEqual(parserHelpers.getMetaInfo({}, []), lNoExtendedFeatures);
    });

    it("standard mscgen options deliver meta info with everything on false", () => {
        deepEqual(parserHelpers.getMetaInfo({wordwraparcs: true}), lNoExtendedFeatures);
        deepEqual(parserHelpers.getMetaInfo({width: 481}), lNoExtendedFeatures);
    });

    it("no options but regular arcs deliver meta info with everything on false", () => {
        deepEqual(parserHelpers.getMetaInfo({}, require("../fixtures/astemptylinesinboxes.json").arcs), lNoExtendedFeatures);
        deepEqual(parserHelpers.getMetaInfo({}, require("../fixtures/test01_all_possible_arcs_mscgen.json").arcs), lNoExtendedFeatures);
    });

    it("extended options deliver meta info with options & features on true", () => {
        deepEqual(parserHelpers.getMetaInfo({watermark: "extended!!"}), lExtendedOptions);
        deepEqual(parserHelpers.getMetaInfo({width: "auto"}), lExtendedOptions);
    });

    it("no options but extended arc types deliver meta info arctypes & features on true", () => {
        deepEqual(parserHelpers.getMetaInfo({}, require("../fixtures/bumpingboxes.json").arcs), lExtendedArcTypes);
        deepEqual(parserHelpers.getMetaInfo({}, require("../fixtures/test01_all_possible_arcs.json").arcs), lExtendedArcTypes);
    });

    it("extended options extended arc types deliver meta info with everything on true", () => {
        deepEqual(parserHelpers.getMetaInfo({wordwrapentities: true}, require("../fixtures/bumpingboxes.json").arcs), lFullOrgan);
        deepEqual(parserHelpers.getMetaInfo({wordwrapboxes: true}, require("../fixtures/test01_all_possible_arcs.json").arcs), lFullOrgan);
    });
});
