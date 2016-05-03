const assert   = require("assert");
const renderer = require("../../../render/text/ast2dot");
const fix      = require("../../astfixtures.json");
const fs       = require("fs");
const path     = require("path");

describe('render/text/ast2dot', () => {
    describe('#renderAST() - mscgen classic compatible - simple syntax trees', () => {

        it('should, given a simple syntax tree, render a dot script', () => {
            const lProgram = renderer.render(fix.astSimple);
            const lExpectedProgram =
`/* Sequence chart represented as a directed graph
 * in the graphviz dot language (http://graphviz.org/)
 *
 * Generated by mscgen_js (https://sverweij.github.io/mscgen_js)
 */

graph {
  rankdir=LR
  splines=true
  ordering=out
  fontname="Helvetica"
  fontsize="9"
  node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]
  edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]

  "a" [label="a"];
  "b space" [label="b space"];

  "a" -- "b space" [label="(1) a simple script", arrowhead="normal"]
}`;
            assert.equal(lProgram, lExpectedProgram);
        });
        it('should, given a syntax tree with boxes, render a dot script', () => {
            const lProgram = renderer.render(fix.astBoxArcs);
            const lExpectedProgram =
`/* Sequence chart represented as a directed graph
 * in the graphviz dot language (http://graphviz.org/)
 *
 * Generated by mscgen_js (https://sverweij.github.io/mscgen_js)
 */

graph {
  rankdir=LR
  splines=true
  ordering=out
  fontname="Helvetica"
  fontsize="9"
  node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]
  edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]

  "a" [label="a"];
  "b" [label="b"];
  "c" [label="c"];
  "d" [label="d"];

  box1 [shape="note"]
  box1 -- {"a","a"} [style="dotted", dir="none"]
  box2 [shape="box"]
  box2 -- {"b","b"} [style="dotted", dir="none"]
  box3 [shape="hexagon"]
  box3 -- {"c","c"} [style="dotted", dir="none"]
  box4 [style="rounded", shape="box"]
  box4 -- {"d","d"} [style="dotted", dir="none"]
}`;
            assert.equal(lProgram, lExpectedProgram);
        });

    });

    describe('#renderAST() - xu compatible', () => {
        it('alt only - render correct script', () => {
            const lProgram = renderer.render(fix.astOneAlt);
            const lExpectedProgram =
`/* Sequence chart represented as a directed graph
 * in the graphviz dot language (http://graphviz.org/)
 *
 * Generated by mscgen_js (https://sverweij.github.io/mscgen_js)
 */

graph {
  rankdir=LR
  splines=true
  ordering=out
  fontname="Helvetica"
  fontsize="9"
  node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]
  edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]

  "a" [label="a"];
  "b" [label="b"];
  "c" [label="c"];

  "a" -- "b" [label="(1)", arrowhead="normal"]\n  \n  subgraph cluster_2{
   label="alt: (2)" labeljust="l"
    "b" -- "c" [label="(3)", arrowhead="normal"]
    "c" -- "b" [label="(4)", style="dashed"]
  }
}`;
            assert.equal(lProgram, lExpectedProgram);
        });
        it('alt within loop - render correct script', () => {
            const lProgram = renderer.render(fix.astAltWithinLoop);
            const lExpectedProgram =
`/* Sequence chart represented as a directed graph
 * in the graphviz dot language (http://graphviz.org/)
 *
 * Generated by mscgen_js (https://sverweij.github.io/mscgen_js)
 */

graph {
  rankdir=LR
  splines=true
  ordering=out
  fontname="Helvetica"
  fontsize="9"
  node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]
  edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]

  "a" [label="a"];
  "b" [label="b"];
  "c" [label="c"];

  "a" -- "b" [label="(1)", arrowhead="normal"]\n  \n  subgraph cluster_2{
   label="loop: (2) label for loop" labeljust="l"\n    \n    subgraph cluster_3{
     label="alt: (3) label for alt" labeljust="l"
      "b" -- "c" [label="(4) -> within alt", arrowhead="rvee"]
      "c" -- "b" [label="(5) >> within alt", style="dashed"]
    }
    "b" -- "a" [label="(6) >> within loop", style="dashed"]
  }
  "a" -- "a" [label="(7) happy-the-peppy - outside"]
}`;
            assert.equal(lProgram, lExpectedProgram);
        });
    });

    describe('#renderAST() - file based tests', () => {
        it('should render all arcs', () => {
            const lASTString = fs.readFileSync(path.join(__dirname, "../../fixtures/test01_all_possible_arcs_mscgen.json"), {"encoding":"utf8"});
            const lAST = JSON.parse(lASTString);
            const lExpectedProgram = fs.readFileSync(path.join(__dirname, "../../fixtures/test01_all_possible_arcs_mscgen.dot"), {"encoding":"utf8"});
            const lProgram = renderer.render(lAST);
            assert.equal(lProgram, lExpectedProgram);
        });
    });
});
