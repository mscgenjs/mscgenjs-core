.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
CJS2AMD=utl/commonjs2amd.sh
GIT=git
NPM=npm
MAKEDEPEND=node_modules/.bin/js-makedepend --output-to jsdependencies.mk --exclude "node_modules"
LODASH=node_modules/.bin/lodash

PARSERS_AMD=parse/mscgenparser.js \
	parse/msgennyparser.js \
	parse/xuparser.js
PARSERS_CJS=parse/mscgenparser_node.js \
	parse/msgennyparser_node.js \
	parse/xuparser_node.js
CUSTOM_LODASH=lib/lodash/lodash.custom.js
GENERATED_SOURCES=$(PARSERS_AMD) \
				  $(PARSERS_CJS) \
				  $(CUSTOM_LODASH)
LIBDIRS=lib/lodash

.PHONY: help dev-build install deploy-gh-pages check stylecheck fullcheck mostlyclean clean noconsolestatements consolecheck lint cover prerequisites report test update-dependencies run-update-dependencies depend bower-package

help:
	@echo " --------------------------------------------------------"
	@echo "| Just downloaded the mscgen_js sources?                 |"
	@echo "|  First run 'make prerequisites' or 'npm install'       |"
	@echo " --------------------------------------------------------"
	@echo
	@echo "Most important build targets:"
	@echo
	@echo "dev-build"
	@echo " - (re-) generates the parsers from their pegjs source"
	@echo " - (re-) builds the lodash custom build"
	@echo
	@echo "check"
	@echo " - lints and stylechecks the code"
	@echo " - runs all unit tests"
	@echo
	@echo "fullcheck"
	@echo " runs 'check' and"
	@echo " - checks for any outdated dependencies"
	@echo " - runs a node security project scan"
	@echo
	@echo "clean"
	@echo " removes everything created by either install or dev-build"
	@echo
	@echo "update-dependencies"
	@echo " updates all (node) module dependencies in package.json"
	@echo " installs them, rebuilds all generated sources and runs"
	@echo " all tests."
	@echo
	@echo " --------------------------------------------------------"
	@echo "| More information and other targets: see wikum/build.md |"
	@echo " --------------------------------------------------------"
	@echo


# production rules
parse/%parser.js: parse/%parser_node.js
	$(CJS2AMD) < $< > $@

parse/%parser_node.js: parse/peg/%parser.pegjs
	$(PEGJS) $< $@

$(LIBDIRS):
	mkdir -p $@

$(CUSTOM_LODASH): node_modules/lodash-cli/package.json
	$(LODASH) exports=umd include=memoize,cloneDeep,flatten,defaults --development --output $@

# dependencies
include jsdependencies.mk
include dependencies.mk

# "phony" targets
prerequisites:
	$(NPM) install

dev-build: $(GENERATED_SOURCES)

noconsolestatements:
	@echo "scanning for console statements (run 'make consolecheck' to see offending lines)"
	grep -r console parse render test | grep -c console | grep ^0$$
	@echo ... ok

consolecheck:
	grep -r console parse render test

lint:
	$(NPM) run lint

stylecheck:
	$(NPM) run jscs

cover: dev-build
	$(NPM) run cover

tag:
	$(GIT) tag -a `utl/getver` -m "tag release `utl/getver`"
	$(GIT) push --tags

push-mirrors:
	$(GIT) push bitbucket-mirror
	$(GIT) push gitlab-mirror

static-analysis:
	$(NPM) run plato

test: dev-build
	$(NPM) run test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated

check: noconsolestatements lint stylecheck test

fullcheck: check outdated nsp

update-dependencies: run-update-dependencies clean dev-build test nsp
	$(GIT) diff package.json

run-update-dependencies:
	$(NPM) run npm-check-updates
	$(NPM) install

depend:
	$(MAKEDEPEND) --system amd,cjs ./

clean:
	rm -rf $(GENERATED_SOURCES)
	rm -rf coverage
