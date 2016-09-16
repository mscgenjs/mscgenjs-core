var parser  = require("../../parse/xuparser");
var tst     = require("../testutensils");
var pairs   = require("./mscgenPairs");
var xuPairs = require("./xuPairs");
var fs      = require("fs");
var path    = require("path");
var expect  = require("chai").expect;

describe('parse/xuparser', function() {
    describe('#parse()', function() {

        it("should correctly parse naked reals", function() {
            var lAST = parser.parse('xu{HSCAle=481.1337;a;}');
            expect(lAST.options.hscale).to.equal("481.1337");
        });
        it("should correctly parse quoted cardinals", function() {
            var lAST = parser.parse('xu{width="481";a;}');
            expect(lAST.options.width).to.equal("481");
        });
        it("should correctly parse quoted reals", function() {
            var lAST = parser.parse('xu{width="481.1337";a;}');
            expect(lAST.options.width).to.equal("481.1337");
        });
        it("should correctly parse naked cardinals", function() {
            var lAST = parser.parse('xu{width=481;a;}');
            expect(lAST.options.width).to.equal("481");
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

    describe('#parse() - inline expressions - ', function(){
        it("should throw a SyntaxError on _that's not an inline expression_ arc type", function() {
            tst.assertSyntaxError('msc{a, b; a => b{|||;};}', parser);
        });
    });

    describe('#parse() - file based tests', function(){
        it("should parse all possible arcs", function() {
            var lTextFromFile = fs.readFileSync(
                path.join(__dirname, '../fixtures/test01_all_possible_arcs.xu'),
                {"encoding":"utf8"}
            );
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/test01_all_possible_arcs.json'), lAST);
        });
        it("should parse stuff with colors", function() {
            var lTextFromFile = fs.readFileSync(
                path.join(__dirname, '../fixtures/rainbow.mscin'),
                {"encoding":"utf8"}
            );
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

    describe('#parse() - xu specific extensions', function() {
        describe('#parse() - happy day ASTs - ', function(){
            xuPairs.programASTPairs.forEach(function(pPair){
                it(pPair.title, function(){
                    expect(parser.parse(pPair.program)).to.deep.equal(pPair.ast);
                });
            });
        });

        describe('#parse() - syntax errors - ', function(){
            xuPairs.syntaxErrors.forEach(function(pPair){
                it(pPair.title, function() {
                    tst.assertSyntaxError(pPair.program, parser, pPair.error);
                });
            });
        });
        it('should accept watermark as an option', function(){
            var lAST = parser.parse('xu{arcgradient= 20, watermark="Goûter le filigraine" ; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}');
            expect(lAST.options.watermark).to.equal("Goûter le filigraine");
        });
        it('should accept AUTO as a valid width', function(){
            var lAST = parser.parse('xu{ arcgradient=20, width=AUTO; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}');
            expect(lAST.options.width).to.equal("auto");
        });
        it('should accept "AUTO" as a valid width', function(){
            var lAST = parser.parse(
                'xu{ arcgradient=20, width="AUTO"; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}'
            );
            expect(lAST.options.width).to.equal("auto");
        });
    });
});
