# mscgen_js' innards
Here's some notes to ease the job of maintaining mscgen_js. It attempts to describe **how** it does
what it does and it tries to **explain** some of the **choices**.

The **main steps** mscgen_js takes to get from a textual description to
a picture:
- [_lexical analysis and parsing_](#lexical-analysis-and-parsing) to an abstract syntax tree.
- [_rendering_](#rendering-graphics) that abstract syntax tree into a picture.
- Besides these two steps it is useful to have some sort of
  [_controler_](#the-controllers) program that handles interaction with the user.
  We have four of them:
  - for [_embedding_][mscgenjs.embed.source.rationale] textual descriptions in html
  - for the interactive [_interpreter_](https://github.com/sverweij/mscgen_js)
  - for the [_command line interface_](https://github.com/sverweij/mscgenjs-cli)
  - for the [atom editor package](https://github.com/sverweij/atom-mscgen-preview)

## Lexical analysis and parsing
:page_with_curl: code in [../parse/peg](../parse/peg)

We wrote the parsers for `MscGen`, `MsGenny` and `Xù` with
PEG.js. This is a parser generator that smashes the tasks of lexical
analysis and parsing together. In the [parser folder](../parse/README.md) we describe
* [how to generate the parsers from pegjs](../parse/README.md#generating-the-parsers)
* [the structure of and principles behind the abstract syntax trees](../parse/README.md#the-abstract-syntax-tree)


## Rendering
### Rendering graphics
:page_with_curl: code in [../render/graphics/](../render/graphics)

*mscgen_js* by default renders its graphics to _scalable vector graphics_ (SVG).
In the [render folder](../render/graphics/README.md) we
- motivate this choice,
- describe how our SVG is structured and
- how the rendering programs fill it.

### Rendering text
:page_with_curl: code in [../render/text/](../render/text)

To **translate** between the three sequence chart languages it supports and to
**generate** and **manipulate** other languages.

### Raster graphics?
:page_with_curl: code in
[sverweij/mscgen_js/.../interpreter/raster-exporter.js][mscgenjs.rasterexport.source]

You might have noticed the [interpreter](https://sverweij.github.io/mscgen_js)
also renders to jpeg and png. It uses the canvg library and it is _really_
trivial.


## The controllers
These are not in the 'core' package and serve as a reference of how mscgenjs
can be used.

### Embedding
:page_with_curl: code in [sverweij/mscgen_js/.../mscgen-inpage.js][mscgenjs.embed.source]

The controller for embedding is actually very simple. Details on how it works
and what design choices we made you can find [here][mscgenjs.embed.source.rationale]

### Interactive interpreter
:page_with_curl: code in [sverweij/mscgen_js/.../interpreter][mscgenjs.interpreter.source]

The controller for the interpreter UI is less trivial.

### Command line interface
:page_with_curl: code in [sverweij/mscgenjs-cli][mscgenjs.cli.source]

### Atom preview package
:page_with_curl: code in [sverweij/atom-mscgen-preview][mscgen-preview.source]

## Testing
:page_with_curl: code in [../test/](../test)

About 340 automated tests (and counting) make sure we can refactor the mscgen_js
core modules safely.

[mscgen-preview.source]: https://github.com/sverweij/atom-mscgen-preview
[mscgenjs.cli.source]: https://github.com/sverweij/mscgenjs-cli
[mscgenjs.embed.source]: https://github.com/sverweij/mscgen_js/blob/master/src/script/mscgen-inpage.js
[mscgenjs.embed.source.rationale]: https://github.com/sverweij/mscgen_js/blob/master/src/script/embedding-controller.md
[mscgenjs.interpreter.source]: https://github.com/sverweij/mscgen_js/blob/master/src/script/interpreter
[mscgenjs.rasterexport.source]: https://github.com/sverweij/mscgen_js/blob/master/src/script/interpreter/raster-exporter.js
