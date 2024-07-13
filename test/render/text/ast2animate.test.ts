import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
import fs from "fs";
import path from "path";
import {FrameFactory} from "../../../src/render/text/ast2animate";
import * as parser from "../../../src/parse/xuparser";
import * as tst from "../../testutensils";

const fix         = require("../../astfixtures.json");

describe("render/text/ast2ani", () => {
    const astCheatSheet0 = {
        meta: {
            extendedOptions: false,
            extendedArcTypes: false,
            extendedFeatures: false,
        },
        entities : [{
            name : "a",
        }, {
            name : "b",
        }],
        arcs : [
            [{kind: "|||"}],
            [{kind: "|||"}],
            [{kind: "|||"}],
            [{kind: "|||"}],
            [{kind: "|||"}],
            [{kind: "|||"}],
            [{kind: "|||"}],
            [{kind: "|||"}],
            [{kind: "|||"}],
            [{kind: "|||"}],
            [{kind: "|||"}],
            [{kind: "|||"}],
        ],
    };
    const astCheatSheet1 = {
        meta: {
            extendedOptions: false,
            extendedArcTypes: false,
            extendedFeatures: false,
        },
        entities : [{
            name : "a",
        }, {
            name : "b",
        }],
        arcs : [[{
            kind : "->",
            from : "a",
            to : "b",
            label : "a -> b  (signal)",
        }],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        ],
    };
    const astCheatSheet2 = {
        meta: {
            extendedOptions: false,
            extendedArcTypes: false,
            extendedFeatures: false,
        },
        entities : [{
            name : "a",
        }, {
            name : "b",
        }],
        arcs : [[{
            kind : "->",
            from : "a",
            to : "b",
            label : "a -> b  (signal)",
        }], [{
            kind : "=>",
            from : "a",
            to : "b",
            label : "a => b  (method)",
        }],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        ],
    };
    const astCheatSheet3 = {
        meta: {
            extendedOptions: false,
            extendedArcTypes: false,
            extendedFeatures: false,
        },
        entities : [{
            name : "a",
        }, {
            name : "b",
        }],
        arcs : [[{
            kind : "->",
            from : "a",
            to : "b",
            label : "a -> b  (signal)",
        }], [{
            kind : "=>",
            from : "a",
            to : "b",
            label : "a => b  (method)",
        }], [{
            kind : ">>",
            from : "b",
            to : "a",
            label : "b >> a  (return value)",
        }],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        [{kind: "|||"}],
        ],
    };

    /*
*/
    describe("#getLength()", () => {
        it("should return a length of 1 for astEmpty", () => {
            const ani = new FrameFactory();
            ani.init(fix.astEmpty);
            deepEqual(ani.getPosition(), 0);
            deepEqual(ani.getLength(), 1);
        });
        it("should return a length of 2 for astSimple", () => {
            const ani = new FrameFactory();
            ani.init(fix.astSimple);
            deepEqual(ani.getLength(), 2);
        });
        it("should return a length of 15 for astCheatSheet", () => {
            const ani = new FrameFactory();
            ani.init(fix.astCheatSheet);
            deepEqual(ani.getPosition(), 0);
            deepEqual(ani.getLength(), 15);
        });
    });

    describe("#getFrame(0)", () => {
        it("should return astEmpty for astEmpty", () => {
            const ani = new FrameFactory(fix.astEmpty);
            deepEqual(ani.getFrame(0), fix.astEmpty);
        });
        it("should return entities for astSimple", () => {
            const ani = new FrameFactory(fix.astSimple);
            const astSimpleEntitiesOnly = {
                meta: {
                    extendedOptions: false,
                    extendedArcTypes: false,
                    extendedFeatures: false,
                },
                entities : [{
                    name : "a",
                }, {
                    name : "b space",
                }],
                arcs : [[{kind: "|||"}]],
            };
            deepEqual(ani.getFrame(0), astSimpleEntitiesOnly);
        });

        it("should return entities for astCheatSheet", () => {
            const ani = new FrameFactory(fix.astCheatSheet);
            deepEqual(ani.getFrame(0), astCheatSheet0);
        });

        it("should return entities for astCheatSheet for length < 0", () => {
            const ani = new FrameFactory(fix.astCheatSheet);
            deepEqual(ani.getFrame(-481), astCheatSheet0);
        });

    });

    describe("#getFrame(getLength())", () => {
        it("should return astEmpty for astEmpty", () => {
            const ani = new FrameFactory(fix.astEmpty);
            deepEqual(ani.getFrame(ani.getLength()), fix.astEmpty);
        });
        it("should return astSimple for astSimple", () => {
            const ani = new FrameFactory(fix.astSimple);
            deepEqual(ani.getFrame(ani.getLength()), fix.astSimple);
        });
        it("should return astCheatSheet for astCheatSheet", () => {
            const ani = new FrameFactory(fix.astCheatSheet);
            deepEqual(ani.getFrame(ani.getLength()), fix.astCheatSheet);
        });
        it(
            "should return astCheatSheet for astCheatSheet and length === somethingbig",
            () => {
                const ani = new FrameFactory(fix.astCheatSheet, true);
                deepEqual(ani.getFrame(481), fix.astCheatSheet);
            },
        );
    });

    describe("#getFrame()", () => {

        const ani = new FrameFactory(fix.astCheatSheet, true);

        it(
            "should return entities and first arc from astCheatSheet for astCheatSheet",
            () => {
                deepEqual(ani.getFrame(1), astCheatSheet1);
            },
        );

        it(
            "should return entities and first three arcs from astCheatSheet for astCheatSheet",
            () => {
                deepEqual(ani.getFrame(3), astCheatSheet3);
            },
        );

        it(
            "should return entities and first two arcs from astCheatSheet for astCheatSheet",
            () => {
                deepEqual(ani.getFrame(2), astCheatSheet2);
            },
        );
    });

    describe("#home, #end, #inc, #dec, #getPosition, #getCurrentFrame #getPercentage", () => {
        const ani = new FrameFactory(fix.astCheatSheet, false);
        it(
            "getCurrentFrame should return astCheatSheet after call to end()",
            () => {
                ani.end();
                deepEqual(ani.getPosition(), 15);
                deepEqual(ani.getPercentage(), 100);
                deepEqual(ani.getCurrentFrame(), fix.astCheatSheet);
            },
        );
        it(
            "getCurrentFrame should return astCheatSheet1 after end() and 14 calls to dec()",
            () => {
                ani.end();
                ani.dec(14);
                deepEqual(ani.getPosition(), 1);
                deepEqual(ani.getPercentage(), 100 / 15);
                deepEqual(ani.getCurrentFrame(), astCheatSheet1);
            },
        );
        it(
            "getCurrentFrame should return astCheatSheet2 after call to home() and two calls to inc()",
            () => {
                ani.home();
                ani.inc(2);
                deepEqual(ani.getPosition(), 2);
                deepEqual(ani.getPercentage(), 200 / 15);
                deepEqual(ani.getCurrentFrame(), astCheatSheet2);
            },
        );
        it(
            "getCurrentFrame should return entities only after call to home()",
            () => {
                ani.home();
                ani.inc();
                ani.dec();
                deepEqual(ani.getPosition(), 0);
                deepEqual(ani.getPercentage(), 0);
                deepEqual(ani.getCurrentFrame(), astCheatSheet0);
            },
        );
    });

    describe("inline expressions", () => {
        const lTextFromFile = fs.readFileSync(
            path.join(__dirname, "../../fixtures/simpleXuSample.xu"),
            {encoding: "utf8"},
        );
        const lAST = parser.parse(lTextFromFile.toString());

        const ani = new FrameFactory(lAST, false);

        it(
            "getLength for inline expressions takes expression length into account",
            () => {
                deepEqual(ani.getLength(), 10);
            },
        );

        it("getNoRows takes inline expressions length into account", () => {
            deepEqual(ani.getNoRows(), 9);
        });

        it("produces the right frames - 0", () => {
            tst.assertequalToFileJSON(path.join(__dirname, "../../fixtures/xuframe00.json"), ani.getFrame(0));
        });

        it("produces the right frames - 1", () => {
            tst.assertequalToFileJSON(path.join(__dirname, "../../fixtures/xuframe01.json"), ani.getFrame(1));
        });

        it("produces the right frames - 2", () => {
            tst.assertequalToFileJSON(path.join(__dirname, "../../fixtures/xuframe02.json"), ani.getFrame(2));
        });

        /*
        it('produces the right frames - 3', function(){
            tst.assertequalToFileJSON('../../xuframe03.json', ani.getFrame(3));
        });

        it('produces the right frames - last', function(){
            ani.end();
            tst.assertequalToFileJSON('../../simpleXuSample.json', ani.getCurrentFrame());
        });
        */
    });
});
