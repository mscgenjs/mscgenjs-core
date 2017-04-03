
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
index.js: \
	main/index.js \
	main/static-resolver.js

main/index.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/csstemplates.js

main/static-resolver.js: \
	parse/mscgenparser.js \
	parse/msgennyparser.js \
	parse/xuparser.js \
	render/graphics/renderast.js \
	render/text/ast2dot.js \
	render/text/ast2doxygen.js \
	render/text/ast2mscgen.js \
	render/text/ast2msgenny.js \
	render/text/ast2xu.js

render/graphics/renderast.js: \
	lib/lodash/lodash.custom.js \
	render/astmassage/aggregatekind.js \
	render/astmassage/flatten.js \
	render/graphics/constants.js \
	render/graphics/entities.js \
	render/graphics/idmanager.js \
	render/graphics/kind2class.js \
	render/graphics/markermanager.js \
	render/graphics/renderlabels.js \
	render/graphics/renderskeleton.js \
	render/graphics/renderutensils.js \
	render/graphics/rowmemory.js \
	render/graphics/svgelementfactory/index.js \
	render/graphics/svgutensils.js

render/astmassage/flatten.js: \
	lib/lodash/lodash.custom.js \
	render/astmassage/aggregatekind.js \
	render/astmassage/asttransform.js \
	render/astmassage/normalizekind.js \
	render/astmassage/normalizeoptions.js \
	render/textutensils/escape.js

render/astmassage/normalizeoptions.js: \
	lib/lodash/lodash.custom.js

render/graphics/entities.js: \
	render/graphics/renderlabels.js

render/graphics/renderlabels.js: \
	render/astmassage/aggregatekind.js \
	render/graphics/constants.js \
	render/graphics/kind2class.js \
	render/graphics/svgelementfactory/index.js \
	render/graphics/svgutensils.js \
	render/textutensils/wrap.js

render/graphics/svgelementfactory/index.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/svgelementfactory/straight.js \
	render/graphics/svgelementfactory/wobbly.js

render/graphics/svgelementfactory/straight.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/svgelementfactory/svgprimitives.js \
	render/graphics/svgelementfactory/variationhelpers.js

render/graphics/svgelementfactory/svgprimitives.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/svgelementfactory/domprimitives.js \
	render/graphics/svgelementfactory/geometry.js \
	render/graphics/svgelementfactory/round.js

render/graphics/svgelementfactory/wobbly.js: \
	render/graphics/svgelementfactory/svgprimitives.js \
	render/graphics/svgelementfactory/variationhelpers.js

render/graphics/svgutensils.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/idmanager.js \
	render/graphics/svgelementfactory/index.js

render/graphics/markermanager.js: \
	lib/lodash/lodash.custom.js \
	render/astmassage/normalizekind.js

render/graphics/renderskeleton.js: \
	render/graphics/constants.js \
	render/graphics/csstemplates.js \
	render/graphics/svgelementfactory/index.js

render/graphics/renderutensils.js: \
	lib/lodash/lodash.custom.js

render/text/ast2dot.js: \
	lib/lodash/lodash.custom.js \
	render/astmassage/aggregatekind.js \
	render/astmassage/flatten.js \
	render/text/dotMappings.js \
	render/textutensils/wrap.js

render/text/ast2doxygen.js: \
	render/astmassage/aggregatekind.js \
	render/text/ast2thing.js \
	render/textutensils/escape.js

render/text/ast2thing.js: \
	render/textutensils/escape.js

render/text/ast2mscgen.js: \
	render/astmassage/aggregatekind.js \
	render/text/ast2thing.js \
	render/textutensils/escape.js

render/text/ast2msgenny.js: \
	render/text/ast2thing.js

render/text/ast2xu.js: \
	render/text/ast2thing.js \
	render/textutensils/escape.js

indexAMD.js: \
	index.js

render/astmassage/colorize.js: \
	render/astmassage/aggregatekind.js \
	render/astmassage/asttransform.js

render/text/ast2animate.js: \
	lib/lodash/lodash.custom.js

# cjs dependencies
index-lazy.js: \
	main/index.js \
	main/lazy-resolver.js

main/index.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/csstemplates.js

main/lazy-resolver.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/renderast.js

render/graphics/renderast.js: \
	lib/lodash/lodash.custom.js \
	render/astmassage/aggregatekind.js \
	render/astmassage/flatten.js \
	render/graphics/constants.js \
	render/graphics/entities.js \
	render/graphics/idmanager.js \
	render/graphics/kind2class.js \
	render/graphics/markermanager.js \
	render/graphics/renderlabels.js \
	render/graphics/renderskeleton.js \
	render/graphics/renderutensils.js \
	render/graphics/rowmemory.js \
	render/graphics/svgelementfactory/index.js \
	render/graphics/svgutensils.js

render/astmassage/flatten.js: \
	lib/lodash/lodash.custom.js \
	render/astmassage/aggregatekind.js \
	render/astmassage/asttransform.js \
	render/astmassage/normalizekind.js \
	render/astmassage/normalizeoptions.js \
	render/textutensils/escape.js

render/astmassage/normalizeoptions.js: \
	lib/lodash/lodash.custom.js

render/graphics/entities.js: \
	render/graphics/renderlabels.js

render/graphics/renderlabels.js: \
	render/astmassage/aggregatekind.js \
	render/graphics/constants.js \
	render/graphics/kind2class.js \
	render/graphics/svgelementfactory/index.js \
	render/graphics/svgutensils.js \
	render/textutensils/wrap.js

render/graphics/svgelementfactory/index.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/svgelementfactory/straight.js \
	render/graphics/svgelementfactory/wobbly.js

render/graphics/svgelementfactory/straight.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/svgelementfactory/svgprimitives.js \
	render/graphics/svgelementfactory/variationhelpers.js

render/graphics/svgelementfactory/svgprimitives.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/svgelementfactory/domprimitives.js \
	render/graphics/svgelementfactory/geometry.js \
	render/graphics/svgelementfactory/round.js

render/graphics/svgelementfactory/wobbly.js: \
	render/graphics/svgelementfactory/svgprimitives.js \
	render/graphics/svgelementfactory/variationhelpers.js

render/graphics/svgutensils.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/idmanager.js \
	render/graphics/svgelementfactory/index.js

render/graphics/markermanager.js: \
	lib/lodash/lodash.custom.js \
	render/astmassage/normalizekind.js

render/graphics/renderskeleton.js: \
	render/graphics/constants.js \
	render/graphics/csstemplates.js \
	render/graphics/svgelementfactory/index.js

render/graphics/renderutensils.js: \
	lib/lodash/lodash.custom.js

index.js: \
	main/index.js \
	main/static-resolver.js

main/static-resolver.js: \
	parse/mscgenparser.js \
	parse/msgennyparser.js \
	parse/xuparser.js \
	render/graphics/renderast.js \
	render/text/ast2dot.js \
	render/text/ast2doxygen.js \
	render/text/ast2mscgen.js \
	render/text/ast2msgenny.js \
	render/text/ast2xu.js

render/text/ast2dot.js: \
	lib/lodash/lodash.custom.js \
	render/astmassage/aggregatekind.js \
	render/astmassage/flatten.js \
	render/text/dotMappings.js \
	render/textutensils/wrap.js

render/text/ast2doxygen.js: \
	render/astmassage/aggregatekind.js \
	render/text/ast2thing.js \
	render/textutensils/escape.js

render/text/ast2thing.js: \
	render/textutensils/escape.js

render/text/ast2mscgen.js: \
	render/astmassage/aggregatekind.js \
	render/text/ast2thing.js \
	render/textutensils/escape.js

render/text/ast2msgenny.js: \
	render/text/ast2thing.js

render/text/ast2xu.js: \
	render/text/ast2thing.js \
	render/textutensils/escape.js

indexAMD.js: \
	index.js

render/astmassage/colorize.js: \
	render/astmassage/aggregatekind.js \
	render/astmassage/asttransform.js

render/text/ast2animate.js: \
	lib/lodash/lodash.custom.js

test/index.spec.js: \
	index-lazy.js \
	index.js \
	package.json \
	test/astfixtures.json

test/main/resolvers.spec.js: \
	main/lazy-resolver.js \
	main/static-resolver.js \
	test/astfixtures.json \
	test/testutensils.js

test/parse/mscgenPairs.js: \
	test/astfixtures.json

test/parse/mscgenparser.spec.js: \
	parse/mscgenparser.js \
	test/parse/mscgenPairs.js \
	test/testutensils.js

test/parse/msgennyparser.spec.js: \
	parse/msgennyparser.js \
	test/astfixtures.json \
	test/testutensils.js

test/parse/xuPairs.js: \
	test/astfixtures.json

test/parse/xuparser.spec.js: \
	parse/xuparser.js \
	test/parse/mscgenPairs.js \
	test/parse/xuPairs.js \
	test/testutensils.js

test/render/astmassage/colorize.spec.js: \
	lib/lodash/lodash.custom.js \
	render/astmassage/colorize.js \
	test/astfixtures.json

test/render/astmassage/flatten.spec.js: \
	render/astmassage/flatten.js \
	test/astfixtures.json

test/render/astmassage/normalizeoptions.spec.js: \
	render/astmassage/normalizeoptions.js

test/render/graphics/geometry.spec.js: \
	render/graphics/svgelementfactory/geometry.js

test/render/graphics/markermanager.spec.js: \
	render/graphics/markermanager.js

test/render/graphics/renderast.spec.js: \
	render/graphics/renderast.js \
	test/testutensils.js

test/render/graphics/variationhelpers.js: \
	render/graphics/svgelementfactory/variationhelpers.js

test/render/text/ast2animate.spec.js: \
	parse/xuparser.js \
	render/text/ast2animate.js \
	test/astfixtures.json \
	test/testutensils.js

test/render/text/ast2dot.spec.js: \
	render/text/ast2dot.js \
	test/astfixtures.json

test/render/text/ast2doxygen.spec.js: \
	render/text/ast2doxygen.js \
	test/astfixtures.json

test/render/text/ast2mscgen.spec.js: \
	parse/mscgenparser.js \
	render/text/ast2mscgen.js \
	test/astfixtures.json

test/render/text/ast2msgenny.spec.js: \
	render/text/ast2msgenny.js \
	test/astfixtures.json \
	test/testutensils.js

test/render/text/ast2xu.spec.js: \
	parse/xuparser.js \
	render/text/ast2xu.js \
	test/astfixtures.json

test/render/textutensils/wrap.spec.js: \
	render/textutensils/wrap.js

