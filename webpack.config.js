const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './lib/moment-range.js',
  externals: {
    moment: 'moment'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: '/tmp/',
          plugins: ['transform-flow-strip-types'],
          presets: ['es2015', 'stage-0']
        }
      }
    ],
    preLoaders: [
      { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ }
    ]
  },
  resolve: {
    root: [
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, './node_modules')
    ]
  },
  resolveLoader: {
    root: path.resolve(__dirname, './node_modules')
  },
  output: {
    filename: 'moment-range.js',
    hash: false,
    library: 'moment-range',
    libraryTarget: 'umd',
    path: './dist/',
    umdNamedDefine: true
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
};
