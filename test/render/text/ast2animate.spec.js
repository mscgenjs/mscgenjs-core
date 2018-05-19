const fs          = require("fs");
const path        = require("path");
const ast2animate = require("../../../render/text/ast2animate");
const parser      = require("../../../parse/xuparser");
const fix         = require("../../astfixtures.json");
const tst         = require("../../testutensils");

describe('render/text/ast2ani', () => {
    const astCheatSheet0 = {
        "meta": {
            "extendedOptions": false,
            "extendedArcTypes": false,
            "extendedFeatures": false
        },
        "entities" : [{
            "name" : "a"
        }, {
            "name" : "b"
        }],
        arcs : [
            [{"kind": "|||"}],
            [{"kind": "|||"}],
            [{"kind": "|||"}],
            [{"kind": "|||"}],
            [{"kind": "|||"}],
            [{"kind": "|||"}],
            [{"kind": "|||"}],
            [{"kind": "|||"}],
            [{"kind": "|||"}],
            [{"kind": "|||"}],
            [{"kind": "|||"}],
            [{"kind": "|||"}]
        ]
    };
    const astCheatSheet1 = {
        "meta": {
            "extendedOptions": false,
            "extendedArcTypes": false,
            "extendedFeatures": false
        },
        "entities" : [{
            "name" : "a"
        }, {
            "name" : "b"
        }],
        "arcs" : [[{
            "kind" : "->",
            "from" : "a",
            "to" : "b",
            "label" : "a -> b  (signal)"
        }],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}]
        ]
    };
    const astCheatSheet2 = {
        "meta": {
            "extendedOptions": false,
            "extendedArcTypes": false,
            "extendedFeatures": false
        },
        "entities" : [{
            "name" : "a"
        }, {
            "name" : "b"
        }],
        "arcs" : [[{
            "kind" : "->",
            "from" : "a",
            "to" : "b",
            "label" : "a -> b  (signal)"
        }], [{
            "kind" : "=>",
            "from" : "a",
            "to" : "b",
            "label" : "a => b  (method)"
        }],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}]
        ]
    };
    const astCheatSheet3 = {
        "meta": {
            "extendedOptions": false,
            "extendedArcTypes": false,
            "extendedFeatures": false
        },
        "entities" : [{
            "name" : "a"
        }, {
            "name" : "b"
        }],
        "arcs" : [[{
            "kind" : "->",
            "from" : "a",
            "to" : "b",
            "label" : "a -> b  (signal)"
        }], [{
            "kind" : "=>",
            "from" : "a",
            "to" : "b",
            "label" : "a => b  (method)"
        }], [{
            "kind" : ">>",
            "from" : "b",
            "to" : "a",
            "label" : "b >> a  (return value)"
        }],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}],
        [{"kind": "|||"}]
        ]
    };

    /*
*/
    describe('#getLength()', () => {
        test('should return a length of 1 for astEmpty', () => {
            const ani = new ast2animate.FrameFactory();
            ani.init(fix.astEmpty);
            expect(ani.getPosition()).toBe(0);
            expect(ani.getLength()).toBe(1);
        });
        test('should return a length of 2 for astSimple', () => {
            const ani = new ast2animate.FrameFactory();
            ani.init(fix.astSimple);
            expect(ani.getLength()).toBe(2);
        });
        test('should return a length of 15 for astCheatSheet', () => {
            const ani = new ast2animate.FrameFactory();
            ani.init(fix.astCheatSheet);
            expect(ani.getPosition()).toBe(0);
            expect(ani.getLength()).toBe(15);
        });
    });

    describe('#getFrame(0)', () => {
        test('should return astEmpty for astEmpty', () => {
            const ani = new ast2animate.FrameFactory(fix.astEmpty);
            expect(ani.getFrame(0)).toEqual(fix.astEmpty);
        });
        test('should return entities for astSimple', () => {
            const ani = new ast2animate.FrameFactory(fix.astSimple);
            const astSimpleEntitiesOnly = {
                "meta": {
                    "extendedOptions": false,
                    "extendedArcTypes": false,
                    "extendedFeatures": false
                },
                "entities" : [{
                    "name" : "a"
                }, {
                    "name" : "b space"
                }],
                arcs : [[{"kind": "|||"}]]
            };
            expect(ani.getFrame(0)).toEqual(astSimpleEntitiesOnly);
        });

        test('should return entities for astCheatSheet', () => {
            const ani = new ast2animate.FrameFactory(fix.astCheatSheet);
            expect(ani.getFrame(0)).toEqual(astCheatSheet0);
        });

        test('should return entities for astCheatSheet for length < 0', () => {
            const ani = new ast2animate.FrameFactory(fix.astCheatSheet);
            expect(ani.getFrame(-481)).toEqual(astCheatSheet0);
        });

    });

    describe('#getFrame(getLength())', () => {
        test('should return astEmpty for astEmpty', () => {
            const ani = new ast2animate.FrameFactory(fix.astEmpty);
            expect(ani.getFrame(ani.getLength())).toEqual(fix.astEmpty);
        });
        test('should return astSimple for astSimple', () => {
            const ani = new ast2animate.FrameFactory(fix.astSimple);
            expect(ani.getFrame(ani.getLength())).toEqual(fix.astSimple);
        });
        test('should return astCheatSheet for astCheatSheet', () => {
            const ani = new ast2animate.FrameFactory(fix.astCheatSheet);
            expect(ani.getFrame(ani.getLength())).toEqual(fix.astCheatSheet);
        });
        test(
            'should return astCheatSheet for astCheatSheet and length === somethingbig',
            () => {
                const ani = new ast2animate.FrameFactory(fix.astCheatSheet, true);
                expect(ani.getFrame(481)).toEqual(fix.astCheatSheet);
            }
        );
    });

    describe('#getFrame()', () => {

        const ani = new ast2animate.FrameFactory(fix.astCheatSheet, true);

        test(
            'should return entities and first arc from astCheatSheet for astCheatSheet',
            () => {
                expect(ani.getFrame(1)).toEqual(astCheatSheet1);
            }
        );

        test(
            'should return entities and first three arcs from astCheatSheet for astCheatSheet',
            () => {
                expect(ani.getFrame(3)).toEqual(astCheatSheet3);
            }
        );

        test(
            'should return entities and first two arcs from astCheatSheet for astCheatSheet',
            () => {
                expect(ani.getFrame(2)).toEqual(astCheatSheet2);
            }
        );
    });


    describe('#home, #end, #inc, #dec, #getPosition, #getCurrentFrame #getPercentage', () => {
        const ani = new ast2animate.FrameFactory(fix.astCheatSheet, false);
        test(
            'getCurrentFrame should return astCheatSheet after call to end()',
            () => {
                ani.end();
                expect(ani.getPosition()).toBe(15);
                expect(ani.getPercentage()).toBe(100);
                expect(ani.getCurrentFrame()).toEqual(fix.astCheatSheet);
            }
        );
        test(
            'getCurrentFrame should return astCheatSheet1 after end() and 14 calls to dec()',
            () => {
                ani.end();
                ani.dec(14);
                expect(ani.getPosition()).toBe(1);
                expect(ani.getPercentage()).toBe(100 / 15);
                expect(ani.getCurrentFrame()).toEqual(astCheatSheet1);
            }
        );
        test(
            'getCurrentFrame should return astCheatSheet2 after call to home() and two calls to inc()',
            () => {
                ani.home();
                ani.inc(2);
                expect(ani.getPosition()).toBe(2);
                expect(ani.getPercentage()).toBe(200 / 15);
                expect(ani.getCurrentFrame()).toEqual(astCheatSheet2);
            }
        );
        test(
            'getCurrentFrame should return entities only after call to home()',
            () => {
                ani.home();
                ani.inc();
                ani.dec();
                expect(ani.getPosition()).toBe(0);
                expect(ani.getPercentage()).toBe(0);
                expect(ani.getCurrentFrame()).toEqual(astCheatSheet0);
            }
        );
    });

    describe('inline expressions', () => {
        const lTextFromFile = fs.readFileSync(
            path.join(__dirname, '../../fixtures/simpleXuSample.xu'),
            {"encoding":"utf8"}
        );
        const lAST = parser.parse(lTextFromFile.toString());

        const ani = new ast2animate.FrameFactory(lAST, false);

        test(
            'getLength for inline expressions takes expression length into account',
            () => {
                expect(ani.getLength()).toBe(10);
            }
        );

        test('getNoRows takes inline expressions length into account', () => {
            expect(ani.getNoRows()).toBe(9);
        });

        test('produces the right frames - 0', () => {
            tst.assertequalToFileJSON(path.join(__dirname, '../../fixtures/xuframe00.json'), ani.getFrame(0));
        });

        test('produces the right frames - 1', () => {
            tst.assertequalToFileJSON(path.join(__dirname, '../../fixtures/xuframe01.json'), ani.getFrame(1));
        });

        test('produces the right frames - 2', () => {
            tst.assertequalToFileJSON(path.join(__dirname, '../../fixtures/xuframe02.json'), ani.getFrame(2));
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
