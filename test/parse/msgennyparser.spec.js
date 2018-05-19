/* eslint max-statements:0 */
var fs     = require("fs");
var path   = require("path");
var expect = require("chai").expect;
var parser = require("../../parse/msgennyparser");
var tst    = require("../testutensils");
var fix    = require("../astfixtures.json");

var gCorrectOrderFixture = {
    "precomment":["# A,a, c, d, b, B;", "\n"],
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": true,
        "extendedFeatures": true
    },
    "entities" : [{
        "name" : "A"
    }, {
        "name" : "a"
    }, {
        "name" : "c"
    }, {
        "name" : "d"
    }, {
        "name" : "b"
    }, {
        "name" : "B"
    }],
    "arcs" : [[{
        "kind" : "loop",
        "from" : "A",
        "to" : "B",
        "arcs" : [[{
            "kind" : "alt",
            "from" : "a",
            "to" : "b",
            "arcs" : [[{
                "kind" : "->",
                "from" : "c",
                "to" : "d"
            }], [{
                "kind" : "=>",
                "from" : "c",
                "to" : "B"
            }]]
        }]]
    }]]
};

var gUnicodeEntityFixture = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "序"
        }
    ]
};
var gUnicodeEntityInArcFixture = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "序"
        },
        {
            "name": "🏭"
        },
        {
            "name": "👳"
        }
    ],
    "arcs": [
        [
            {
                "kind": "->",
                "from": "序",
                "to": "序"
            }
        ],
        [
            {
                "kind": "=>>",
                "from": "🏭",
                "to": "👳",
                "label": "👷+🔧"
            }
        ]
    ]
};

describe('parse/msgennyparser', () => {

    describe('#parse()', () => {

        test(
            'should render a simple AST, with two entities auto declared',
            () => {
                var lAST = parser.parse('a => "b space": a simple script;');
                expect(lAST).to.deep.equal(fix.astSimple);
            }
        );
        test('should ignore c++ style one line comments', () => {
            var lAST = parser.parse('a => "b space": a simple script;//ignored');
            expect(lAST).to.deep.equal(fix.astSimple);
        });
        test("should produce an (almost empty) AST for empty input", () => {
            var lAST = parser.parse("");
            expect(lAST).to.deep.equal(fix.astEmpty);
        });
        test(
            "should produce an AST even when non entity arcs are its only content",
            () => {
                var lAST = parser.parse('---:start;...:no entities ...; ---:end;');
                expect(lAST).to.deep.equal(fix.astNoEntities);
            }
        );
        test("should produce lowercase for upper/ mixed case arc kinds", () => {
            var lAST = parser.parse('a NoTE a, b BOX b, c aBox c, d rbOX d;');
            expect(lAST).to.deep.equal(fix.astBoxArcs);
        });
        test("should produce lowercase for upper/ mixed case options", () => {
            var lAST = parser.parse(
                'HSCAle=1.2, widtH=800, ARCGRADIENT="17",woRDwrAParcS="oN", watermark="not in mscgen, available in xù and msgenny";a;'
            );
            expect(lAST).to.deep.equal(fix.astOptions);
        });
        test("should correctly parse naked reals", () => {
            var lAST = parser.parse('HSCAle=481.1337;a;');
            expect(lAST.options.hscale).to.equal("481.1337");
        });
        test("should correctly parse quoted cardinals", () => {
            var lAST = parser.parse('width="481";a;');
            expect(lAST.options.width).to.equal("481");
        });
        test("should correctly parse quoted reals", () => {
            var lAST = parser.parse('width="481.1337";a;');
            expect(lAST.options.width).to.equal("481.1337");
        });
        test("should correctly parse naked cardinals", () => {
            var lAST = parser.parse('width=481;a;');
            expect(lAST.options.width).to.equal("481");
        });
        test("should keep the labeled name of an entity", () => {
            var lAST = parser.parse('"實體": This is the label for 實體;');
            expect(lAST).to.deep.equal(fix.astLabeledEntity);
        });
        test(
            "should generate arcs to all other arcs with both bare and quoted *",
            () => {
                expect(
                    parser.parse('arcgradient=18; ω; ɑ -> * : ɑ -> *; * <- β : * <- β; ɣ <-> * : ɣ <-> *;')
                ).to.deep.equal(fix.astAsteriskBoth);
                expect(
                    parser.parse('arcgradient=18; ω; ɑ -> "*" : ɑ -> *; "*" <- β : * <- β; ɣ <-> "*" : ɣ <-> *;')
                ).to.deep.equal(fix.astAsteriskBoth);
            }
        );
        test(
            'should produce wordwraparcs="true" for true, "true", on, "on", 1 and "1"',
            () => {
                expect(parser.parse('wordwraparcs=true;')).to.deep.equal(fix.astWorwraparcstrue);
                expect(parser.parse('wordwraparcs="true";')).to.deep.equal(fix.astWorwraparcstrue);
                expect(parser.parse('wordwraparcs=on;')).to.deep.equal(fix.astWorwraparcstrue);
                expect(parser.parse('wordwraparcs="on";')).to.deep.equal(fix.astWorwraparcstrue);
                expect(parser.parse('wordwraparcs=1;')).to.deep.equal(fix.astWorwraparcstrue);
                expect(parser.parse('wordwraparcs="1";')).to.deep.equal(fix.astWorwraparcstrue);
                expect(parser.parse('wordwraparcs=false;')).to.deep.equal(fix.astWorwraparcsfalse);
                expect(parser.parse('wordwraparcs="false";')).to.deep.equal(fix.astWorwraparcsfalse);
                expect(parser.parse('wordwraparcs=off;')).to.deep.equal(fix.astWorwraparcsfalse);
                expect(parser.parse('wordwraparcs="off";')).to.deep.equal(fix.astWorwraparcsfalse);
                expect(parser.parse('wordwraparcs=0;')).to.deep.equal(fix.astWorwraparcsfalse);
                expect(parser.parse('wordwraparcs="0";')).to.deep.equal(fix.astWorwraparcsfalse);
            }
        );
        test("should throw a SyntaxError on an invalid program", () => {
            tst.assertSyntaxError('a', parser);
        });
        test(
            "should throw a SyntaxError on invalid characters in an unquoted entity",
            () => {
                tst.assertSyntaxError('-;', parser);
            }
        );
        test(
            "should throw a SyntaxError on invalid characters in an unquoted entity",
            () => {
                tst.assertSyntaxError('a => -;', parser);
            }
        );
        test(
            "should throw a SyntaxError on invalid characters in an unquoted entity",
            () => {
                tst.assertSyntaxError('hscale=1; - => b;', parser);
            }
        );
        test(
            "should throw a SyntaxError on invalid characters in an unquoted entity",
            () => {
                tst.assertSyntaxError('a,b; a: => b;', parser);
            }
        );
        test(
            "should throw a SyntaxError on asterisks on both sides for uni-directional arrows",
            () => {
                tst.assertSyntaxError('a,b,c; * -> *;', parser);
                tst.assertSyntaxError('a,b,c; * <- *;', parser);
            }
        );
        test(
            "should throw a SyntaxError on asterisks on both sides for bi-directional arrows",
            () => {
                tst.assertSyntaxError('a,b,c; * <-> *;', parser);
            }
        );
        test(
            "should throw a SyntaxError for asterisks on LHS on bi-directional arrows",
            () => {
                tst.assertSyntaxError('a,b,c; * <-> a;', parser);
            }
        );
        test("unicode is cool. Also for unquoted entity names", () => {
            expect(parser.parse('序;')).to.deep.equal(gUnicodeEntityFixture);
        });
        test("unicode is also cool for quoted entity names", () => {
            expect(parser.parse('"序";')).to.deep.equal(gUnicodeEntityFixture);
        });
        test("unicode is cool. Also for unquoted entity names in arcs", () => {
            expect(parser.parse('"序" -> 序;🏭 =>> 👳 : 👷+🔧;')).to.deep.equal(gUnicodeEntityInArcFixture);
        });
        test("should throw a SyntaxError on an invalid arc type", () => {
            tst.assertSyntaxError('a, b; a xx b;', parser);
        });
        test("should allow empty inline expressions", () => {
            expect(parser.parse('a, b; a opt b{};')).to.deep.equal(fix.emptyinlineexpression);
        });
        test(
            "should throw a SyntaxError on _that's not an inline expression_ arc type",
            () => {
                tst.assertSyntaxError('a, b; a => b{|||;};', parser);
            }
        );
        test("should throw a SyntaxError on an invalid option", () => {
            tst.assertSyntaxError('wordwarparcs="true"; a, b; a -> b;', parser);
        });
        test(
            "should throw a SyntaxError on an invalid value for an option",
            () => {
                tst.assertSyntaxError('wordwraparcs=\u0181; a, b; a -> b;', parser);
            }
        );
        test(
            "should throw a SyntaxError on a missing semi colon after the options list",
            () => {
                tst.assertSyntaxError('wordwraparcs="true" a, b; a -> b;', parser);
            }
        );
        test("should throw a SyntaxError on a missing semi colon", () => {
            tst.assertSyntaxError('wordwraparcs="true"; a, b; a -> b', parser);
        });
        test("should throw a SyntaxError for a * on the RHS of x-", () => {
            tst.assertSyntaxError('a,b,c; b x- *;', parser);
        });
        test("should throw a SyntaxError for a * on the LHS of -x", () => {
            tst.assertSyntaxError('a,b,c; * -x b;', parser);
        });
        test("should parse all types of arcs supported by mscgen", () => {
            var lAST = parser.parse(
                'a -> b : a -> b  (signal);a => b : a => b  (method);b >> a : b >> a  (return value);a =>> b : a =>> b (callback);a -x b : a -x b  (lost);a :> b : a :> b  (emphasis);a .. b : a .. b  (dotted);a note a : a note a,b box b : b box b;a rbox a : a rbox a,b abox b : b abox b;||| : ||| (empty row);... : ... (omitted row);--- : --- (comment);'
            );
            expect(lAST).to.deep.equal(fix.astCheatSheet);
        });
        test(
            "should throw a SyntaxError when passing a boolean to something expecting numbers",
            () => {
                tst.assertSyntaxError("wordwraparcs=true, width=true; a;", parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a boolean-like string to something expecting numbers",
            () => {
                tst.assertSyntaxError('wordwraparcs=true, width="true"; a;', parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a non-number like string to hscale",
            () => {
                tst.assertSyntaxError('wordwraparcs=true, hscale="general string"; a;', parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a number to something expecting booleans",
            () => {
                tst.assertSyntaxError("wordwraparcs=481; a;", parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a number-like string to something expecting booleans",
            () => {
                tst.assertSyntaxError('wordwraparcs="481"; a;', parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a non boolean-like string to wordwraparcs",
            () => {
                tst.assertSyntaxError('wordwraparcs="general string"; a;', parser);
            }
        );
    });

    describe('#parse() - expansions', () => {
        test('should render a simple AST, with an alt', () => {
            var lAST = parser.parse('a=>b; b alt c { b => c; c >> b;};');
            expect(lAST).to.deep.equal(fix.astOneAlt);
        });
        test(
            'should render an AST, with alts, loops and labels (labels in front)',
            () => {
                var lAST = parser.parse(
                    'a => b; a loop c: "label for loop" { b alt c: "label for alt" { b -> c: -> within alt; c >> b: >> within alt; }; b >> a: >> within loop;}; a =>> a: happy-the-peppy - outside;...;'
                );
                expect(lAST).to.deep.equal(fix.astAltWithinLoop);
            }
        );
        test('should render an AST, with an alt in it', () => {
            var lAST = parser.parse('a alt b {  c -> d; };');
            expect(lAST).to.deep.equal(fix.astDeclarationWithinArcspan);
        });
        test('automatically declares entities in the right order', () => {
            var lAST = parser.parse('# A,a, c, d, b, B;\nA loop B {  a alt b { c -> d; c => B; };};');
            expect(lAST).to.deep.equal(gCorrectOrderFixture);
        });
        test('should accept "auto" as a valid width', () => {
            var lAST = parser.parse('arcgradient= 20, width= auTo ; a,b,c,d,e,f; c =>> *: Hello everyone;');
            expect(lAST.options.width).to.equal("auto");
        });
        test('should accept "AUTO" as a valid width', () => {
            var lAST = parser.parse('arcgradient= 20, width="AUTO"; a,b,c,d,e,f; c =>> *: Hello everyone;');
            expect(lAST.options.width).to.equal("auto");
        });
        test(
            "should throw a SyntaxError on an inline expression without {}",
            () => {
                tst.assertSyntaxError('a loop b', parser);
            }
        );
        test(
            "should throw a SyntaxError on an inline expression with a label, without {}",
            () => {
                tst.assertSyntaxError('a loop b : ', parser);
            }
        );
        test(
            "should throw a SyntaxError on an inline expression with a label, without {}",
            () => {
                tst.assertSyntaxError('a loop b : label', parser);
            }
        );
        test("should throw a SyntaxError on a missing closing bracket", () => {
            tst.assertSyntaxError('a loop b {', parser);
        });
        test(
            "should throw a SyntaxError on a missing semi after a closing bracket",
            () => {
                tst.assertSyntaxError('a loop b {}', parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a boolean to something expecting size",
            () => {
                tst.assertSyntaxError("width=true; a;", parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a boolean-like string to something expecting size",
            () => {
                tst.assertSyntaxError('width="true"; a;', parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a non-number like string to something expecting size",
            () => {
                tst.assertSyntaxError('width="general string"; a;', parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a boolean to something expecting a string",
            () => {
                tst.assertSyntaxError("watermark=true; a;", parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a cardinal to something expecting a string",
            () => {
                tst.assertSyntaxError("watermark= 481; a;", parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a real to something expecting a string",
            () => {
                tst.assertSyntaxError("watermark= 481.1337; a;", parser);
            }
        );
        test(
            "should throw a SyntaxError when passing a size to something expecting a string",
            () => {
                tst.assertSyntaxError("watermark = auto; a;", parser);
            }
        );

    });
    describe('#parse() - file based tests', () => {
        test("should parse all possible arcs", () => {
            var lTextFromFile = fs.readFileSync(
                path.join(__dirname, '../fixtures/test01_all_possible_arcs_msgenny.msgenny'),
                {"encoding":"utf8"}
            );
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/test01_all_possible_arcs_msgenny.json'), lAST);
        });
    });
});
