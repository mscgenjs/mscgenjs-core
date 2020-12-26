#!/bin/sh
AST2SVG=./utl/ast2svg_source
AST2SVG_NOSOURCE=./utl/ast2svg_nosource
AST2SVG_MIRROR=./utl/ast2svg_nosource_mirrored_entities
AST2SVG_STYLIO=./utl/ast2svg_nosource_style_addition
AST2SVG_STYLION=./utl/ast2svg_nosource_style_addition_named
AST2SVG_WOBBLY=./utl/ast2svg_wobbly
FIXTURE_DIR=./test/fixtures
$AST2SVG < $FIXTURE_DIR/test01_all_possible_arcs.json > $FIXTURE_DIR/test01_all_possible_arcs.svg
$AST2SVG < $FIXTURE_DIR/astsimple.json > $FIXTURE_DIR/astsimple.svg
$AST2SVG < $FIXTURE_DIR/astempty.json > $FIXTURE_DIR/astempty.svg
$AST2SVG < $FIXTURE_DIR/rainbow.json > $FIXTURE_DIR/rainbow.svg
$AST2SVG < $FIXTURE_DIR/test19_multiline_lipsum.json > $FIXTURE_DIR/test19_multiline_lipsum.svg
$AST2SVG < $FIXTURE_DIR/test20_empty_inline_expression.json > $FIXTURE_DIR/test20_empty_inline_expression.svg
$AST2SVG < $FIXTURE_DIR/idsnurls.json > $FIXTURE_DIR/idsnurls.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/astsimple.json > $FIXTURE_DIR/astsimplenosource.svg
$AST2SVG < $FIXTURE_DIR/test21_inline_expression_alt_lines.json > $FIXTURE_DIR/test21_inline_expression_alt_lines.svg
$AST2SVG < $FIXTURE_DIR/astemptylinesinboxes.json > $FIXTURE_DIR/astemptylinesinboxes.svg
$AST2SVG < $FIXTURE_DIR/astautoscale.json > $FIXTURE_DIR/astautoscale.svg
$AST2SVG < $FIXTURE_DIR/bumpingboxes.json > $FIXTURE_DIR/bumpingboxes.svg
$AST2SVG < $FIXTURE_DIR/wordwrapentitiesfalse.json > $FIXTURE_DIR/wordwrapentitiesfalse.svg
$AST2SVG < $FIXTURE_DIR/wordwrapentitiesunspecified.json > $FIXTURE_DIR/wordwrapentitiesunspecified.svg
$AST2SVG < $FIXTURE_DIR/wordwrapboxesfalse.json > $FIXTURE_DIR/wordwrapboxesfalse.svg
$AST2SVG < $FIXTURE_DIR/wordwrapboxestrue.json > $FIXTURE_DIR/wordwrapboxestrue.svg
$AST2SVG < $FIXTURE_DIR/inline-expressions-and-parallel-stuff.json > $FIXTURE_DIR/inline-expressions-and-parallel-stuff.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/titletags.json > $FIXTURE_DIR/titletags.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip01.json > $FIXTURE_DIR/arcskip/arcskip01.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip02.json > $FIXTURE_DIR/arcskip/arcskip02.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip03.json > $FIXTURE_DIR/arcskip/arcskip03.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip04.json > $FIXTURE_DIR/arcskip/arcskip04.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip05.json > $FIXTURE_DIR/arcskip/arcskip05.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip06.json > $FIXTURE_DIR/arcskip/arcskip06.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip07.json > $FIXTURE_DIR/arcskip/arcskip07.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip08.json > $FIXTURE_DIR/arcskip/arcskip08.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip09.json > $FIXTURE_DIR/arcskip/arcskip09.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip11.json > $FIXTURE_DIR/arcskip/arcskip11.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip12.json > $FIXTURE_DIR/arcskip/arcskip12.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip13.json > $FIXTURE_DIR/arcskip/arcskip13.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip14.json > $FIXTURE_DIR/arcskip/arcskip14.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/arcskip/arcskip15.json > $FIXTURE_DIR/arcskip/arcskip15.svg

$AST2SVG_NOSOURCE < $FIXTURE_DIR/mirrorentities-off-inline-last.json > $FIXTURE_DIR/mirrorentities-off-inline-last.svg
$AST2SVG_NOSOURCE < $FIXTURE_DIR/mirrorentities-off-regular-arc-last.json > $FIXTURE_DIR/mirrorentities-off-regular-arc-last.svg
$AST2SVG_MIRROR < $FIXTURE_DIR/mirrorentities-on-inline-last.json > $FIXTURE_DIR/mirrorentities-on-inline-last.svg
$AST2SVG_MIRROR < $FIXTURE_DIR/mirrorentities-on-regular-arc-last.json > $FIXTURE_DIR/mirrorentities-on-regular-arc-last.svg
$AST2SVG_STYLIO < $FIXTURE_DIR/mirrorentities-on-regular-arc-last.json > $FIXTURE_DIR/mirrorentities-on-regular-arc-last-with-style-additions.svg
$AST2SVG_STYLION < $FIXTURE_DIR/mirrorentities-on-regular-arc-last.json > $FIXTURE_DIR/mirrorentities-on-regular-arc-last-with-named-style-addition.svg
# $AST2SVG_WOBBLY < $FIXTURE_DIR/simpleXuSample.json > $FIXTURE_DIR/wobbly.svg
