var fs     = require("fs");
var path   = require("path");
var expect = require("chai").expect;
var parser = require("../../parse/mscgenparser");
var tst    = require("../testutensils");
var pairs  = require("./mscgenPairs");

describe('parse/mscgenparser', () => {
    describe('#parse() - happy day values', () => {

        test("should correctly parse naked reals", () => {
            var lAST = parser.parse('msc{HSCAle=481.1337;a;}');
            expect(lAST.options.hscale).to.equal("481.1337");
        });
        test("should correctly parse quoted cardinals", () => {
            var lAST = parser.parse('msc{width="481";a;}');
            expect(lAST.options.width).to.equal("481");
        });
        test("should correctly parse quoted reals", () => {
            var lAST = parser.parse('msc{width="481.1337";a;}');
            expect(lAST.options.width).to.equal("481.1337");
        });
        test("should correctly parse naked cardinals", () => {
            var lAST = parser.parse('msc{width=481;a;}');
            expect(lAST.options.width).to.equal("481");
        });
    });

    describe('#parse() - happy day ASTs - ', () => {
        pairs.programASTPairs.forEach(function(pPair){
            test(pPair.title, () => {
                expect(parser.parse(pPair.program)).to.deep.equal(pPair.ast);
            });
        });
    });

    describe('#parse() - syntax errors - ', () => {
        pairs.syntaxErrors.forEach(function(pPair){
            test(pPair.title, () => {
                tst.assertSyntaxError(pPair.program, parser, pPair.error);
            });
        });
    });

    describe('#parse() - file based tests - ', () => {
        test("should parse all possible arcs", () => {
            var lTextFromFile = fs.readFileSync(
                path.join(__dirname, '../fixtures/test01_all_possible_arcs_mscgen.mscin'),
                {"encoding" : "utf8"}
            );
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/test01_all_possible_arcs_mscgen.json'), lAST);
        });
        test("should parse stuff with colors", () => {
            var lTextFromFile = fs.readFileSync(path.join(__dirname, '../fixtures/rainbow.mscin'), {
                "encoding" : "utf8"
            });
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/rainbow.json'), lAST);
        });
        test("strings, ids and urls", () => {
            var lTextFromFile = fs.readFileSync(
                path.join(__dirname, '../fixtures/test10_stringsandurls.mscin'),
                {"encoding":"utf8"}
            );
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/test10_stringsandurls.json'), lAST);
        });
    });

});
