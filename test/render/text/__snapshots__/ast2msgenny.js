// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`astSimpleParallel`] = `a,
b,
c;

b -> a : "{paral",
b =>> c : "lel}";
`;

exports[`astAllAttributes`] = `a : "Label for A";

a <<=>> a : "Label for a <<=>> a";
`;

exports[`astSimpleStar`] = `a,
b,
c;

b =>> *;
`;

exports[`astWithPreComment`] = `# pre comment
/* pre
 * multiline
 * comment
 */
a,
b;

a -> b;
`;

exports[`astOptions`] = `hscale="1.2",
width="800",
arcgradient="17",
wordwraparcs=true,
watermark="not in mscgen, available in xù and msgenny";

a;

`;

exports[`astSimpleSpace`] = `"space space";

`;

exports[`astSimpleComma`] = `a : "comma,";

`;

exports[`astSimpleSemiColon`] = `a : "semi; colon";

`;

exports[`astSimple`] = `a,
"b space";

a => "b space" : "a simple script";
`;

exports[`entityWithMscGenKeywordAsName`] = `note;

`;

exports[`astOneAlt`] = `a,
b,
c;

a => b;
b alt c {
  b => c;
  c >> b;
};
`;

exports[`astAltWithinLoop`] = `a,
b,
c;

a => b;
a loop c : "label for loop" {
  b alt c : "label for alt" {
    b -> c : "-> within alt";
    c >> b : ">> within alt";
  };
  b >> a : ">> within loop";
};
a =>> a : "happy-the-peppy - outside";
...;
`;

exports[`astEmptyInlineExpression`] = `a,
b;

a opt b {
};
`;
module.exports = exports;
