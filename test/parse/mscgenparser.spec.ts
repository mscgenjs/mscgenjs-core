const fs                 = require("fs");
const path               = require("path");
const JSONSchemaMatchers = require("jest-json-schema").matchers;
const parser             = require("../../src/parse/mscgenparser");
const mscgenjsASTSchema  = require("../../src/parse/mscgenjs-ast.schema.json");
const tst                = require("../testutensils");
const pairs              = require("./mscgenPairs");

expect.extend(JSONSchemaMatchers);

describe("parse/mscgenparser", () => {
    describe("#parse() - happy day values", () => {

        test("should correctly parse naked reals", () => {
            const lAST = parser.parse("msc{HSCAle=481.1337;a;}");
            expect(lAST.options.hscale).toBe("481.1337");
        });
        test("should correctly parse quoted cardinals", () => {
            const lAST = parser.parse('msc{width="481";a;}');
            expect(lAST.options.width).toBe("481");
        });
        test("should correctly parse quoted reals", () => {
            const lAST = parser.parse('msc{width="481.1337";a;}');
            expect(lAST.options.width).toBe("481.1337");
        });
        test("should correctly parse naked cardinals", () => {
            const lAST = parser.parse("msc{width=481;a;}");
            expect(lAST.options.width).toBe("481");
        });
    });

    describe("#parse() - happy day ASTs - ", () => {
        pairs.programASTPairs.forEach((pPair) => {
            test(pPair.title, () => {
                const lAST = parser.parse(pPair.program);
                expect(lAST).toMatchSchema(mscgenjsASTSchema);
                expect(lAST).toEqual(pPair.ast);
            });
        });
    });

    describe("#parse() - syntax errors - ", () => {
        pairs.syntaxErrors.forEach((pPair) => {
            test(pPair.title, () => {
                tst.assertSyntaxError(pPair.program, parser, pPair.error);
            });
        });
    });

    describe("#parse() - file based tests - ", () => {
        test("should parse all possible arcs", () => {
            const lTextFromFile = fs.readFileSync(
                path.join(__dirname, "../fixtures/test01_all_possible_arcs_mscgen.mscin"),
                {encoding : "utf8"},
            );
            const lAST = parser.parse(lTextFromFile.toString());
            expect(lAST).toMatchSchema(mscgenjsASTSchema);
            tst.assertequalToFileJSON(path.join(__dirname, "../fixtures/test01_all_possible_arcs_mscgen.json"), lAST);
        });
        test("should parse stuff with colors", () => {
            const lTextFromFile = fs.readFileSync(path.join(__dirname, "../fixtures/rainbow.mscin"), {
                encoding : "utf8",
            });
            const lAST = parser.parse(lTextFromFile.toString());
            expect(lAST).toMatchSchema(mscgenjsASTSchema);
            tst.assertequalToFileJSON(path.join(__dirname, "../fixtures/rainbow.json"), lAST);
        });
        test("strings, ids and urls", () => {
            const lTextFromFile = fs.readFileSync(
                path.join(__dirname, "../fixtures/test10_stringsandurls.mscin"),
                {encoding: "utf8"},
            );
            const lAST = parser.parse(lTextFromFile.toString());
            expect(lAST).toMatchSchema(mscgenjsASTSchema);
            tst.assertequalToFileJSON(path.join(__dirname, "../fixtures/test10_stringsandurls.json"), lAST);
        });
    });

});
