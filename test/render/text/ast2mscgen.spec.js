const fs       = require("fs");
const path     = require("path");
const assert   = require("assert");
const expect   = require("chai").expect;
const renderer = require("../../../render/text/ast2mscgen");
const parser   = require("../../../parse/mscgenparser");
const fix      = require("../../astfixtures.json");

describe('render/text/ast2mscgen', () => {
    describe('#renderAST() - simple syntax tree', () => {
        test('should, given a simple syntax tree, render a mscgen script', () => {
            const lProgram = renderer.render(fix.astSimple);
            const lExpectedProgram = 'msc {\n  a,\n  "b space";\n\n  a => "b space" [label="a simple script"];\n}';
            assert.equal(lProgram, lExpectedProgram);
        });

        test('should, given a simple syntax tree, render a mscgen script', () => {
            const lProgram = renderer.render(fix.astSimple, false);
            const lExpectedProgram = 'msc {\n  a,\n  "b space";\n\n  a => "b space" [label="a simple script"];\n}';
            assert.equal(lProgram, lExpectedProgram);
        });

        test(
            'should, given a simple syntax tree, render a "minified" mscgen script',
            () => {
                const lProgram = renderer.render(fix.astSimple, true);
                const lExpectedProgram = 'msc{a,"b space";a => "b space"[label="a simple script"];}';
                assert.equal(lProgram, lExpectedProgram);
            }
        );

        test("should preserve the comments at the start of the ast", () => {
            const lProgram = renderer.render(fix.astWithPreComment);
            const lExpectedProgram =
                "# pre comment\n/* pre\n * multiline\n * comment\n */\nmsc {\n  a,\n  b;\n\n  a -> b;\n}";
            assert.equal(lProgram, lExpectedProgram);
        });

        test("should preserve attributes", () => {
            const lProgram = renderer.render(fix.astAttributes);
            const lExpectedProgram =
                "msc {\n  Alice [linecolor=\"#008800\", textcolor=\"black\", textbgcolor=\"#CCFFCC\", arclinecolor=\"#008800\", arctextcolor=\"#008800\"],\n  Bob [linecolor=\"#FF0000\", textcolor=\"black\", textbgcolor=\"#FFCCCC\", arclinecolor=\"#FF0000\", arctextcolor=\"#FF0000\"],\n  pocket [linecolor=\"#0000FF\", textcolor=\"black\", textbgcolor=\"#CCCCFF\", arclinecolor=\"#0000FF\", arctextcolor=\"#0000FF\"];\n\n  Alice => Bob [label=\"do something funny\"];\n  Bob => pocket [label=\"fetch (nose flute)\", textcolor=\"yellow\", textbgcolor=\"green\", arcskip=\"0.5\"];\n  Bob >> Alice [label=\"PHEEE!\", textcolor=\"green\", textbgcolor=\"yellow\", arcskip=\"0.3\"];\n  Alice => Alice [label=\"hihihi\", linecolor=\"#654321\"];\n}";
            assert.equal(lProgram, lExpectedProgram);
        });
        test("correctly renders multiple options", () => {
            const lProgram = renderer.render(fix.astOptionsMscgen);
            const lExpectedProgram =
                'msc {\n  hscale="1.2",\n  width="800",\n  arcgradient="17",\n  wordwraparcs=true;\n\n  a;\n\n}';
            assert.equal(lProgram, lExpectedProgram);
        });
        test("correctly renders parallel calls", () => {
            const lProgram = renderer.render(fix.astSimpleParallel);
            const lExpectedProgram =
                'msc {\n  a,\n  b,\n  c;\n\n  b -> a [label="{paral"],\n  b =>> c [label="lel}"];\n}';
            assert.equal(lProgram, lExpectedProgram);
        });
    });

    describe('#renderAST() - minification', () => {
        test('should render a "minified" mscgen script', () => {
            const lProgram = renderer.render(fix.astOptions, true);
            const lExpectedProgram = 'msc{hscale="1.2",width="800",arcgradient="17",wordwraparcs=true;a;}';
            assert.equal(lProgram, lExpectedProgram);
        });

        test('should render a "minified" mscgen script', () => {
            const lProgram = renderer.render(fix.astBoxes, true);
            const lExpectedProgram = 'msc{a,b;a note b;a box a,b rbox b;b abox a;}';
            assert.equal(lProgram, lExpectedProgram);
        });
    });

    describe('#renderAST() - xu compatible', () => {
        test('alt only - render correct script', () => {
            const lProgram = renderer.render(fix.astOneAlt);
            const lExpectedProgram =
`msc {
  a,
  b,
  c;

  a => b;
  b -- c;
    b => c;
    c >> b;
#;
}`;
            assert.equal(lExpectedProgram, lProgram);
        });
        test('alt within loop - render correct script', () => {
            const lProgram = renderer.render(fix.astAltWithinLoop);
            const lExpectedProgram =
`msc {
  a,
  b,
  c;

  a => b;
  a -- c [label="label for loop"];
    b -- c [label="label for alt"];
      b -> c [label="-> within alt"];
      c >> b [label=">> within alt"];
  #;
    b >> a [label=">> within loop"];
#;
  a =>> a [label="happy-the-peppy - outside"];\n\
  ...;
}`;
            assert.equal(lProgram, lExpectedProgram);
        });
        test(
            'When presented with an unsupported option, renders the script by simply omitting it',
            () => {
                const lProgram = renderer.render(fix.astWithAWatermark);
                const lExpectedProgram =
 `msc {
  a;

}`;
                assert.equal(lProgram, lExpectedProgram);
            }
        );
        test("Does not render width when that equals 'auto'", () => {
            const lProgram = renderer.render(fix.auto, true);
            const lExpectedProgram = "msc{}";
            assert.equal(lProgram, lExpectedProgram);
        });
        test("Puts entities with mscgen keyword for a name in quotes", () => {
            const lProgram = renderer.render(fix.entityWithMscGenKeywordAsName, true);
            const lExpectedProgram = 'msc{"note";}';
            assert.equal(lProgram, lExpectedProgram);
        });
    });
    describe('#renderAST() - file based tests', () => {
        test('should render all arcs', () => {
            const lASTString = fs.readFileSync(
                path.join(__dirname, "../../fixtures/test01_all_possible_arcs_mscgen.json"),
                {"encoding":"utf8"}
            );
            const lAST = JSON.parse(lASTString);
            const lProgram = renderer.render(lAST);
            expect(parser.parse(lProgram)).to.deep.equal(lAST);
        });
    });
});
