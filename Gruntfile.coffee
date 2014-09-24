module.exports = (grunt) ->

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-umd')

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    coffee:
      compile:
        options:
          bare: true
        files:
          'lib/moment-range.bare.js': 'src/moment-range.coffee'

    mochaTest:
      test:
        options:
          reporter: 'spec'
          require: 'coffee-script'
        src: ['test/**/*.coffee']

    uglify:
      'moment-range':
        files:
          'lib/moment-range.min.js': ['lib/moment-range.js']
          'lib/moment-range.bare.min.js': ['lib/moment-range.bare.js']
    umd:
      all:
        src: 'lib/moment-range.bare.js'
        dest: 'lib/moment-range.js'
        globalAlias: 'moment'
        objectToExport: 'moment'
        deps:
          default: ['moment']

  grunt.registerTask('default', ['coffee', 'umd', 'uglify', 'mochaTest'])
