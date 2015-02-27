module.exports = function(grunt) {

    grunt.initConfig({
        clean: ['dist'],
        
        copy: {
            development: {
                files: [{
                    expand: true,
                    cwd: 'src/www',
                    src: ['**', '!**/sass/**'],
                    dest: 'dist/www/'
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
                    cwd: 'src/www/assets/sass',
                    src: ['*.scss'],
                    dest: 'dist/www/assets/css',
                    ext: '.css'
                }]
            }
        },
        
        watch: {
            www: {
                files: ['src/www/*'],
                tasks: ['copy', 'sass:development']
            }
        },
        
        nodemon: {
            development: {
                script: 'src/app.js',
                options: {
                    env: {
                        'NODE_ENV': 'development'
                    }
                }
            }
        },
        
        concurrent: {
            development: {
                tasks: ['watch:www', 'nodemon:development'],
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