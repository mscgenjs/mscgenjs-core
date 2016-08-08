# A simple msgenny interpreter
`mscgenjs` modules are written as AMD modules, but contain a module wrapper
(courtesy of _amdefine_) which enables use both in AMD and CommonJS
environments

## A CommonJS example (using webpack)
This folder contains the source code of a simple msgenny interpreter, built
with mscgenjs.

- [`sample-webpack.html`](sample-webpack.html)    
  a page with a textarea, a few buttons and a div for
  putting the output in.
- [`sample-webpack.js`](sample-webpack.js)    
  Sets up some listeners that (a.o.) call mscgenjs' render function with
  the textarea as input
- `sample-webpack.bundle.js`    
  The webpack bundle actually included in _sample-webpack.html_. It's not
  included in the repo but it's easy to generate it from app.js:

```sh
# when you don't have webpack installed yet do that first:
npm install --global webpack

# generate the bundle
webpack --optimize-minimize --optimize-dedupe sample-webpack.js sample-webpack.bundle.js
```

## An AMD example (using requirejs)
- [`sample-amd.html`](sample-amd.html)    
  The same simple page as in the CommonJS example, except it includes
  _sample-amd.js_ using _require.js_ (which happens to be distributed with
  mscgenjs).
- [`sample-amd.js`](sample-amd.js)    
  Same functionality as _sample-webpack.js_
