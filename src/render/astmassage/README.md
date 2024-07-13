# Manipuliating the broadcast

## Flattening/ "normalizing"

To ease rendering the [flatten.ts](flatten.ts) module massages the
syntax tree in several ways:

- makes sure each entity has a 'label' attribute
- distributes the arc\*colors from entities to the appropriate lines and arcs
- make sure arcs point from left to right
- takes care of 'unwinding' nested inline expressions
- makes individual arcs of broadcast arcs

:page_with_curl: code in [flatten.ts](flatten.ts)

## Coloring

:page_with_curl: code in [colorize.ts](colorize.ts)
