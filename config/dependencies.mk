# javascript that can't get makedepended because it loads its
# dependencies conditionally
main/CJS-lazy-resolver.js: \
	src/parse/mscgenparser.js \
	src/parse/xuparser.js \
	src/parse/msgennyparser.js \
	src/render/text/ast2mscgen.js \
	src/render/text/ast2msgenny.js \
	src/render/text/ast2xu.js \
	src/render/text/ast2dot.js \
	src/render/text/ast2doxygen.js \
	src/render/graphics/renderast.js
