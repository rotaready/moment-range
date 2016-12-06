module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-umd');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          'dist/moment-range.js': 'lib/moment-range.js'
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    replace: {
      example: {
        src: ['dist/moment-range.js'],
        dest: 'dist/moment-range.js',
        replacements: [{
          from: 'var moment = require(\'moment\');',
          to: ''
        },
        {
          from: 'module.exports = DateRange;',
          to: ''
        }]
      }
    },

    uglify: {
      'moment-range': {
        files: {
          'dist/moment-range.min.js': ['dist/moment-range.js']
        }
      }
    },

    umd: {
      all: {
        src: 'dist/moment-range.js',
        dest: 'dist/moment-range.js',
        globalAlias: 'DateRange',
        objectToExport: 'DateRange',
        deps: {
          default: ['moment']
        }
      }
    }
  });

  grunt.registerTask('default', ['babel', 'replace', 'umd', 'uglify', 'mochaTest']);
};
