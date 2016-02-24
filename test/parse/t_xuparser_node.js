var parser = require("../../parse/xuparser_node");
var tst    = require("../testutensils");
var fix    = require("../astfixtures.json");
var pairs  = require("./mscgenPairs");
var fs     = require("fs");
var path   = require("path");
var expect = require("chai").expect;

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
            var lTextFromFile = fs.readFileSync(path.join(__dirname, '../fixtures/test01_all_possible_arcs.xu'), {"encoding":"utf8"});
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/test01_all_possible_arcs.json'), lAST);
        });
        it("should parse stuff with colors", function() {
            var lTextFromFile = fs.readFileSync(path.join(__dirname, '../fixtures/rainbow.mscin'), {"encoding":"utf8"});
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/rainbow.json'), lAST);
        });
        it("strings, ids and urls", function() {
            var lTextFromFile = fs.readFileSync(path.join(__dirname, '../fixtures/test10_stringsandurls.mscin'), {"encoding":"utf8"});
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/test10_stringsandurls.json'), lAST);
        });
    });

    describe('#parse() - xu specific extensions', function() {
        it("should accept empty inline expressions", function() {
            var lFixture = {
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
            expect(parser.parse('Xu{a, b; a opt b{};}')).to.deep.equal(lFixture);
        });

        it('should render an AST, with an alt in it', function() {
            var lAST = parser.parse('msc { a,b,c; a => b; b alt c { b => c; c >> b; };}');
            expect(lAST).to.deep.equal(fix.astOneAlt);
        });

        it('should render an AST, with a loop and an alt in it', function() {
            var lAST = parser.parse('msc { a,b,c; a => b; a loop c [label="label for loop"] { b alt c [label="label for alt"]{ b -> c [label="-> within alt"]; c >> b [label=">> within alt"]; }; b >> a [label=">> within loop"];}; a =>> a [label="happy-the-peppy - outside"];...;}');
            expect(lAST).to.deep.equal(fix.astAltWithinLoop);
        });
        it('should accept AUTO as a valid width', function(){
            var lAST = parser.parse('xu{ arcgradient=20, width=AUTO; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}');
            expect(lAST.options.width).to.equal("auto");
        });
        it('should accept "AUTO" as a valid width', function(){
            var lAST = parser.parse('xu{ arcgradient=20, width="AUTO"; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}');
            expect(lAST.options.width).to.equal("auto");
        });
        it("should throw a SyntaxError on a missing closing bracket", function() {
            tst.assertSyntaxError('msc {a,b; a loop b {', parser);
        });
        it("should throw a SyntaxError on a missing closing bracket", function() {
            tst.assertSyntaxError('msc {a,b; a loop b {a=>b;', parser);
        });
        it("should throw a SyntaxError on a missing closing bracket", function() {
            tst.assertSyntaxError('msc {a,b; a loop b {}', parser);
        });
        it("should throw a SyntaxError on a missing semi colon after a closing bracket", function() {
            tst.assertSyntaxError('msc {a,b; a loop b [', parser);
        });
        it("should throw a SyntaxError on a missing a value for an attribute", function() {
            tst.assertSyntaxError('msc {a,b; a loop b [label', parser);
        });
        it("should throw a SyntaxError on a missing a closing bracket after a valid option", function() {
            tst.assertSyntaxError('msc {a,b; a loop b [label="brackets missing"', parser);
        });
        it("should throw an EntityNotDefinedError on a missing entity somewhere deeply nested", function() {
            tst.assertSyntaxError('msc {a,b; a loop b {c => b;};}', parser, "EntityNotDefinedError");
        });
        it("should throw a SyntaxError when passing a boolean to something expecting a string", function(){
            tst.assertSyntaxError("msc{watermark=true; a;}", parser);
        });
        it("should throw a SyntaxError when passing a cardinal to something expecting a string", function(){
            tst.assertSyntaxError("msc{watermark=481; a;}", parser);
        });
        it("should throw a SyntaxError when passing a real to something expecting a string", function(){
            tst.assertSyntaxError("msc{watermark=481.1337; a;}", parser);
        });
        it("should throw a SyntaxError when passing a size to something expecting a string", function(){
            tst.assertSyntaxError("msc{watermark=auto; a;}", parser);
        });
    });
});
