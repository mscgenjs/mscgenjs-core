const fs       = require("fs");
const path     = require("path");
const renderer = require("../../../dist/render/text/ast2dot").default;
const fix      = require("../../astfixtures.json");

describe('render/text/ast2dot', () => {
    describe('#renderAST() - mscgen classic compatible - simple syntax trees', () => {

        test("should, given a simple syntax tree, render a dot script", () => {
            expect(renderer.render(fix.astSimple)).toMatchSnapshot();
        });

        test("should, given a syntax tree with boxes, render a dot script", () => {
            expect(renderer.render(fix.astBoxArcs)).toMatchSnapshot();
        });

    });

    describe('#renderAST() - xu compatible', () => {
        test('alt only - render correct script', () => {
            expect(renderer.render(fix.astOneAlt)).toMatchSnapshot();
        });
        test('alt within loop - render correct script', () => {
            expect(renderer.render(fix.astAltWithinLoop)).toMatchSnapshot();
        });
    });

    describe('#renderAST() - file based tests', () => {
        test('should render all arcs', () => {
            const lASTString = fs.readFileSync(
                path.join(__dirname, "../../fixtures/test01_all_possible_arcs_mscgen.json"),
                {"encoding":"utf8"}
            );
            const lAST = JSON.parse(lASTString);
            expect(renderer.render(lAST)).toMatchSnapshot();
        });
    });
});
