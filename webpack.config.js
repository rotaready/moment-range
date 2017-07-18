const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './lib/moment-range.js',
  externals: {
    moment: 'moment'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: '/tmp/',
          plugins: ['transform-flow-strip-types'],
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre'
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, './node_modules'),
      // If we're using webpack in the postinstall step this package is being installed as a dependency this means
      // that the node_modules directory we are looking for (for es6-symbol) is directly above us.
      path.resolve(__dirname, '../')
    ]
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, './node_modules')
    ]
  },
  output: {
    filename: 'moment-range.js',
    library: 'moment-range',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist/'),
    umdNamedDefine: true
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
