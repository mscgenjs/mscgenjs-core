# Building mscgen_js

## Building

The development build creates all generated sources, but keeps them in the `src` tree.

```shell
npm install
node --run=build # should create the state the master branch is in.
```

## Cleaning

- `node --run=build:clean` removes all generated sources

## Quality checks

- `npm test` or `node --run=test`
  - runs the unit/ regression tests
  - (some checks are still run manually with a well trained pair of eyeballs ...)

- `node --run=test:cover`
  - generates a report that specifies the test coverage
  - note that it runs the `test` target to determine the coverage

- `node --run=check` combination target, performs
  - dependency-cruise
  - test (including coverage)

- `node --run=check:full` combination target:
  - runs a `check` and
  - `npm outdated` (to check for outdated node_modules)

## Prerequisites

- node and npm
- bash (or another shell that has cp, mkdir, rm, sed, grep, expr)
- for the rest: run an `npm install`
- git
