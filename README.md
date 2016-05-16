# mscgen_js - core package
Implementation of [MscGen][mscgen] and two derived languages in JavaScript.

> This is the JavaScript _library_ that takes care of parsing and
> rendering MscGen. You might be looking for one of these in stead:
> - [**online interpreter** - mscgen_js][mscgenjs.interpreter]
> - [**atom package** - mscgen-preview][mscgen-preview]
> - [**command line interface** - mscgenjs-cli][mscgenjs.cli]
> - [how to **embed MscGen in html**][mscgenjs.embed].

## Features
- Parses and renders [MscGen][mscgen]
  - Accepts all valid [MscGen][mscgen] programs and render them correctly.
  - All valid MscGen programs accepted by mscgen_js are also accepted and
    rendered correctly by the original `mscgen` command.
  - If you find proof to the contrary: [tell us][mscgenjs.issues.compliance].
- Parses and renders [Xù][mscgenjs.wikum.xu]    
  Xù is a strict superset of MscGen. It adds things like `alt` and
  `loop`.
- Parses and renders [MsGenny][mscgenjs.wikum.msgenny]    
  Same as Xù, but with a simpler syntax.
- Translates between these three languages
- Spits out svg, GraphViz dot, doxygen and JSON.
- runs in all modern browsers (and in _Node.js_).

## I'm still here. How can I use this?
You already know how to `npm install mscgenjs`, right?

Good. For examples on how to use the mscgen_js core package, have a look at
the source code of any of the above mentioned tools.
- the atom package [mscgen-preview][mscgen-preview.source] (CoffeeScript alert)
  - specifically the [renderer][mscgen-preview.source.render]
  - ... which is just 6 lines of code
- the [embedder][mscgenjs.embed.source] (Any modern browser. Using require.js)
- the [unit tests][mscgenjs.unit] from mscgenjs-core itself:
  - [parse][mscgenjs.unit.parse] (Node.js)
  - [render][mscgenjs.unit.render] (Node.js with jsdom)
- the [on line interpreter][mscgenjs.interpreter.source] (Any modern browser.
  Using require.js)
  - ~ [where parsing happens][mscgenjs.interpreter.source.parse]
  - ~ [where rendering happens][mscgenjs.interpreter.source.render]
- the [command line interface][mscgenjs.cli.source] (Node.js, PhantomJS and
  some spit)

Hint: for rendering graphics the library needs a DOMElement (with a
unique id) to perform its rendering in.

### Building mscgen_js
See [build.md][mscgenjs.docbuild].

### How does mscgen_js work?
You can start reading about that [over here](wikum/readme.md)

## License
This software is free software [licensed under GPLv3][mscgenjs.license].
This means (a.o.) you _can_ use it as part of other free software, but
_not_ as part of non free software.

### Dependencies and their licenses
We built mscgen_js on various libraries, each of which have their own
license (incidentally all MIT style):
- mscgen_js uses [requirejs][requirejs.license] and [amdefine][amdefine.license]
  for modularization.
- We generated its parsers with [pegjs][pegjs.license].
- mscgen_js automated tests use [mocha][21], [chai][39],
  [chai-xml][40] and [jsdom][jsdom.license].

It uses [istanbul][28], [eslint][22], [plato][23] and [nsp][35] to maintain some
modicum of verifiable code quality. You can see the build history in
[Travis][travis.mscgenjs] and an indication of the shape of the code at [Code
Climate][codeclimate.mscgenjs].

## Thanks
- [Mike McTernan][mscgen.author] for creating the wonderful
  MscGen language, the accompanying c implementation and for releasing both
  to the public domain (the last one under a [GPLv2][mscgen.license] license
  to be precise).
- [David Majda][pegjs.author] for cooking and maintaining the fantastic
  and lightning fast [PEG.js][pegjs] parser generator.
- [Elijah Insua][jsdom.author] for [jsdom][jsdom], which allows us to
  test rendering vector graphics in Node.js without having to resort
  to outlandish hacks.

## Build status
[![Build Status][travis.mscgenjs.badge]][travis.mscgenjs]
[![Code Climate][codeclimate.mscgenjs.badge]][codeclimate.mscgenjs]
[![test coverage (codecov.io)][codecov.mscgenjs.badge]][codecov.mscgenjs]
[![Dependency Status][david.mscgenjs.badge]][david.mscgenjs]
[![devDependency Status][daviddev.mscgenjs.badge]][daviddev.mscgenjs]
[![npm stable version](https://img.shields.io/npm/v/mscgenjs.svg)](https://npmjs.com/package/mscgenjs)
[![total downloads on npm](https://img.shields.io/npm/dt/mscgenjs.svg)](https://npmjs.com/package/mscgenjs)
[![GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](LICENSE.md)

[amdefine.license]: wikum/licenses/license.amdefine.md
[atom]: https://atom.io
[codeclimate.mscgenjs]: https://codeclimate.com/github/sverweij/mscgenjs-core
[codeclimate.mscgenjs.badge]: https://codeclimate.com/github/sverweij/mscgenjs-core/badges/gpa.svg
[codecov.mscgenjs]: http://codecov.io/github/sverweij/mscgenjs-core?branch=master
[codecov.mscgenjs.badge]: http://codecov.io/github/sverweij/mscgenjs-core/coverage.svg?branch=master
[daviddev.mscgenjs]: https://david-dm.org/sverweij/mscgenjs-core#info=devDependencies
[daviddev.mscgenjs.badge]: https://david-dm.org/sverweij/mscgenjs-core/dev-status.svg
[david.mscgenjs]: https://david-dm.org/sverweij/mscgenjs-core
[david.mscgenjs.badge]: https://david-dm.org/sverweij/mscgenjs-core.svg
[jsdom]: https://github.com/tmpvar/jsdom
[jsdom.author]: http://tmpvar.com/
[jsdom.license]: wikum/licenses/license.jsdom.md
[license.gpl-3.0]: http://www.gnu.org/licenses/gpl.html
[mscgen]: http://www.mcternan.me.uk/mscgen
[mscgen.author]: http://www.mcternan.me.uk/mscgen
[mscgen.license]: http://code.google.com/p/mscgen/source/browse/trunk/COPYING
[mscgen-preview]: https://atom.io/packages/mscgen-preview
[mscgen-preview.source]: https://github.com/sverweij/atom-mscgen-preview
[mscgen-preview.source.render]: https://github.com/sverweij/atom-mscgen-preview/blob/master/lib/renderer.coffee
[mscgenjs.cli]: https://www.npmjs.com/package/mscgenjs-cli
[mscgenjs.cli.source]: https://github.com/sverweij/mscgenjs-cli
[mscgenjs.docbuild]: wikum/build.md
[mscgenjs.docsource]: wikum/README.md
[mscgenjs.embed]: https://sverweij.github.io/mscgen_js/embed.html?utm_source=mscgenjs-core
[mscgenjs.embed.source]: https://github.com/sverweij/mscgenjs-inpage/blob/master/src/mscgen-inpage.js
[mscgenjs.embedpackage]: https://sverweij.github.io/mscgen_js/embed.html#package
[mscgenjs.interpreter]: https://sverweij.github.io/mscgen_js/index.html?utm_source=mscgenjs-core
[mscgenjs.interpreter.source]: https://github.com/sverweij/mscgen_js
[mscgenjs.interpreter.source.parse]: https://github.com/sverweij/mscgen_js/blob/master/src/script/interpreter/uistate.js#L117
[mscgenjs.interpreter.source.render]: https://github.com/sverweij/mscgen_js/blob/master/src/script/interpreter/uistate.js#L260
[mscgenjs.issues.compliance]: https://github.com/sverweij/mscgenjs-core/labels/compliance
[mscgenjs.unit]: https://github.com/sverweij/mscgenjs-core/tree/master/test
[mscgenjs.unit.parse]: https://github.com/sverweij/mscgenjs-core/blob/master/test/parse/t_mscgenparser_node.js
[mscgenjs.unit.render]: https://github.com/sverweij/mscgenjs-core/blob/master/test/render/graphics/t_renderast.js
[mscgenjs.license]: LICENSE.md
[mscgenjs.wikum.msgenny]: wikum/msgenny.md
[mscgenjs.wikum.xu]: wikum/xu.md
[pegjs]: http://pegjs.org
[pegjs.author]: http://majda.cz/about
[pegjs.license]: wikum/licenses/license.pegjs.md
[phantomjs]: https://www.npmjs.com/package/phantomjs
[requirejs.license]: wikum/licenses/license.requirejs.md
[travis.mscgenjs]: https://travis-ci.org/sverweij/mscgenjs-core
[travis.mscgenjs.badge]: https://travis-ci.org/sverweij/mscgenjs-core.svg?branch=master
[21]: wikum/licenses/license.mocha.md
[22]: wikum/licenses/license.eslint.md
[23]: wikum/licenses/license.plato.md
[28]: wikum/licenses/license.istanbul.md
[35]: https://nodesecurity.io/
[39]: https://github.com/chaijs/chai
[40]: https://github.com/krampstudio/chai-xml
