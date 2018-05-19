const astfixtures = require("../astfixtures.json");

module.exports = {
    programASTPairs : [{
        title: 'should render an AST, with an alt in it',
        program: 'msc { a,b,c; a => b; b alt c { b => c; c >> b; };}',
        ast: astfixtures.astOneAlt
    }, {
        title: 'should accept empty inline expressions',
        program: 'Xu{a, b; a opt b{};}',
        ast: astfixtures.emptyinlineexpression
    }, {
        title: 'should render an AST, with a loop and an alt in it',
        program: 'msc { a,b,c; a => b; a loop c [label="label for loop"] { b alt c [label="label for alt"]{ b -> c [label="-> within alt"]; c >> b [label=">> within alt"]; }; b >> a [label=">> within loop"];}; a =>> a [label="happy-the-peppy - outside"];...;}',
        ast: astfixtures.astAltWithinLoop
    }, {
        title: 'should render an AST, with a "title" attribute on an arc',
        program: 'xu { a,b; a => b [label="the label", title="The title meister strikes again"];}',
        ast: astfixtures.astTitleOnArc
    }],
    syntaxErrors : [{
        title: 'should throw a SyntaxError on a missing closing bracket',
        program: 'msc {a,b; a loop b {'
    }, {
        title: 'should throw a SyntaxError on a missing closing bracket',
        program: 'msc {a,b; a loop b {a=>b;'
    }, {
        title: 'should throw a SyntaxError on a missing closing bracket',
        program: 'msc {a,b; a loop b {}'
    }, {
        title: 'should throw a SyntaxError on a missing semi colon after a closing bracket',
        program: 'msc {a,b; a loop b ['
    }, {
        title: 'should throw a SyntaxError on a missing a value for an attribute',
        program: 'msc {a,b; a loop b [label'
    }, {
        title: 'should throw a SyntaxError on a missing a closing bracket after a valid option',
        program: 'msc {a,b; a loop b [label="brackets missing"'
    }, {
        title: 'should throw an EntityNotDefinedError on a missing entity somewhere deeply nested',
        program: 'msc {a,b; a loop b {c => b;};}',
        error: 'EntityNotDefinedError'
    }, {
        title: 'should throw a SyntaxError when passing a boolean to something expecting a string',
        program: 'msc{watermark=true; a;}'
    }, {
        title: 'should throw a SyntaxError when passing a cardinal to something expecting a string',
        program: 'msc{watermark=481; a;}'
    }, {
        title: 'should throw a SyntaxError when passing a real to something expecting a string',
        program: 'msc{watermark=481.1337; a;}'
    }, {
        title: 'should throw a SyntaxError when passing a size to something expecting a string',
        program: 'msc{watermark=auto; a;}'
    }]
};
