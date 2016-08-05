var parser = require("../../parse/mscgenparser");
var tst    = require("../testutensils");
var pairs  = require("./mscgenPairs");
var fs     = require("fs");
var path   = require("path");
var expect = require("chai").expect;

describe('parse/mscgenparser', function() {
    describe('#parse() - happy day values', function() {

        it("should correctly parse naked reals", function() {
            var lAST = parser.parse('msc{HSCAle=481.1337;a;}');
            expect(lAST.options.hscale).to.equal("481.1337");
        });
        it("should correctly parse quoted cardinals", function() {
            var lAST = parser.parse('msc{width="481";a;}');
            expect(lAST.options.width).to.equal("481");
        });
        it("should correctly parse quoted reals", function() {
            var lAST = parser.parse('msc{width="481.1337";a;}');
            expect(lAST.options.width).to.equal("481.1337");
        });
    });

    describe('#parse() - happy day ASTs - ', function(){
        pairs.programASTPairs.forEach(function(pPair){
            it(pPair.title, function(){
                expect(parser.parse(pPair.program)).to.deep.equal(pPair.ast);
            });
        });
    });

    describe('#parse() - syntax errors - ', function(){
        pairs.syntaxErrors.forEach(function(pPair){
            it(pPair.title, function() {
                tst.assertSyntaxError(pPair.program, parser, pPair.error);
            });
        });
    });

    describe('#parse() - file based tests - ', function() {
        it("should parse all possible arcs", function() {
            var lTextFromFile = fs.readFileSync(
                path.join(__dirname, '../fixtures/test01_all_possible_arcs_mscgen.mscin'),
                {"encoding" : "utf8"}
            );
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/test01_all_possible_arcs_mscgen.json'), lAST);
        });
        it("should parse stuff with colors", function() {
            var lTextFromFile = fs.readFileSync(path.join(__dirname, '../fixtures/rainbow.mscin'), {
                "encoding" : "utf8"
            });
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/rainbow.json'), lAST);
        });
        it("strings, ids and urls", function() {
            var lTextFromFile = fs.readFileSync(
                path.join(__dirname, '../fixtures/test10_stringsandurls.mscin'),
                {"encoding":"utf8"}
            );
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/test10_stringsandurls.json'), lAST);
        });
    });

});
