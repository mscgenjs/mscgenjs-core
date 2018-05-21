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
  the textarea as input. 
  > Note that this does not `require` the root module
  but `dist/webpack-issue-5316-workaround.js` in stead. This is a workaround for 
  [webpack issue #5316](https://github.com/webpack/webpack/issues/5316),
  which makes that webpack 2+ can't work with amdefine.
- `sample-webpack.bundle.js`    
  The webpack bundle actually included in _sample-webpack.html_. It's not
  included in the repo but it's easy to generate it from app.js:

```sh
# when you don't have webpack installed yet do that first:
npm install --global webpack webpack-cli

# change to this directory
cd doc/samples

# generate the bundle; it'll now use the webpack.config.js in doc/samples
webpack
```

## An AMD example (using requirejs)
- [`sample-amd.html`](sample-amd.html)    
  The same simple page as in the CommonJS example, except it includes
  _sample-amd.js_ using _require.js_ (which happens to be distributed with
  mscgenjs).
- [`sample-amd.js`](sample-amd.js)    
  Same functionality as _sample-webpack.js_
