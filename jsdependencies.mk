
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
indexAMD.js: \
	lib/lodash/lodash.custom.js \
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
	render/graphics/constants.js \
	render/graphics/entities.js \
	render/graphics/idmanager.js \
	render/graphics/markermanager.js \
	render/graphics/renderlabels.js \
	render/graphics/renderskeleton.js \
	render/graphics/renderutensils.js \
	render/graphics/rowmemory.js \
	render/graphics/svgelementfactory.js \
	render/graphics/svglowlevelfactory.js \
	render/graphics/svgutensils.js \
	render/text/arcmappings.js \
	render/text/flatten.js

render/text/flatten.js: \
	lib/lodash/lodash.custom.js \
	render/text/arcmappings.js \
	render/text/asttransform.js \
	render/text/textutensils.js

render/graphics/entities.js: \
	render/graphics/constants.js \
	render/graphics/renderlabels.js

render/graphics/renderlabels.js: \
	render/graphics/constants.js \
	render/graphics/svgelementfactory.js \
	render/graphics/svgutensils.js \
	render/text/arcmappings.js \
	render/text/textutensils.js

render/graphics/svgelementfactory.js: \
	render/graphics/constants.js \
	render/graphics/geometry.js \
	render/graphics/svglowlevelfactory.js

render/graphics/svglowlevelfactory.js: \
	render/graphics/constants.js

render/graphics/svgutensils.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/constants.js \
	render/graphics/idmanager.js \
	render/graphics/svgelementfactory.js \
	render/graphics/svglowlevelfactory.js

render/graphics/markermanager.js: \
	lib/lodash/lodash.custom.js \
	render/text/arcmappings.js

render/graphics/renderskeleton.js: \
	render/graphics/constants.js \
	render/graphics/csstemplates.js \
	render/graphics/svgelementfactory.js

render/text/ast2dot.js: \
	lib/lodash/lodash.custom.js \
	render/text/arcmappings.js \
	render/text/flatten.js \
	render/text/textutensils.js

render/text/ast2doxygen.js: \
	render/text/arcmappings.js \
	render/text/ast2thing.js \
	render/text/textutensils.js

render/text/ast2thing.js: \
	render/text/textutensils.js

render/text/ast2mscgen.js: \
	render/text/arcmappings.js \
	render/text/ast2thing.js \
	render/text/textutensils.js

render/text/ast2msgenny.js: \
	render/text/ast2thing.js

render/text/ast2xu.js: \
	render/text/ast2thing.js \
	render/text/textutensils.js

render/text/ast2animate.js: \
	lib/lodash/lodash.custom.js

render/text/colorize.js: \
	render/text/arcmappings.js \
	render/text/asttransform.js

# cjs dependencies
index.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/renderast.js

test/index.spec.js: \
	index.js \
	test/astfixtures.json \
	test/testutensils.js

test/parse/mscgenPairs.js: \
	test/astfixtures.json

test/parse/mscgenparser_node.spec.js: \
	parse/mscgenparser_node.js \
	test/parse/mscgenPairs.js \
	test/testutensils.js

test/parse/msgennyparser_node.spec.js: \
	parse/msgennyparser_node.js \
	test/astfixtures.json \
	test/testutensils.js

test/parse/xuPairs.js: \
	test/astfixtures.json

test/parse/xuparser_node.spec.js: \
	parse/xuparser_node.js \
	test/parse/mscgenPairs.js \
	test/parse/xuPairs.js \
	test/testutensils.js

test/render/graphics/markermanager.spec.js: \
	render/graphics/markermanager.js

test/render/graphics/renderast.spec.js: \
	render/graphics/renderast.js \
	test/testutensils.js

test/render/text/ast2animate.spec.js: \
	parse/xuparser_node.js \
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
	parse/mscgenparser_node.js \
	render/text/ast2mscgen.js \
	test/astfixtures.json

test/render/text/ast2msgenny.spec.js: \
	render/text/ast2msgenny.js \
	test/astfixtures.json \
	test/testutensils.js

test/render/text/ast2xu.spec.js: \
	parse/xuparser_node.js \
	render/text/ast2xu.js \
	test/astfixtures.json

test/render/text/colorize.spec.js: \
	lib/lodash/lodash.custom.js \
	render/text/colorize.js \
	test/astfixtures.json

test/render/text/flatten.spec.js: \
	render/text/flatten.js \
	test/astfixtures.json

test/render/text/textutensils.spec.js: \
	render/text/textutensils.js

