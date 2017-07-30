.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
GIT=git
NPM=npm
MAKEDEPEND=node_modules/.bin/js-makedepend --output-to jsdependencies.mk --exclude "node_modules|doc"
LODASH=node_modules/.bin/lodash

PARSERS=parse/mscgenparser.js \
	parse/msgennyparser.js \
	parse/xuparser.js
CUSTOM_LODASH=lib/lodash/lodash.custom.js
GENERATED_SOURCES=$(PARSERS) \
				  $(CUSTOM_LODASH) \
				  render/graphics/csstemplates.js
LIBDIRS=lib/lodash

.PHONY: help dev-build install deploy-gh-pages check fullcheck mostlyclean clean lint cover prerequisites report test update-dependencies run-update-dependencies depend bower-package

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
parse/%parser.js: parse/peg/%parser.pegjs
	$(PEGJS) --format umd -o $@ $<

$(LIBDIRS):
	mkdir -p $@

$(CUSTOM_LODASH): node_modules/lodash-cli/package.json
	$(LODASH) exports=umd include=memoize,cloneDeep,flatten,defaults --development --output $@

# dependencies
include jsdependencies.mk
include dependencies.mk

render/graphics/csstemplates.js: render/graphics/styling \
	render/graphics/styling/to-csstemplates-js.utility.js \
	render/graphics/styling/base.css \
	render/graphics/styling/csstemplates.template.js \
	render/graphics/styling/*.style/*.css \
	render/graphics/styling/*.style/*.json
	node render/graphics/styling/to-csstemplates-js.utility.js > $@

.npmignore: .gitignore
	cp $< $@
	echo ".bithoundrc" >> $@
	echo ".codeclimate.yml" >> $@
	echo ".eslintignore" >> $@
	echo ".eslintrc.json" >> $@
	echo ".gitlab-ci.yml" >> $@
	echo ".istanbul.yml" >> $@
	echo ".travis.yml" >> $@
	echo "Makefile" >> $@
	echo "dependencies.mk" >> $@
	echo "jsdependencies.mk" >> $@
	echo "test/**" >> $@
	echo "utl/**" >> $@

# "phony" targets
prerequisites:
	$(NPM) install

dev-build: $(GENERATED_SOURCES) .npmignore

lint:
	$(NPM) run lint

lint-fix:
	$(NPM) run lint:fix

depcruise:
	$(NPM) run depcruise

cover: dev-build
	$(NPM) run test:cover

tag:
	$(GIT) tag -a `utl/getver` -m "tag release `utl/getver`"
	$(GIT) push --tags

push-mirrors:
	$(GIT) push bitbucket-mirror
	$(GIT) push gitlab-mirror

static-analysis:
	$(NPM) run plato

test: dev-build
	$(NPM) test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated

check: lint depcruise test

fullcheck: check outdated nsp

update-dependencies: run-update-dependencies clean dev-build test nsp lint-fix
	$(GIT) diff package.json

run-update-dependencies:
	$(NPM) run npm-check-updates
	$(NPM) install

depend:
	$(MAKEDEPEND) --system amd,cjs ./

clean:
	rm -rf $(GENERATED_SOURCES)
	rm -rf coverage
