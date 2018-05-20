# Rendering - graphics
In this section we motivate our choice for
[scalable vector graphics](#scalable-vector-graphics), describe how
our template or [skeleton](#the-scalable-vector-graphics-skeleton) looks and
explain how the rendering functions fill it.

## Scalable vector graphics
As the default output format for the pictures we have chosen scalable
vector graphics (SVG):
- Vector graphics are an obvious choice for drawing sequence charts - it's
  mostly lines
- SVG works out of the box in most modern browsers
- Converting (/ downgrading) vector graphics to raster graphic
  formats (like png, jpeg etc) is doable (see below). The other way 'round is
  difficult.

## The scalable vector graphics skeleton
:page_with_curl: code in [renderskeleton.js](renderskeleton.js)

We use the following structure for the svg

- `desc` - contains the source code that was used to generate the svg.
   This is practical not only for debugging, but also to reconstruct the
   original program.
- `defs` - "definitions"
    - `style` - which contains the css defining default colors, fonts,
      line widths etc.
    - a list of `marker`s - one for each of the arrow heads possible
      in sequence charts.
- The body `g`roup. This consists of 5 groups, each of which
  represents a layer. The layers themselves contain slices of the
  sequence chart. The body also contains the translation
  of the `hscale` and `width` options by way of a `transform`
  attribute. The layers from bottom to top:
    - background (a white rectangle the size of the diagram. Put in
      directly, not by reference)
    - arcspan (if there are any inline expressions they get rendered here)
    - lifeline (the vertical lines)
    - sequence (contains the entities, all arcs that are not boxes and
      accompanying text)
    - note (contains all arcs that are boxes (box, abox, rbox and _note_)
    - watermark (contra-intuitively, the easiest way to render a
      watermark in an svg is to put it on top. The watermark is put
      in this layer directly and not by reference)

## Chunks of the rendering process

- The render loop (:page_with_curl: code in [renderast.js](renderast.js))    
  Takes an abstract syntax tree, flattens it, sets up a skeleton and renders
  it, using several
- Simplifying the abstract syntax tree (:page_with_curl: code in
  [../text/flatten.js](../text/flatten.js))    
  A step that takes place after parsing and before rendering.
  It simplifies the syntax tree by a.o.
  - Making sure everything labelable has a label.
  - 'Exploding' broadcast arcs (e.g. `a => *`) into a bunch of regular ones
     (e.g. `a => b, a => c, a => c`)
  - Unrolling recursive structures.
- setting up the [SVG skeleton](#the-scalable-vector-graphics-skeleton)
  (:page_with_curl: code in [renderskeleton.js](renderskeleton.js))    
- SVG rendering primitives (:page_with_curl: code in
  [svgelementfactory.js](svgelementfactory.js))    
  Things like 'draw a box', 'create a path'. We did consider external modules
  for this, but none of the ones available in 2013 suited our needs.
- text wrapping (:page_with_curl: code in [renderlabels.js](renderlabels.js) and
  [../text/textutensils.js](../text/textutensils.js))    
  HTML implementations are supposed to take care of text wrapping. SVG
  implementations aren't and hence don't. So if you want to have text wrapping
  in SVG's you'll have to 'roll your own'. There's two parts:
  - Guess how many characters fit a given width in pixels. renderlabels.js uses
    heuristics for that, taking into account the font size.
  - The wrapping itself. A candidate for replacement by an external module.
- Determining height and width of diagram elements (in [svgutensils.js](svgutensils.js))    
  This is needed to make sure text fits within boxes, rows are of the
  correct height and texts get the right background color. We rely on the
  SVG function getBBox for this.

## getBBox to calculate element's sizes
To be able to calculate the actual bounding box of an element it has
to be in an SVG in the DOM tree first. Hence we temporarily create an element,
attach it to the DOM tree, calculate its bounding box and remove it again.

DOM operations are expensive, so we add and remove as little as possible. In
earlier implementations we took these approaches:
- Have an SVG sitting in the DOM tree. This works, but is obviously bad design.
- Create an SVG each time we need to calculate an element's size, and remove
  it when we were done with it. When we tried to identify slow running pieces
  of code, we targeted this one, and
- Create the SVG the first time we need to calculate an element's size,
  and re-use it. From a (small) sample of runs we found the last approach to be
  ~1.3x faster then the previous one (270ms vs 200ms on average) so we kept
  that. Drawback is that it leaves a small, 0x0 svg in the document the SVG
  is rendered in.
