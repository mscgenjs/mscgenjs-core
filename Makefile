.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
GIT=git
NPM=npm
MAKEDEPEND=node_modules/.bin/js-makedepend --output-to config/jsdependencies.mk --exclude "node_modules|doc"
RJS=node_modules/requirejs/bin/r.js

PARSERS=src/parse/mscgenparser.js \
	src/parse/msgennyparser.js \
	src/parse/xuparser.js
GENERATED_SOURCES=$(PARSERS) \
				  $(CUSTOM_LODASH) \
				  src/render/graphics/csstemplates.ts

.PHONY: help dist dev-build install deploy-gh-pages check fullcheck mostlyclean clean lint cover prerequisites report test update-dependencies run-update-dependencies depend bower-package

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
src/parse/%parser.js: src/parse/peg/%parser.pegjs
	$(PEGJS) --extra-options-file config/.pegjs-config.json -o $@ $<

# dependencies
include config/jsdependencies.mk
include config/dependencies.mk

src/render/graphics/csstemplates.ts: src/render/graphics/styling \
	utl/to-csstemplates-js.utility.js \
	src/render/graphics/styling/base.css \
	src/render/graphics/styling/csstemplates.tsTemplate \
	src/render/graphics/styling/*.style/*.css \
	src/render/graphics/styling/*.style/*.json
	node utl/to-csstemplates-js.utility.js > $@

# "phony" targets
prerequisites:
	$(NPM) install

dev-build: $(GENERATED_SOURCES)

tag:
	$(GIT) tag -a `utl/getver` -m "tag release `utl/getver`"
	$(GIT) push --tags

push-mirrors:
	$(GIT) push bitbucket-mirror
	$(GIT) push gitlab-mirror

depend:
	$(MAKEDEPEND) --system amd,cjs ./src
