/**
 * Created by orn0t <ornot.work@gmail.com> on 8/30/17.
 */

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            all: {
                options: {
                    paths: ['public/css']
                },
                files: {
                    "public/css/style.css": "public/css/style.less" // destination file and source file
                }
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['less']);
};