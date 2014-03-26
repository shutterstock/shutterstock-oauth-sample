module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        files: {
          'shutterstock-oauth.min.js': "shutterstock-oauth.js"
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [ 'uglify']);

};
