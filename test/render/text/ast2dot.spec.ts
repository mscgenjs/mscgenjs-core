const fs       = require("fs");
const path     = require("path");
// const renderer = require("../../../src/render/text/ast2dot").default;
import {render, explodeBroadcasts} from "../../../src/render/text/ast2dot";
const fix      = require("../../astfixtures.json");

describe("render/text/ast2dot", () => {
    describe("#renderAST() - mscgen classic compatible - simple syntax trees", () => {

        test("should, given an 'empty' syntax tree, render a dot script", () => {
            expect(render(fix.astEmpty)).toMatchSnapshot();
        });

        test("should, given a simple syntax tree, render a dot script", () => {
            expect(render(fix.astSimple)).toMatchSnapshot();
        });

        test("should, given a syntax tree with boxes, render a dot script", () => {
            expect(render(fix.astBoxArcs)).toMatchSnapshot();
        });

    });

    describe("#renderAST() - xu compatible", () => {
        test("alt only - render correct script", () => {
            expect(render(fix.astOneAlt)).toMatchSnapshot();
        });
        test("alt within loop - render correct script", () => {
            expect(render(fix.astAltWithinLoop)).toMatchSnapshot();
        });
    });

    describe("#renderAST() - file based tests", () => {
        test("should render all arcs", () => {
            const lASTString = fs.readFileSync(
                path.join(__dirname, "../../fixtures/test01_all_possible_arcs_mscgen.json"),
                {encoding: "utf8"},
            );
            const lAST = JSON.parse(lASTString);
            expect(render(lAST)).toMatchSnapshot();
        });
    });

    describe("explodeBroadcasts", () => {
        test("leave asts without broadcasts alone", () => {
            expect(
                explodeBroadcasts(fix.astAltWithinLoop),
            ).toEqual(fix.astAltWithinLoop);
        });
        test("explode b->* to parallel calls to all other entities", () => {
            expect(
                explodeBroadcasts(fix.astSimpleBroadcast),
            ).toEqual(fix.astSimpleBroadcastExploded);
        });
        test(
            "explode a little more complex broadcast ast to parallel calls to all other entities",
            () => {
                expect(
                    explodeBroadcasts(fix.astComplexerBroadcast),
                ).toEqual(fix.astComplexerBroadcastExploded);
            },
        );
        test(
            "correctly explode a broadcast that has other arcs in the same arc row",
            () => {
                expect(
                    explodeBroadcasts(fix.astSameArcRowBroadcast),
                ).toEqual(fix.astSameArcRowBroadcastExploded);
            },
        );
    });
});
