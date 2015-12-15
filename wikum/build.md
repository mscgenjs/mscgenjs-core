# Building mscgen_js

## Building
The development build creates all generated sources, but keeps them in the `src` tree.
```shell
make prerequisites #  (or 'npm install')
make dev-build # should create the state the master branch is in.
```

When you've added new sources, make sure to include them in the dependencies,
either by running a `make depend` or manually in `dependencies.mk` (for things
js-makedepend cannot detect like conditional module loading).

## Cleaning
- ```make clean``` removes all generated sources (parser, lodash)

## Quality checks
- ```make test``` or `npm run test`
    - runs the unit/ regression tests
    - (some  checks are still run manually with a well trained pair of eyeballs ...)

- `make cover` or `npm run cover`
    - generates a report that specifies the test coverage
    - note that it runs the `test` target to determine the coverage

- `make static-analysis` or `npm run plato`
    - runs the static code analyzer (plato)
    - output will be in platoreports/index.html

- `npm run nsp`
    - checks dependencies for known vulnerabilities (with _node security project_)

- `npm stylecheck`
  runs the coding style checker (jscs)

- `make check` combination target:
    -  checks for occurence of `console` statements
    -  runs the linter on non-library, non-generated source code (= `npm run lint`)
    -  runs a stylecheck
    -  runs a `make test` (=`npm run test`)

- `make fullcheck` combination target:
    - runs a `make check` and
    - `npm outdated` (to check for outdated node_modules)
    - `npm run nsp` (see above)

## Prerequisites
- make
- node and npm
- bash (or another shell that has cp, mkdir, rm, sed, grep, expr)
- to run in nodejs amdefine is also required - an `npm install` will get you that
- for the rest: run an `npm install`
- nodejs
    - pegjs (mandatory)
    - r.js (Mandatory for creating an minified version of the javascript (which in itself is optional))
    - jshint (optional: linting)
    - mocha (optional: unit testing)
    - istanbul (optional: test coverage)
    - plato (optional: static code analysis)
    - nsp (optional: node security project - checks node module dependencies for security flaws)
- git
