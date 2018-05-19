var fs      = require("fs");
var path    = require("path");
var expect  = require("chai").expect;
var parser  = require("../../parse/xuparser");
var tst     = require("../testutensils");
var pairs   = require("./mscgenPairs");
var xuPairs = require("./xuPairs");

describe('parse/xuparser', () => {
    describe('#parse()', () => {

        test("should correctly parse naked reals", () => {
            var lAST = parser.parse('xu{HSCAle=481.1337;a;}');
            expect(lAST.options.hscale).to.equal("481.1337");
        });
        test("should correctly parse quoted cardinals", () => {
            var lAST = parser.parse('xu{width="481";a;}');
            expect(lAST.options.width).to.equal("481");
        });
        test("should correctly parse quoted reals", () => {
            var lAST = parser.parse('xu{width="481.1337";a;}');
            expect(lAST.options.width).to.equal("481.1337");
        });
        test("should correctly parse naked cardinals", () => {
            var lAST = parser.parse('xu{width=481;a;}');
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

    describe('#parse() - inline expressions - ', () => {
        test(
            "should throw a SyntaxError on _that's not an inline expression_ arc type",
            () => {
                tst.assertSyntaxError('msc{a, b; a => b{|||;};}', parser);
            }
        );
    });

    describe('#parse() - file based tests', () => {
        test("should parse all possible arcs", () => {
            var lTextFromFile = fs.readFileSync(
                path.join(__dirname, '../fixtures/test01_all_possible_arcs.xu'),
                {"encoding":"utf8"}
            );
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/test01_all_possible_arcs.json'), lAST);
        });
        test("should parse stuff with colors", () => {
            var lTextFromFile = fs.readFileSync(
                path.join(__dirname, '../fixtures/rainbow.mscin'),
                {"encoding":"utf8"}
            );
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

    describe('#parse() - xu specific extensions', () => {
        describe('#parse() - happy day ASTs - ', () => {
            xuPairs.programASTPairs.forEach(function(pPair){
                test(pPair.title, () => {
                    expect(parser.parse(pPair.program)).to.deep.equal(pPair.ast);
                });
            });
        });

        describe('#parse() - syntax errors - ', () => {
            xuPairs.syntaxErrors.forEach(function(pPair){
                test(pPair.title, () => {
                    tst.assertSyntaxError(pPair.program, parser, pPair.error);
                });
            });
        });
        test('should accept watermark as an option', () => {
            var lAST = parser.parse('xu{arcgradient= 20, watermark="Goûter le filigraine" ; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}');
            expect(lAST.options.watermark).to.equal("Goûter le filigraine");
        });
        test('should accept AUTO as a valid width', () => {
            var lAST = parser.parse('xu{ arcgradient=20, width=AUTO; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}');
            expect(lAST.options.width).to.equal("auto");
        });
        test('should accept "AUTO" as a valid width', () => {
            var lAST = parser.parse(
                'xu{ arcgradient=20, width="AUTO"; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}'
            );
            expect(lAST.options.width).to.equal("auto");
        });
    });
});
