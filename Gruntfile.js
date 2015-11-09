module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    var config = {
        modules: {
            js: [
                'src/public/app.js',
                'src/public/modules/**/*.client.module.js',
                'src/public/modules/**/*.js'
            ]
        }
    };

    grunt.initConfig({
        clean: ['dist'],

        copy: {
            development: {
                files: [{
                    expand: true,
                    cwd: 'src/public',
                    src: ['**', '!**/sass/**'],
                    dest: 'dist/public/'
                }]
            }
        },

        sass: {
            development: {
                options: {
                    sourcemap: 'none',
                    style: 'compact'
                },
                files: [{
                    expand: true,
                    cwd: 'src/public/assets/sass',
                    src: ['*.scss'],
                    dest: 'dist/public/assets/css',
                    ext: '.css'
                }]
            }
        },

        watch: {
            public: {
                files: ['src/public/**'],
                tasks: ['copy', 'sass:development']
            }
        },

        nodemon: {
            development: {
                script: 'src/server',
                options: {
                    ignore: ['src/public'],
                    env: {
                        'NODE_ENV': 'development'
                    }
                }
            }
        },

        ngAnnotate: {
            production: {
                files: {
                    'src/public/application.js': config.modules.js
                }
            }
        },

        concurrent: {
            development: {
                tasks: ['watch:public', 'nodemon:development'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        mochaTest: {
            server: {
                options: {
                    reporter: 'spec',
                    require: './test/helpers/spec-helper'
                },
                src: ['test/server/**/*.spec.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('serve', ['clean', 'copy', 'sass:development', 'concurrent:development']);
    grunt.registerTask('build', ['clean', 'copy', 'sass:development', 'ngAnnotate']);
    grunt.registerTask('test', ['mochaTest:server'])
};