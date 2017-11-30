var path     = require('path');
var JSDOM    = require("jsdom").JSDOM;
var renderer = require("../../../render/graphics/renderast");
var tst      = require("../../testutensils");

function ast2svg(pASTString, lWindow, pOptions, pRenderOptions) {
    // make a deep copy first, as renderAST actively modifies its input
    var lAST = JSON.parse(pASTString);

    renderer.clean("__svg", lWindow);
    if (Boolean(pOptions.useNew)){
        // var lRenderOptions = pRenderOptions || {};
        renderer.renderASTNew(lAST, lWindow, "__svg", pRenderOptions);
    } else if (Boolean(pOptions.includeSource)){
        renderer.renderAST(lAST, pASTString, "__svg", lWindow);
    } else {
        renderer.renderAST(lAST, null, "__svg", lWindow);
    }

    if (Boolean(pOptions.useOwnElement)){
        return lWindow.__svg.innerHTML;
    } else {
        return lWindow.document.body.innerHTML;
    }
}

describe('render/graphics/renderast', function() {
    describe('#renderAST in body', function() {
        const lWindow = new JSDOM("<html><body></body></html>").window;

        function processAndCompare(pExpectedFile, pInputFile, pOptions, pRenderOptions) {
            tst.assertequalProcessingXML(pExpectedFile, pInputFile, function(pInput) {
                return ast2svg(pInput, lWindow, pOptions, pRenderOptions);
            });
        }
        it('should be ok with an empty AST', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/astempty.svg'),
                path.join(__dirname, '../../fixtures/astempty.json'), {includeSource: true});
        });
        it('should given given a simple syntax tree, render an svg', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/astsimple.svg'),
                path.join(__dirname, '../../fixtures/astsimple.json'), {includeSource: true});
        });
        it('should given given a simple syntax tree, render an svg - with source omitted from svg', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/astsimplenosource.svg'),
                path.join(__dirname, '../../fixtures/astsimple.json'), false);
        });
        it('should not omit empty lines', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/astemptylinesinboxes.svg'),
                path.join(__dirname, '../../fixtures/astemptylinesinboxes.json'), {includeSource: true});
        });
        it('should render colors', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/rainbow.svg'),
                path.join(__dirname, '../../fixtures/rainbow.json'), {includeSource: true});
        });
        it('should render ids & urls', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/idsnurls.svg'),
                path.join(__dirname, '../../fixtures/idsnurls.json'), {includeSource: true});
        });
        it('should wrap text in boxes well', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/test19_multiline_lipsum.svg'),
                path.join(__dirname, '../../fixtures/test19_multiline_lipsum.json'), {includeSource: true});
        });
        it('should render empty inline expressions correctly', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/test20_empty_inline_expression.svg'),
                path.join(__dirname, '../../fixtures/test20_empty_inline_expression.json'), {includeSource: true});
        });
        it('should render "alt" lines in inline expressions correctly', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/test21_inline_expression_alt_lines.svg'),
                path.join(__dirname, '../../fixtures/test21_inline_expression_alt_lines.json'), {includeSource: true});
        });
        it('should render all possible arcs', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/test01_all_possible_arcs.svg'),
                path.join(__dirname, '../../fixtures/test01_all_possible_arcs.json'), {includeSource: true});
        });
        it('should render with a viewBox instead of a width & height', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/astautoscale.svg'),
                path.join(__dirname, '../../fixtures/astautoscale.json'), {includeSource: true});
        });
        it('should not render "mirrored entities" when not specified (inline expression last)', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/mirrorentities-off-inline-last.svg'),
                path.join(__dirname, '../../fixtures/mirrorentities-off-inline-last.json'),
                {includeSource: false, useNew: true});
        });
        it('should render "mirrored entities" when specified (inline expression last)', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/mirrorentities-on-inline-last.svg'),
                path.join(__dirname, '../../fixtures/mirrorentities-on-inline-last.json'),
                {includeSource: false, useNew: true},
                {mirrorEntitiesOnBottom: true});
        });
        it('should not render "mirrored entities" when not specified (regular arc last)', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/mirrorentities-off-regular-arc-last.svg'),
                path.join(__dirname, '../../fixtures/mirrorentities-off-regular-arc-last.json'),
                {includeSource: false, useNew: true},
                {mirrorEntitiesOnBottom: false});
        });
        it('should render "mirrored entities" when  specified (regular arc last)', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/mirrorentities-on-regular-arc-last.svg'),
                path.join(__dirname, '../../fixtures/mirrorentities-on-regular-arc-last.json'),
                {includeSource: false, useNew: true},
                {mirrorEntitiesOnBottom: true});
        });
        it('when style additions specified, they are included in the resulting svg', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/mirrorentities-on-regular-arc-last-with-style-additions.svg'),
                path.join(__dirname, '../../fixtures/mirrorentities-on-regular-arc-last.json'),
                {includeSource: false, useNew: true},
                {styleAdditions: ".an-added-class {}"});
        });
        it('when an existing style additions template is specified, that is included in the svg', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/mirrorentities-on-regular-arc-last-with-named-style-addition.svg'),
                path.join(__dirname, '../../fixtures/mirrorentities-on-regular-arc-last.json'),
                {includeSource: false, useNew: true},
                {additionalTemplate: "inverted"});
        });
        it('when an non-existing style additions template is specified, the svg styles are untouched', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/mirrorentities-off-regular-arc-last.svg'),
                path.join(__dirname, '../../fixtures/mirrorentities-on-regular-arc-last.json'),
                {includeSource: false, useNew: true},
                {additionalTemplate: "not an existing template"});
        });
        it('On arcs, self referencing arcs, broadcast arcs and boxes titles get rendered in a <title> element', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/titletags.svg'),
                path.join(__dirname, '../../fixtures/titletags.json'),
                {includeSource: false, useNew: true}
            );
        });
    });

    describe('#renderAST in own element', function() {
        const lWindow = new JSDOM("<html><body><span id='__svg'></span></body></html>").window;

        function processAndCompare(pExpectedFile, pInputFile, pIncludeSource, pUseOwnElement) {
            tst.assertequalProcessingXML(pExpectedFile, pInputFile, function(pInput) {
                return ast2svg(
                    pInput,
                    lWindow,
                    {
                        includeSource: pIncludeSource,
                        useOwnElement: pUseOwnElement
                    }
                );
            });
        }
        it('should be ok with an empty AST', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/astempty.svg'),
                path.join(__dirname, '../../fixtures/astempty.json'), true, true);
        });
        it('should given a simple syntax tree, render an svg', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/astsimple.svg'),
                path.join(__dirname, '../../fixtures/astsimple.json'), true, true);
        });
        it('should not bump boxes into inline expressions they\'re running in parallel with', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/bumpingboxes.svg'),
                path.join(__dirname, '../../fixtures/bumpingboxes.json'), true, true);
        });
        it('should render stuff running in parallel with inline expressions', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/inline-expressions-and-parallel-stuff.svg'),
                path.join(__dirname, '../../fixtures/inline-expressions-and-parallel-stuff.json'), true, true);
        });
        it('should wrap entity text when wordwrapentities is unspecified', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/wordwrapentitiesunspecified.svg'),
                path.join(__dirname, '../../fixtures/wordwrapentitiesunspecified.json'), true, true);
        });
        it('when wordwrapentities === false should only wrap at explicit line ends', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/wordwrapentitiesfalse.svg'),
                path.join(__dirname, '../../fixtures/wordwrapentitiesfalse.json'), true, true);
        });
        it('when wordwrapboxes === true should wrap things in boxes', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/wordwrapboxestrue.svg'),
                path.join(__dirname, '../../fixtures/wordwrapboxestrue.json'), true, true);
        });
        it('when wordwrapboxes === false should only wrap at explicit line ends', function() {
            processAndCompare(path.join(__dirname, '../../fixtures/wordwrapboxesfalse.svg'),
                path.join(__dirname, '../../fixtures/wordwrapboxesfalse.json'), true, true);
        });
    });

    describe('#renderAST arcskips', function() {
        const lWindow = new JSDOM("<html><body><span id='__svg'></span></body></html>").window;

        function processAndCompare(pExpectedFile, pInputFile, pIncludeSource, pUseOwnElement) {
            tst.assertequalProcessingXML(pExpectedFile, pInputFile, function(pInput) {
                return ast2svg(
                    pInput,
                    lWindow,
                    {
                        includeSource: pIncludeSource,
                        useOwnElement: pUseOwnElement
                    }
                );
            });
        }
        it('one row arcskip, with a row height <= normal row height', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/arcskip/arcskip01.svg'),
                path.join(__dirname, '../../fixtures/arcskip/arcskip01.json'), false, true);
        });

        it('two row arcskips, with row heights <= normal row height', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/arcskip/arcskip02.svg'),
                path.join(__dirname, '../../fixtures/arcskip/arcskip02.json'), false, true);
        });

        it('one row arcskips, with row height > normal row height; caused by current arc', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/arcskip/arcskip03.svg'),
                path.join(__dirname, '../../fixtures/arcskip/arcskip03.json'), false, true);
        });

        it('one row arcskips, with row height > normal row height; caused by another arc in the same row', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/arcskip/arcskip04.svg'),
                path.join(__dirname, '../../fixtures/arcskip/arcskip04.json'), false, true);
        });

        it('two row arcskips, with the row after it having a height > normal', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/arcskip/arcskip05.svg'),
                path.join(__dirname, '../../fixtures/arcskip/arcskip05.json'), false, true);
        });

        it('two row arcskips, with the row it should point to having a height > normal', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/arcskip/arcskip06.svg'),
                path.join(__dirname, '../../fixtures/arcskip/arcskip06.json'), false, true);
        });

        it('1/2 row arcskip, with a row height <= normal row height', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/arcskip/arcskip07.svg'),
                path.join(__dirname, '../../fixtures/arcskip/arcskip07.json'), false, true);
        });

        it('1.5 row arcskip, with a row height <= normal row height', function(){
            processAndCompare(path.join(__dirname, '../../fixtures/arcskip/arcskip08.svg'),
                path.join(__dirname, '../../fixtures/arcskip/arcskip08.json'), false, true);
        });
    });
});
