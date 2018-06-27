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

.npmignore: .gitignore Makefile
	cp $< $@
	echo "" >> $@
	echo "# to ignore specifically for npm publishing: >> $@"
	echo ".codeclimate.yml" >> $@
	echo ".dependency-cruiser.json" >> $@
	echo ".eslintignore" >> $@
	echo ".eslintrc.json" >> $@
	echo ".gitlab-ci.yml" >> $@
	echo ".travis.yml" >> $@
	echo "CODE_OF_CONDUCT.md" >> $@
	echo "Makefile" >> $@
	echo "tslint.json" >> $@
	echo "tsconfig.json" >> $@
	echo "src/tsconfig.json" >> $@
	echo ".github" >> $@
	echo "config" >> $@
	echo "doc" >> $@
	echo "test" >> $@
	echo "utl" >> $@

# "phony" targets
prerequisites:
	$(NPM) install

dev-build: $(GENERATED_SOURCES) .npmignore

dist: dev-build node_modules/almond/almond.js
	mkdir -p dist
	$(RJS) -o baseUrl=. \
			name=node_modules/almond/almond \
			include=dist/index \
			out=dist/webpack-issue-5316-workaround.js \
			wrap.startFile=config/almond.start.frag \
			wrap.endFile=config/almond.end.frag \
			preserveLicenseComments=true \
			optimize=none

lint:
	$(NPM) run lint

lint-fix:
	$(NPM) run lint:fix

depcruise:
	$(NPM) run depcruise

cover: dev-build
	$(NPM) run test:cover

publish-patch:
	$(NPM) version patch

publish-minor:
	$(NPM) version minor

publish-major:
	$(NPM) version major

tag:
	$(GIT) tag -a `utl/getver` -m "tag release `utl/getver`"
	$(GIT) push --tags

push-mirrors:
	$(GIT) push bitbucket-mirror
	$(GIT) push gitlab-mirror

test: dev-build
	$(NPM) test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated

check: lint depcruise cover

fullcheck: check outdated nsp

update-dependencies: run-update-dependencies clean dev-build test nsp lint-fix
	$(GIT) diff package.json

run-update-dependencies:
	$(NPM) run npm-check-updates
	$(NPM) install

depend:
	$(MAKEDEPEND) --system amd,cjs ./src

clean:
	rm -rf $(GENERATED_SOURCES)
	rm -rf coverage
