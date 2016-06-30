module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        nodemon: {
            development: {
                script: 'src/server',
                options: {
                    env: {
                        'NODE_ENV': 'development'
                    }
                }
            }
        },

        mocha_istanbul: {
            server: {
                options: {
                    reporter: 'spec',
                    require: './test/helpers/spec-helper'
                },
                src: ['test/server/**/*.spec.js']
            }
        }
    });

    grunt.registerTask('serve', ['nodemon:development']);
    grunt.registerTask('test', ['mocha_istanbul:server'])
};
