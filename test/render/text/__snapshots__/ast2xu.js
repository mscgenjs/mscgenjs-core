// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`astAllPossibleArcs`] = `# test01: all possible arcs
msc {
  hscale="0.6",
  arcgradient="18",
  wordwraparcs=false,
  watermark="This humongous fictive chart contains all arcs possible in xù. It can be used for spot checks, but also for performance checks.";

  0 [linecolor="white", textcolor="white", arclinecolor="white", arctextcolor="grey"],
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  j,
  k;

  a -- b [label="left to right", linecolor="white", textcolor="grey"],
  b -- c [label="right to left", linecolor="white", textcolor="grey"],
  c -- d [label="left to right\\nbi-directional\\n\\n", linecolor="white", textcolor="grey"],
  d -- e [label="right to left\\nbi-directional\\n\\n", linecolor="white", textcolor="grey"],
  e -- f [label="left to right\\nnon-directional\\n\\n", linecolor="white", textcolor="grey"],
  f -- g [label="left to right\\nnon-directional\\n\\n", linecolor="white", textcolor="grey"],
  g -- h [label="left to right\\nself reference\\n\\n", linecolor="white", textcolor="grey"],
  h -- i [label="right to left\\nself reference\\n\\n", linecolor="white", textcolor="grey"],
  i -- j [label="bi-directional\\nself reference\\n\\n", linecolor="white", textcolor="grey"],
  j -- k [label="non-directional\\nself reference\\n\\n", linecolor="white", textcolor="grey"];
  0 -- a [label="signal"],
  a -> b [label="a -> b"],
  b <- c [label="b <- c"],
  c <-> d [label="c <-> d"],
  e <-> d [label="e <-> d"],
  e -- f [label="e -- f"],
  g -- f [label="g -- f"],
  g -> g [label="g -> g"],
  h <- h [label="h <- h"],
  i <-> i [label="i <-> i"],
  j -- j [label="j -- j"];
  0 -- a [label="method"],
  a => b [label="a => b"],
  b <= c [label="b <= c"],
  c <=> d [label="c <=> d"],
  e <=> d [label="e <=> d"],
  e == f [label="e == f"],
  g == f [label="g == f"],
  g => g [label="g => g"],
  h <= h [label="h <= h"],
  i <=> i [label="i <=> i"],
  j == j [label="j == j"];
  0 -- a [label="return"],
  a >> b [label="a >> b"],
  b << c [label="b << c"],
  c <<>> d [label="c <<>> d"],
  e <<>> d [label="e <<>> d"],
  e .. f [label="e .. f"],
  g .. f [label="g .. g"],
  g >> g [label="g >> g"],
  h << h [label="h << h"],
  i <<>> i [label="i <<>> i"],
  j .. j [label="j .. j"];
  0 -- a [label="callback"],
  a =>> b [label="a =>> b"],
  b <<= c [label="b <<= c"],
  c <<=>> d [label="c <<=>> d"],
  e <<=>> d [label="e <<=>> d"],
  g =>> g [label="g =>> g"],
  h <<= h [label="g <<= g"],
  i <<=>> i [label="i <<=>>i "];
  0 -- a [label="lost"],
  a -x b [label="a -x b"],
  b x- c [label="b x- c"],
  g -x g [label="g -x g"],
  h x- h [label="h x- h"];
  0 -- a [label="emphasised"],
  a :> b [label="a :> b"],
  b <: c [label="b <: c"],
  c <:> d [label="c <:> d"],
  e <:> d [label="e <:> d"],
  e :: f [label="e :: f"],
  g :: f [label="g :: f"],
  g :> g [label="g :> g"],
  h <: h [label="h <: h"],
  i <:> i [label="i <:> i"],
  j :: j [label="j :: j"];
  0 -- a [label="note"],
  b note c [label="b note c"],
  e note d [label="e note d"],
  g note g [label="g note g"];
  0 -- a [label="box"],
  b box c [label="b box c"],
  e box d [label="e box d"],
  g box g [label="g box g"];
  0 -- a [label="rbox"],
  b rbox c [label="b rbox c"],
  e rbox d [label="e rbox d"],
  g rbox g [label="g rbox g"];
  0 -- a [label="abox"],
  b abox c [label="b abox c"],
  e abox d [label="e abox d"],
  g abox g [label="g abox g"];
  0 -- a [label="empty row"],
  ||| [label="|||"];
  ... [label="...\\n(omitted row)"];
  0 -- a [label="comment"],
  --- [label="---"];
  0 -- a [label="broadcasts"];
  a -> * [label="a -> *"];
  * <- c [label="* <- c"];
  b <-> * [label="b <-> *"];
  d => * [label="d => *"];
  * <= e [label="* <= e"];
  d <=> * [label="d <=> *"];
  f >> * [label="f >> *"];
  * << g [label="* << g"];
  f <<>> * [label="f <<>> *"];
  h =>> * [label="h =>> *"];
  * <<= i [label="* <<= i"];
  h <<=>> * [label="h <<=>> *"];
  j -x * [label="j -x *"];
  * x- k [label="* x- k"];
  a :> * [label="a :> *"];
  * <: c [label="* <: c"];
  b <:> * [label="b <:> *"];
  ---;
  0 -- a [label="inline\\nexpressions"];
  b alt k [label="b alt k"] {
    c else j [label="c else j"] {
      d opt i [label="d opt i"] {
        e break h [label="e break k"] {
          f critical g [label="f critical g"] {
            ---;
          };
        };
      };
    };
  };
  b neg k [label="b neg k"] {
    b strict j [label="b strict j"] {
      b seq i [label="b seq i"] {
        b assert h [label="b assert h"] {
          b exc g [label="b exc g"] {
            ---;
          };
        };
      };
    };
  };
  b ref k [label="b ref k"] {
    c consider k [label="c consider k"] {
      k ignore d [label="k ignore d"] {
        e loop k [label="e loop k"] {
          k par f [label="k par f"] {
            ---;
          };
        };
      };
    };
  };
  ||| [label="options used: hscale=\\"0.6\\", arcgradient=\\"18\\""];
}`;

exports[`astOptionsMinified`] =
  `msc{hscale="1.2",width="800",arcgradient="17",wordwraparcs=true,watermark="not in mscgen, available in xù and msgenny";a;}`;

exports[`astBoxesMinified`] = `msc{a,b;a note b;a box a,b rbox b;b abox a;}`;

exports[`astOptionsMscgen`] = `msc {
  hscale="1.2",
  width="800",
  arcgradient="17",
  wordwraparcs=true;

  a;

}`;

exports[`astSimpleParallel`] = `msc {
  a,
  b,
  c;

  b -> a [label="{paral"],
  b =>> c [label="lel}"];
}`;

exports[`astAttributes`] = `msc {
  Alice [linecolor="#008800", textcolor="black", textbgcolor="#CCFFCC", arclinecolor="#008800", arctextcolor="#008800"],
  Bob [linecolor="#FF0000", textcolor="black", textbgcolor="#FFCCCC", arclinecolor="#FF0000", arctextcolor="#FF0000"],
  pocket [linecolor="#0000FF", textcolor="black", textbgcolor="#CCCCFF", arclinecolor="#0000FF", arctextcolor="#0000FF"];

  Alice => Bob [label="do something funny"];
  Bob => pocket [label="fetch (nose flute)", textcolor="yellow", textbgcolor="green", arcskip="0.5"];
  Bob >> Alice [label="PHEEE!", textcolor="green", textbgcolor="yellow", arcskip="0.3"];
  Alice => Alice [label="hihihi", linecolor="#654321"];
}`;

exports[`astWithPreComment`] = `# pre comment
/* pre
 * multiline
 * comment
 */
msc {
  a,
  b;

  a -> b;
}`;

exports[`astSimpleMinified`] =
  `msc{a,"b space";a => "b space"[label="a simple script"];}`;

exports[`astSimple`] = `msc {
  a,
  "b space";

  a => "b space" [label="a simple script"];
}`;

exports[`astEntityWithMscGenKeywordAsName`] = `msc{"note";}`;

exports[`astDeActivate`] = `msc{a,b;a => b[activation=false];}`;

exports[`astActivate`] = `msc{a,b;a => b[activation=true];}`;

exports[`astTitleOnArc`] =
  `msc{a,b;a => b[label="the label",title="The title meister strikes again"];}`;

exports[`astOneAlt`] = `msc {
  a,
  b,
  c;

  a => b;
  b alt c {
    b => c;
    c >> b;
  };
}`;

exports[`astAltWithinLoop`] = `msc {
  a,
  b,
  c;

  a => b;
  a loop c [label="label for loop"] {
    b alt c [label="label for alt"] {
      b -> c [label="-> within alt"];
      c >> b [label=">> within alt"];
    };
    b >> a [label=">> within loop"];
  };
  a =>> a [label="happy-the-peppy - outside"];
  ...;
}`;

exports[`astEmptyInlineExpression`] = `msc {
  a,
  b;

  a opt b {
  };
}`;
module.exports = exports;
