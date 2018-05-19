/* eslint max-len:0 */
const renderer = require("../../../render/text/ast2doxygen");
const fix      = require("../../astfixtures.json");

describe('render/text/ast2doxygen', () => {
    describe('#renderAST() - simple syntax tree', () => {
        test('should, given a simple syntax tree, render a mscgen script', () => {
            const lProgram = renderer.render(fix.astSimple);
            const lExpectedProgram =
                ' * \\msc\n *   a,\n *   "b space";\n * \n *   a => "b space" [label="a simple script"];\n * \\endmsc';
            expect(lProgram).toBe(lExpectedProgram);
        });

        test("should preserve the comments at the start of the ast", () => {
            const lProgram = renderer.render(fix.astWithPreComment);
            const lExpectedProgram = " * \\msc\n *   a,\n *   b;\n * \n *   a -> b;\n * \\endmsc";
            expect(lProgram).toBe(lExpectedProgram);
        });

        test("should preserve attributes", () => {
            const lProgram = renderer.render(fix.astAttributes);
            const lExpectedProgram =
` * \\msc
 *   Alice [linecolor="#008800", textcolor="black", textbgcolor="#CCFFCC", arclinecolor="#008800", arctextcolor="#008800"],
 *   Bob [linecolor="#FF0000", textcolor="black", textbgcolor="#FFCCCC", arclinecolor="#FF0000", arctextcolor="#FF0000"],
 *   pocket [linecolor="#0000FF", textcolor="black", textbgcolor="#CCCCFF", arclinecolor="#0000FF", arctextcolor="#0000FF"];
 * \n *   Alice => Bob [label="do something funny"];
 *   Bob => pocket [label="fetch (nose flute)", textcolor="yellow", textbgcolor="green", arcskip="0.5"];
 *   Bob >> Alice [label="PHEEE!", textcolor="green", textbgcolor="yellow", arcskip="0.3"];
 *   Alice => Alice [label="hihihi", linecolor="#654321"];
 * \\endmsc`;
            expect(lProgram).toBe(lExpectedProgram);
        });
    });

    describe('#renderAST() - xu compatible', () => {
        test('alt only - render correct script', () => {
            const lProgram = renderer.render(fix.astOneAlt);
            const lExpectedProgram =
` * \\msc
 *   a,
 *   b,
 *   c;
 * \n *   a => b;
 *   b -- c;
 *     b => c;
 *     c >> b;
 * #;
 * \\endmsc`;
            expect(lProgram).toBe(lExpectedProgram);
        });
        test('alt within loop - render correct script', () => {
            const lProgram = renderer.render(fix.astAltWithinLoop);
            const lExpectedProgram =
` * \\msc
 *   a,
 *   b,
 *   c;
 * \n *   a => b;
 *   a -- c [label="label for loop"];
 *     b -- c [label="label for alt"];
 *       b -> c [label="-> within alt"];
 *       c >> b [label=">> within alt"];
   * #;
 *     b >> a [label=">> within loop"];
 * #;
 *   a =>> a [label="happy-the-peppy - outside"];
 *   ...;
 * \\endmsc`;
            expect(lProgram).toBe(lExpectedProgram);
        });
        test(
            'When presented with an unsupported option, renders the script by simply omitting it',
            () => {
                const lProgram = renderer.render(fix.astWithAWatermark);
                const lExpectedProgram =
` * \\msc
 *   a;
 * \n * \\endmsc`;
                expect(lProgram).toBe(lExpectedProgram);
            }
        );
        test("Does not render width when that equals 'auto'", () => {
            const lProgram = renderer.render(fix.auto, true);
            const lExpectedProgram =
` * \\msc
 * \\endmsc`;
            expect(lProgram).toBe(lExpectedProgram);
        });
        test("Render width when that is a number", () => {
            const lProgram = renderer.render(fix.fixedwidth, true);
            const lExpectedProgram =
` * \\msc
 *   width=800;
 * \n * \\endmsc`;
            expect(lProgram).toBe(lExpectedProgram);
        });
        test("Puts entities with mscgen keyword for a name in quotes", () => {
            const lProgram = renderer.render(fix.entityWithMscGenKeywordAsName, true);
            const lExpectedProgram =
` * \\msc\n\
 *   "note";\n\
 * \n * \\endmsc`;
            expect(lProgram).toBe(lExpectedProgram);
        });
    });
});
