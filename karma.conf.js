const webpackConfig = require('./webpack.config.js');

delete webpackConfig.entry;
delete webpackConfig.externals;
delete webpackConfig.output;
delete webpackConfig.plugins;

webpackConfig.devtool = 'inline-source-map';

module.exports = function(config) {
  config.set({
    browserConsoleLogOptions: {
      level: 'error',
      format: '%b %T: %m',
      terminal: false
    },

    browsers: ['PhantomJS', 'Chrome'],

    client: {
      mocha: {
        reporter: 'html'
      }
    },

    files: [
      { pattern: 'lib/*_test.js', watched: false }
    ],

    frameworks: ['babel-polyfill', 'mocha', 'expect'],

    logLevel: config.LOG_ERROR,

    plugins: [
      'karma-babel-polyfill',
      'karma-chrome-launcher',
      'karma-expect',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],

    preprocessors: {
      'lib/*_test.js': ['webpack', 'sourcemap']
    },

    reporters: ['dots'],

    singleRun: true,

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only'
    }
  });
}
