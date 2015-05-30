module.exports = (grunt) ->

  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-es6-transpiler')
  grunt.loadNpmTasks('grunt-mocha-test')

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    es6transpiler:
      options:
        environments: ['node', 'browser']
        globals: { 'moment': true }
      dist:
        files:
          'dist/moment-range.js': 'lib/moment-range.js'

    mochaTest:
      test:
        options:
          reporter: 'spec'
        src: ['test/**/*.js']

    uglify:
      'moment-range':
        files:
          'dist/moment-range.min.js': ['dist/moment-range.js']

    browserify:
      dist:
        files:
          'dist/moment-range.js': 'dist/moment-range.js'
        options:
          exclude: ['moment']

  grunt.registerTask('default', ['es6transpiler', 'browserify', 'uglify', 'mochaTest'])
