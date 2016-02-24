var fix = require("../astfixtures.json");

module.exports = {
    programASTPairs : [{
            title: 'should render a simple AST',
            program: 'msc { a,"b space"; a => "b space" [label="a simple script"];}',
            ast: fix.astSimple
        },{
            title: 'should render a simple AST - regardless of start marker case',
            program: 'MsC { a,"b space"; a => "b space" [label="a simple script"];}',
            ast: fix.astSimple
        },{
            title: 'should ignore c++ style one line comments',
            program: 'msc { a,"b space"; a => "b space" [label="a simple script"];}//ignored',
            ast: fix.astSimple
        },{
            title: 'should produce an (almost empty) AST for empty input',
            program: 'msc{}',
            ast: fix.astEmpty
        },{
            title: 'should produce an AST even when non entity arcs are its only content',
            program: 'msc{--- [label="start"]; ... [label="no entities ..."]; ---[label="end"];}',
            ast: fix.astNoEntities
        },{
            title: 'should produce lowercase for upper/ mixed case arc kinds',
            program: 'msc { a, b, c, d; a NoTE a, b BOX b, c aBox c, d rbOX d;}',
            ast: fix.astBoxArcs
        },{
            title: 'should produce lowercase for upper/ mixed case options',
            program: 'msc{HSCAle=1.2, widtH=800, ARCGRADIENT="17",woRDwrAParcS="oN";a;}',
            ast: fix.astOptionsMscgen
        },{
            title: 'should produce lowercase for upper/ mixed case attributes',
            program: 'msc{a [LaBEL="miXed", teXTBGcolOR="orange"]; a NOte a [LINEcolor="red", TEXTColoR="blue", ArcSkip="4"];}',
            ast: fix.astMixedAttributes
        },{
            title: 'should translate *colour to *color',
            program: 'msc { a [textcolOUr="green", textBGColour="cyan", linecolour="#ABCDEF"];}',
            ast: fix.astColourColor
        },{
            title: 'should parse all possible attributes',
            program: 'msc {\n\
a [label="Label for A", idurl="http://localhost/idurl", id="Just and id", url="http://localhost/url", linecolor="#ABCDEF", textcolor="green", textbgcolor="cyan", arclinecolor="violet", arctextcolor="pink", arctextbgcolor="brown"];\n\
\n\
a <<=>> a [label="Label for a <<=>> a", idurl="http://localhost/idurl", id="Just and id", url="http://localhost/url", linecolor="#ABCDEF", textcolor="green", textbgcolor="cyan"];\n\
}',
            ast: fix.astAllAttributes
        },{
            title: 'should generate arcs to all other arcs with bare *',
            program: 'msc {arcgradient="18"; "ω","ɑ","β","ɣ"; "ɑ" -> * [label="ɑ -> *"]; * <- "β" [label="* <- β"]; "ɣ" <-> * [label="ɣ <-> *"];}',
            ast: fix.astAsteriskBoth
        },{
            title: 'should generate arcs to all other arcs with quoted "*"',
            program: 'msc {arcgradient="18"; "ω","ɑ","β","ɣ"; "ɑ" -> "*" [label="ɑ -> *"]; "*" <- "β" [label="* <- β"]; "ɣ" <-> "*" [label="ɣ <-> *"];}',
            ast: fix.astAsteriskBoth
        },{
            title: 'unicode is cool for quoted entity names',
            program: 'msc{"序";}',
            ast: fix.unicodeentityname
        },{
            title: 'true is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs=true;}',
            ast: fix.astWorwraparcstrue
        },{
            title: '"true" is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs="true";}',
            ast: fix.astWorwraparcstrue
        },{
            title: 'on is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs=on;}',
            ast: fix.astWorwraparcstrue
        },{
            title: '"on" is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs="on";}',
            ast: fix.astWorwraparcstrue
        },{
            title: '1 is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs=1;}',
            ast: fix.astWorwraparcstrue
        },{
            title: '"1" is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs="1";}',
            ast: fix.astWorwraparcstrue
        },{
            title: 'false is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs=false;}',
            ast: fix.astWorwraparcsfalse
        },{
            title: '"false" is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs="false";}',
            ast: fix.astWorwraparcsfalse
        },{
            title: 'off is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs=off;}',
            ast: fix.astWorwraparcsfalse
        },{
            title: '"off" is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs="off";}',
            ast: fix.astWorwraparcsfalse
        },{
            title: '0 is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs=0;}',
            ast: fix.astWorwraparcsfalse
        },{
            title: '"0" is a boolean for wordwraparcs',
            program: 'msc { wordwraparcs="0";}',
            ast: fix.astWorwraparcsfalse
        }
    ],
    syntaxErrors : [
        {
            title: 'should throw a SyntaxError on an invalid program',
            program: 'a'
        },{
            title: 'should throw a SyntaxError on asterisks on both sides for uni-directional arrows (->)',
            program: 'msc{a,b,c; * -> *;}'
        },{
            title: 'should throw a SyntaxError on asterisks on both sides for uni-directional arrows (<-)',
            program: 'msc{a,b,c; * <- *;}'
        },{
            title: 'should throw a SyntaxError on asterisks on both sides for bi-directional arrows',
            program: 'msc{a,b,c; * <-> *;}'
        },{
            title: 'should throw a SyntaxError for asterisks on LHS on bi-directional arrows',
            program: 'msc{a,b,c; * <-> a;}'
        },{
            title: 'should throw a SyntaxError on a program with only the start token',
            program: 'msc'
        },{
            title: 'should throw a SyntaxError on a program with shizzle after the closing statement',
            program: 'msc{a;} shizzle after the closing statement'
        },{
            title: 'unicode is cool. But not yet for unquoted entity names',
            program: 'msc{序;}'
        },{
            title: 'should throw a SyntaxError on an invalid program',
            program: 'msc{a}'
        },{
            title: 'should throw a SyntaxError on an invalid arc type',
            program: 'msc{a, b; a xx b;}'
        },{
            title: 'should throw a SyntaxError on an invalid option',
            program: 'msc{wordwarparcs="true"; a, b; a -> b;}'
        },{
            title: 'should throw a SyntaxError on an invalid value for an option',
            program: 'msc{wordwraparcs=\u0181; a, b; a -> b;}'
        },{
            title: 'should throw a SyntaxError on a missing semi colon after the options list',
            program: 'msc{wordwraparcs="true" a, b; a -> b;}'
        },{
            title: 'should throw a SyntaxError on a missing semi colon',
            program: 'msc{wordwraparcs="true"; a, b; a -> b}'
        },{
            title: 'should throw a SyntaxError for a * on the RHS of x-',
            program: 'msc{a,b,c; b x- *;}'
        },{
            title: 'should throw a SyntaxError for a * on the LHS of -x',
            program: 'msc{a,b,c; * -x b;}'
        },{
            title: 'should throw a SyntaxError on a missing program closer',
            program: 'msc{wordwraparcs="true"; a, b; a -> b;'
        },{
            title: 'should throw a SyntaxError on a invalid entity attribute',
            program: 'msc{a[invalidentitityattribute="invalid"];}'
        },{
            title: 'should throw a SyntaxError on a missing closing bracket on an entity',
            program: 'msc{a[label="missing closing bracket";}'
        },{
            title: 'should throw a SyntaxError on a invalid arc attribute',
            program: 'msc{a, b; a -> b[invalidearcattribute="invalid"];}'
        },{
            title: 'should throw a SyntaxError on a missing closing bracket on an arc',
            program: 'msc{a, b; a -> b[label="missing closing bracket";}'
        },{
            title: 'should throw a SyntaxError on a missing closing bracket',
            program: 'msc{a, b; a -> b[label="missingmscbracket"];'
        },{
            title: 'should complain about an undeclared entity in a from',
            program: 'msc{a,b,c;d=>a;}',
            error: 'EntityNotDefinedError'
        },{
            title: 'should complain about an undeclared entity in a to',
            program: 'msc{a,b,c;b=>f;}',
            error: 'EntityNotDefinedError'
        },{
            title: 'should throw a SyntaxError when a keyword is used for an entity name',
            program: 'msc{a,note,b,c; a => note;}'
        },{
            title: 'should throw a SyntaxError when passing a boolean to something expecting numbers',
            program: 'msc{wordwraparcs=true, width=true; a;}'
        },{
            title: 'should throw a SyntaxError when passing a boolean-like string to something expecting numbers',
            program: 'msc{wordwraparcs=true, width="true"; a;}'
        },{
            title: 'should throw a SyntaxError when passing a non-number like string to something expecting numbers',
            program: 'msc{wordwraparcs=true, hscale="general string"; a;}'
        },{
            title: 'should throw a SyntaxError when passing a number to something expecting booleans',
            program: 'msc{wordwraparcs=481; a;}'
        },{
            title: 'should throw a SyntaxError when passing a number-like string to something expecting booleans',
            program: 'msc{wordwraparcs="481"; a;}'
        },{
            title: 'should throw a SyntaxError when passing a non boolean-like string to something expecting booleans',
            program: 'msc{wordwraparcs="general string"; a;}'
        },{
            title: 'should throw a SyntaxError when passing a boolean to something expecting size',
            program: 'msc{width=true; a;}'
        },{
            title: 'should throw a SyntaxError when passing a boolean-like string to something expecting size',
            program: 'msc{width="true"; a;}'
        },{
            title: 'should throw a SyntaxError when passing a non-number like string to something expecting size',
            program: 'msc{width="general string"; a;}'
        }
    ]
};
