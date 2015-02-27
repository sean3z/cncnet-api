module.exports = function(grunt) {

    grunt.initConfig({
        clean: ['dist'],
        
        copy: {
            development: {
                files: [{
                    expand: true,
                    cwd: 'src/www',
                    src: ['**', '!**/less/**'],
                    dest: 'dist/www/'
                }]
            }
        },
        
        less: {
            development: {
                files: [{
                    expand: true,
                    cwd: 'src/www/assets/less',
                    src: ['*.less'],
                    dest: 'dist/www/assets/css',
                    ext: '.css'
                }]
            }
        },
        
        watch: {
            styles: {
                files: ['src/www/assets/less/*.less'],
                tasks: ['less:development']
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
                tasks: ['watch:styles', 'nodemon:development'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    
    grunt.registerTask('serve-app-dev', ['clean', 'copy', 'less:development', 'concurrent:development']);
    grunt.registerTask('build-app-prod', ['clean', 'copy', 'less:development']);
};