module.exports = function(grunt) {

    grunt.initConfig({
        clean: ['dist'],
        
        copy: {
            development: {
                files: [{
                    expand: true,
                    cwd: 'src/client',
                    src: ['**', '!**/sass/**'],
                    dest: 'dist/client/'
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
                    cwd: 'src/client/assets/sass',
                    src: ['*.scss'],
                    dest: 'dist/client/assets/css',
                    ext: '.css'
                }]
            }
        },
        
        watch: {
            client: {
                files: ['src/client/**'],
                tasks: ['copy', 'sass:development']
            }
        },
        
        nodemon: {
            development: {
                script: 'src/server/app.js',
                options: {
                    ignore: ['src/client'],
                    env: {
                        'NODE_ENV': 'development'
                    }
                }
            }
        },
        
        concurrent: {
            development: {
                tasks: ['watch:client', 'nodemon:development'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    
    grunt.registerTask('serve-app-dev', ['clean', 'copy', 'sass:development', 'concurrent:development']);
    grunt.registerTask('build-app-prod', ['clean', 'copy', 'sass:development']);
};