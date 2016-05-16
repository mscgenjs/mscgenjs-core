const assert   = require("assert");
const renderer = require("../../../render/text/ast2msgenny");
const fix      = require("../../astfixtures.json");
const utl      = require("../../testutensils");
const path     = require('path');

describe('render/text/ast2msgenny', () => {
    describe('#renderAST() - mscgen classic compatible - simple syntax trees', () => {

        it('should, given a simple syntax tree, render a msgenny script', () => {
            const lProgram = renderer.render(fix.astSimple);
            const lExpectedProgram = 'a, "b space";\n\na => "b space" : a simple script;\n';
            assert.equal(lProgram, lExpectedProgram);
        });

        it("should wrap labels with a , in quotes", () => {
            const lAST = {
                "entities" : [{
                    "name" : "a",
                    "label" : "comma,"
                }]
            };
            const lProgram = renderer.render(lAST);
            const lExpectedProgram = "a : \"comma,\";\n\n";
            assert.equal(lProgram, lExpectedProgram);
        });

        it("should wrap labels with a ; in quotes", () => {
            const lAST = {
                "entities" : [{
                    "name" : "a",
                    "label" : "semi; colon"
                }]
            };
            const lProgram = renderer.render(lAST);
            const lExpectedProgram = "a : \"semi; colon\";\n\n";
            assert.equal(lProgram, lExpectedProgram);
        });

        it("should render options when they're in the syntax tree", () => {
            const lProgram = renderer.render(fix.astOptions);
            const lExpectedProgram =
`hscale="1.2",
width="800",
arcgradient="17",
wordwraparcs=true,
watermark="not in mscgen, available in xù and msgenny";

a;

`;
            assert.equal(lProgram, lExpectedProgram);
        });
        it("should ignore all attributes, except label and name", () => {
            const lProgram = renderer.render(fix.astAllAttributes);
            const lExpectedProgram = "a : Label for A;\n\na <<=>> a : Label for a <<=>> a;\n";
            assert.equal(lProgram, lExpectedProgram);
        });
        it("should preserve the comments at the start of the ast", () => {
            const lProgram = renderer.render(fix.astWithPreComment);
            const lExpectedProgram = "# pre comment\n/* pre\n * multiline\n * comment\n */\na, b;\n\na -> b;\n";
            assert.equal(lProgram, lExpectedProgram);
        });
        it("should correctly render parallel calls", () => {
            const lProgram = renderer.render(fix.astSimpleParallel);
            const lExpectedProgram = 'a, b, c;\n\nb -> a : "{paral",\nb =>> c : lel};\n';
            assert.equal(lProgram, lExpectedProgram);
        });
    });

    describe('#renderAST() - xu compatible', () => {
        it('alt only - render correct script', () => {
            const lProgram = renderer.render(fix.astOneAlt);
            const lExpectedProgram = "a, b, c;\n\na => b;\nb alt c {\n  b => c;\n  c >> b;\n};\n";
            assert.equal(lProgram, lExpectedProgram);
        });
        it('alt within loop - render correct script', () => {
            const lProgram = renderer.render(fix.astAltWithinLoop);
            const lExpectedProgram =
`a, b, c;

a => b;
a loop c : label for loop {
  b alt c : label for alt {
    b -> c : -> within alt;
    c >> b : >> within alt;
  };
  b >> a : >> within loop;
};
a =>> a : happy-the-peppy - outside;
...;
`;
            assert.equal(lProgram, lExpectedProgram);
        });
        it("should correctly render empty inline expressions", () => {
            const lFixture = {
                "meta": {
                    "extendedOptions": false,
                    "extendedArcTypes": true,
                    "extendedFeatures": true
                },
                "entities": [
                    {
                        "name": "a"
                    },
                    {
                        "name": "b"
                    }
                ],
                "arcs": [
                    [
                        {
                            "kind": "opt",
                            "from": "a",
                            "to": "b",
                            "arcs": null
                        }
                    ]
                ]
            };
            const lProgram = renderer.render(lFixture);
            const lExpectedProgram = 'a, b;\n\na opt b {\n};\n';
            assert.equal(lProgram, lExpectedProgram);
        });
        it("Does not put entities with mscgen keyword for a name in quotes", () => {
            const lProgram = renderer.render(fix.entityWithMscGenKeywordAsName, true);
            const lExpectedProgram = 'note;\n\n';
            assert.equal(lProgram, lExpectedProgram);
        });
    });

    describe('#renderAST() - file based tests', () => {
        it('should render all arcs', () => {
            utl.assertequalProcessing(
                path.join(__dirname, "../../fixtures/test01_all_possible_arcs_msgenny.msgenny"),
                path.join(__dirname, "../../fixtures/test01_all_possible_arcs_msgenny.json"),
                function(pFileContent) {
                    return renderer.render(JSON.parse(pFileContent));
                }
            );
        });
    });
});
