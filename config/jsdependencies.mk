
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
src/index.js: \
	src/main/index.js \
	src/main/static-resolver.js

src/main/index.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/csstemplates.js

src/main/static-resolver.js: \
	src/parse/mscgenparser.js \
	src/parse/msgennyparser.js \
	src/parse/xuparser.js \
	src/render/graphics/renderast.js \
	src/render/text/ast2dot.js \
	src/render/text/ast2doxygen.js \
	src/render/text/ast2mscgen.js \
	src/render/text/ast2msgenny.js \
	src/render/text/ast2xu.js

src/parse/mscgenparser.js: \
	src/lib/lodash/lodash.custom.js \
	src/parse/parserHelpers.js

src/parse/msgennyparser.js: \
	src/lib/lodash/lodash.custom.js \
	src/parse/parserHelpers.js

src/parse/xuparser.js: \
	src/lib/lodash/lodash.custom.js \
	src/parse/parserHelpers.js

src/render/graphics/renderast.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/astmassage/aggregatekind.js \
	src/render/astmassage/flatten.js \
	src/render/graphics/constants.js \
	src/render/graphics/entities.js \
	src/render/graphics/idmanager.js \
	src/render/graphics/kind2class.js \
	src/render/graphics/markermanager.js \
	src/render/graphics/renderlabels.js \
	src/render/graphics/renderskeleton.js \
	src/render/graphics/renderutensils.js \
	src/render/graphics/rowmemory.js \
	src/render/graphics/svgelementfactory/index.js \
	src/render/graphics/svgutensils.js

src/render/astmassage/flatten.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/astmassage/aggregatekind.js \
	src/render/astmassage/asttransform.js \
	src/render/astmassage/normalizekind.js \
	src/render/astmassage/normalizeoptions.js \
	src/render/textutensils/escape.js

src/render/astmassage/normalizeoptions.js: \
	src/lib/lodash/lodash.custom.js

src/render/graphics/entities.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/constants.js \
	src/render/graphics/renderlabels.js \
	src/render/graphics/svgelementfactory/index.js \
	src/render/graphics/svgutensils.js

src/render/graphics/renderlabels.js: \
	src/render/astmassage/aggregatekind.js \
	src/render/graphics/constants.js \
	src/render/graphics/kind2class.js \
	src/render/graphics/svgelementfactory/index.js \
	src/render/graphics/svgutensils.js \
	src/render/textutensils/wrap.js

src/render/graphics/svgelementfactory/index.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/svgelementfactory/straight.js \
	src/render/graphics/svgelementfactory/wobbly.js

src/render/graphics/svgelementfactory/straight.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/svgelementfactory/svgprimitives.js \
	src/render/graphics/svgelementfactory/variationhelpers.js

src/render/graphics/svgelementfactory/svgprimitives.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/svgelementfactory/domprimitives.js \
	src/render/graphics/svgelementfactory/geometry.js \
	src/render/graphics/svgelementfactory/round.js

src/render/graphics/svgelementfactory/wobbly.js: \
	src/render/graphics/svgelementfactory/svgprimitives.js \
	src/render/graphics/svgelementfactory/variationhelpers.js

src/render/graphics/svgutensils.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/idmanager.js \
	src/render/graphics/svgelementfactory/index.js

src/render/graphics/markermanager.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/astmassage/normalizekind.js

src/render/graphics/renderskeleton.js: \
	src/render/graphics/constants.js \
	src/render/graphics/csstemplates.js \
	src/render/graphics/svgelementfactory/index.js

src/render/graphics/renderutensils.js: \
	src/lib/lodash/lodash.custom.js

src/render/text/ast2dot.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/astmassage/aggregatekind.js \
	src/render/astmassage/flatten.js \
	src/render/text/dotMappings.js \
	src/render/textutensils/wrap.js

src/render/text/ast2doxygen.js: \
	src/render/astmassage/aggregatekind.js \
	src/render/text/ast2thing.js \
	src/render/textutensils/escape.js

src/render/text/ast2thing.js: \
	src/render/textutensils/escape.js

src/render/text/ast2mscgen.js: \
	src/render/astmassage/aggregatekind.js \
	src/render/text/ast2thing.js \
	src/render/textutensils/escape.js

src/render/text/ast2msgenny.js: \
	src/render/text/ast2thing.js

src/render/text/ast2xu.js: \
	src/render/text/ast2thing.js \
	src/render/textutensils/escape.js

src/render/astmassage/colorize.js: \
	src/render/astmassage/aggregatekind.js \
	src/render/astmassage/asttransform.js

src/render/text/ast2animate.js: \
	src/lib/lodash/lodash.custom.js

# cjs dependencies
src/index-lazy.js: \
	src/main/index.js \
	src/main/lazy-resolver.js

src/main/index.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/csstemplates.js

src/main/lazy-resolver.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/renderast.js

src/render/graphics/renderast.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/astmassage/aggregatekind.js \
	src/render/astmassage/flatten.js \
	src/render/graphics/constants.js \
	src/render/graphics/entities.js \
	src/render/graphics/idmanager.js \
	src/render/graphics/kind2class.js \
	src/render/graphics/markermanager.js \
	src/render/graphics/renderlabels.js \
	src/render/graphics/renderskeleton.js \
	src/render/graphics/renderutensils.js \
	src/render/graphics/rowmemory.js \
	src/render/graphics/svgelementfactory/index.js \
	src/render/graphics/svgutensils.js

src/render/astmassage/flatten.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/astmassage/aggregatekind.js \
	src/render/astmassage/asttransform.js \
	src/render/astmassage/normalizekind.js \
	src/render/astmassage/normalizeoptions.js \
	src/render/textutensils/escape.js

src/render/astmassage/normalizeoptions.js: \
	src/lib/lodash/lodash.custom.js

src/render/graphics/entities.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/constants.js \
	src/render/graphics/renderlabels.js \
	src/render/graphics/svgelementfactory/index.js \
	src/render/graphics/svgutensils.js

src/render/graphics/renderlabels.js: \
	src/render/astmassage/aggregatekind.js \
	src/render/graphics/constants.js \
	src/render/graphics/kind2class.js \
	src/render/graphics/svgelementfactory/index.js \
	src/render/graphics/svgutensils.js \
	src/render/textutensils/wrap.js

src/render/graphics/svgelementfactory/index.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/svgelementfactory/straight.js \
	src/render/graphics/svgelementfactory/wobbly.js

src/render/graphics/svgelementfactory/straight.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/svgelementfactory/svgprimitives.js \
	src/render/graphics/svgelementfactory/variationhelpers.js

src/render/graphics/svgelementfactory/svgprimitives.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/svgelementfactory/domprimitives.js \
	src/render/graphics/svgelementfactory/geometry.js \
	src/render/graphics/svgelementfactory/round.js

src/render/graphics/svgelementfactory/wobbly.js: \
	src/render/graphics/svgelementfactory/svgprimitives.js \
	src/render/graphics/svgelementfactory/variationhelpers.js

src/render/graphics/svgutensils.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/graphics/idmanager.js \
	src/render/graphics/svgelementfactory/index.js

src/render/graphics/markermanager.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/astmassage/normalizekind.js

src/render/graphics/renderskeleton.js: \
	src/render/graphics/constants.js \
	src/render/graphics/csstemplates.js \
	src/render/graphics/svgelementfactory/index.js

src/render/graphics/renderutensils.js: \
	src/lib/lodash/lodash.custom.js

src/index.js: \
	src/main/index.js \
	src/main/static-resolver.js

src/main/static-resolver.js: \
	src/parse/mscgenparser.js \
	src/parse/msgennyparser.js \
	src/parse/xuparser.js \
	src/render/graphics/renderast.js \
	src/render/text/ast2dot.js \
	src/render/text/ast2doxygen.js \
	src/render/text/ast2mscgen.js \
	src/render/text/ast2msgenny.js \
	src/render/text/ast2xu.js

src/parse/mscgenparser.js: \
	src/lib/lodash/lodash.custom.js \
	src/parse/parserHelpers.js

src/parse/msgennyparser.js: \
	src/lib/lodash/lodash.custom.js \
	src/parse/parserHelpers.js

src/parse/xuparser.js: \
	src/lib/lodash/lodash.custom.js \
	src/parse/parserHelpers.js

src/render/text/ast2dot.js: \
	src/lib/lodash/lodash.custom.js \
	src/render/astmassage/aggregatekind.js \
	src/render/astmassage/flatten.js \
	src/render/text/dotMappings.js \
	src/render/textutensils/wrap.js

src/render/text/ast2doxygen.js: \
	src/render/astmassage/aggregatekind.js \
	src/render/text/ast2thing.js \
	src/render/textutensils/escape.js

src/render/text/ast2thing.js: \
	src/render/textutensils/escape.js

src/render/text/ast2mscgen.js: \
	src/render/astmassage/aggregatekind.js \
	src/render/text/ast2thing.js \
	src/render/textutensils/escape.js

src/render/text/ast2msgenny.js: \
	src/render/text/ast2thing.js

src/render/text/ast2xu.js: \
	src/render/text/ast2thing.js \
	src/render/textutensils/escape.js

src/render/astmassage/colorize.js: \
	src/render/astmassage/aggregatekind.js \
	src/render/astmassage/asttransform.js

src/render/text/ast2animate.js: \
	src/lib/lodash/lodash.custom.js

