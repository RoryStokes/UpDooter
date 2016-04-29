module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    'app/scripts/bundle.js': ['app/scripts/deps.js']
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! Uglified code generated <%= grunt.template.today("yyyy-mm-dd") %>. For readable script see http://github.com/RoryStokes/UpDooter */ ',
                mangle: false
            },
            build: {
                src: 'app/scripts/bundle.js',
                dest: 'target/scripts/bundle.js'
            }
        },
        express: {
            dev:{
                options: {
                    script: 'target/server.js'
                }
            }
        },
        copy: {
            html: {
                expand: true,
                cwd: 'app',
                src: '*.html',
                dest: 'target/'
            },
            scripts: {
                expand: true,
                cwd: 'app/scripts',
                src: '*/*.js',
                dest: 'target/scripts'
            }
        },
        watch: {
            scripts: {
                files: ['app/scripts/*.js'],
                tasks: ['build-scripts']
            },
            options: {
                debounceDelay: 500,
                livereload: true
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build-scripts', ['browserify','uglify']);
    grunt.registerTask('build', ['build-scripts','copy']);
    grunt.registerTask('serve', ['express:dev', 'watch']);
};