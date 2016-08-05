# javascript that can't get makedepended because it loads its
# dependencies conditionally
main/CJS-lazy-resolver.js: \
	parse/mscgenparser.js \
	parse/xuparser.js \
	parse/msgennyparser.js \
	render/text/ast2mscgen.js \
	render/text/ast2msgenny.js \
	render/text/ast2xu.js \
	render/text/ast2dot.js \
	render/text/ast2doxygen.js \
	render/graphics/renderast.js
