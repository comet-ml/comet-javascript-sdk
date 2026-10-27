const path = require('path');

// Builds the browser bundle, exposed as the global `Comet`: shipped in the npm
// package, and embedded by the Comet app in JavaScript panels.
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: false,
  output: {
    path: path.resolve('build'),
    filename: 'comet-javascript-sdk.js',
    library: { name: 'Comet', type: 'var' }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // Panels run in whatever browser opens Comet, so syntax is compiled
          // for the browserslist defaults. No core-js polyfills: every
          // built-in the SDK uses is native in those browsers, and core-js's
          // `usage` mode only added false positives (iterator helpers for
          // array methods, JSON and Array edge-case fixes), 30 KB of the
          // then 52 KB bundle. Add a polyfill by hand if new code needs one.
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]]
          }
        }
      }
    ]
  },
  performance: { hints: false }
};
