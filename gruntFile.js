module.exports = function(grunt) {

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s)
    grunt.registerTask('default', ['clean', 'html2js', 'concat', 'sass:build', 'copy:assets']);

    // Project configuration
    grunt.initConfig({
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        src: {
            js: ['src/**/*.js'],
            html: ['src/index.html'],
            tpl: ['src/app/**/*.tpl.html'],
            sassWatch: ['src/scss/*.scss']
        },
        clean: ['<%= distdir %>/*'],
        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: ['<%= src.tpl %>'],
                dest: '<%= distdir %>/templates/app.js',
                module: 'templates.app'
            }
        },
        uglify: {
            options: {
                report: false,
                mangle: false,
                compress: false,
                beautify: true
            },
            build: {
                src: '<%= src.js %>',
                dest: '<%= distdir %>/scripts/app.min.js'
            }
        },
        concat: {
            dist: {
                src: ['<%= src.js %>'],
                dest: '<%= distdir %>/<%= pkg.name %>.js'
            },
            index: {
                src: ['src/index.html'],
                dest: '<%= distdir %>/index.html',
                options: {
                    process: true
                }
            },
            angular: {
                src: ['vendor/angular/angular.min.js', 'vendor/angular/angular-route.js', 'vendor/angular/angular-resource.js', 'vendor/angular/angular-local-storage.js',
                'vendor/angular/angular-animate.js'],
                dest: '<%= distdir %>/angular.js'
            }
        },
        sass: {
            build: {
                options: {
                    style: 'expanded'
                },
                files: {
                    '<%= distdir %>/css/general.css': 'src/scss/general.scss'
                }
            }
        },
        copy: {
            assets: {
                files: [
                    {
                        dest: '<%= distdir %>',
                        src: '**',
                        expand: true,
                        cwd: 'src/assets/'
                    }
                ]
            }
        },
        watch: {
            all: {
                files: ['<%= src.js %>', '<%= src.html %>', '<%= src.tpl %>', '<%= src.sassWatch %>'],
                tasks: ['default']
            }
        }
    });
};