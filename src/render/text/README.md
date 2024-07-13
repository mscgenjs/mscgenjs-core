# Rendering text: other script languages

To be able to switch between the languages mscgen_js supports, the code contains
functions to convert abstract syntax trees back to text and some snazzy
modules to manipulate syntax trees.

## Language rendering

The modules that (re-)render language code from abstract syntax trees
have a _lot_ in common. So much, that most individual language can be
expressed as a configuration on one processing module. We've taken the
most expansive of the languages (Xù) as the base class and implemented
the other languages (and doxygen) as children.

- [ast2xu](ast2xu)
  - [ast2mscgen](ast2mscgen)
    - [ast2doxygen](ast2doxygen)
  - [ast2msgenny](ast2msgenny)

## Animation

:page_with_curl: code in [ast2animate.js](ast2animate.js)

## Language rendering: dot

Each sequence chart can be expressed as a communications diagram.
GraphViz dot is a textual language that can be used to specify
communications diagrams. ast2dot transforms an abstract syntax
tree into a dot program.

:page_with_curl: code in [ast2dot.js](ast2dot.js)
