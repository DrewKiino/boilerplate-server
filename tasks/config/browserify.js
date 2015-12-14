/**
 * Browserify files with React as an option.
 *
 * ---------------------------------------------------------------
 *
 * Concatenates files javascript and css from a defined array. Creates concatenated files in
 * .tmp/public/contact directory
 * [browserify](https://github.com/gruntjs/grunt-browserify)
 *
 * For usage docs see:
 *    https://github.com/gruntjs/grunt-browserify
 */
module.exports = function(grunt) {

  grunt.config.set('browserify', {
    js: {
      src : require('../pipeline').browserifyMainFile,
      dest: '.tmp/public/browserify/app.js'
    },
    options: {
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
};