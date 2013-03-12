'use-strict';

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'tmp/{,*/}*.js',
        'Gruntfile.js'
      ]
    },
    watch: {
      test: {
        files: ['assets/javascripts/{,*/}*.coffee', 'spec/{,*/}*.coffee'],
        tasks: ['coffee:dev', 'coffee:test', 'jshint', 'jasmine:all']
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'tmp'),
              mountFolder(connect, 'public')
            ];
          }
        }
      },
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'assets/stylesheets',
          cssDir: 'tmp/assets'
        }
      }
    },
    regarde: {
      coffee: {
        files: ['assets/{,*/}*', 'public/{,*/}*'],
        tasks: ['clean', 'compass', 'coffee', 'copy', 'livereload']
      }
    },
    coffee: {
      dev: {
        files: [{
          expand: true,
          cwd: 'assets/javascripts/',
          src: '*.coffee',
          dest: 'tmp/assets',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'spec',
          src: '*.coffee',
          dest: 'tmp/spec/',
          ext: '.js'
        }]
      }
    },
    copy: {
      images: {
        files: [
          {expand: true, cwd: 'assets/images/', src: ['**'], dest: 'tmp/assets/'},
          {expand: true, cwd: 'assets/javascripts/', src: ['**/*.js'], dest: 'tmp/assets/'}
        ]
      }
    },
    jasmine: {
      all: {
        src: 'tmp/app/{,*/}*.js',
        options: {
          specs: 'tmp/spec/*_spec.js',
          vendor: [ 'vendor/jquery/jquery.js', 'vendor/sinon/lib/sinon.js' ]
        }
      }
    },
    clean: ['tmp']
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('server', function() {
    grunt.task.run([
      'clean',
      'coffee',
      'compass',
      'copy',
      'jshint',
      'livereload-start',
      'connect:livereload',
      'open',
      'regarde'
    ]);
  });

  grunt.registerTask('spec', function() {
    grunt.task.run([
      'clean',
      'coffee:dev',
      'coffee:test',
      'jshint',
      'jasmine:all',
      'watch:test'
    ]);
  });

  grunt.registerTask('default', ['coffee, compass, jasmine:all']);
};