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
- ```make clean``` removes all generated sources

## Quality checks
- ```make test``` or `npm run test`
    - runs the unit/ regression tests
    - (some  checks are still run manually with a well trained pair of eyeballs ...)

- `make cover` or `npm run cover`
    - generates a report that specifies the test coverage
    - note that it runs the `test` target to determine the coverage

- `make check` combination target, performs
    - linting
    - dependency-cruise
    - test (including coverage)

- `make fullcheck` combination target:
    - runs a `make check` and
    - `npm outdated` (to check for outdated node_modules)

## Prerequisites
- make
- node and npm
- bash (or another shell that has cp, mkdir, rm, sed, grep, expr)
- for the rest: run an `npm install`
- git
