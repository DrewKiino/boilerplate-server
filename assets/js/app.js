/**
 * the browserify framework allows us to import Node.js dependencies
 * using the 'require' method
 */


// by appending these values to 'window' we are able to expose the 
// variables to the rest of the dom's global scope
window.LiveReloadOptions = { host: 'localhost' }
require('livereload-js')
window.Promise = require('bluebird')
window.is = require('is_js')
window._ = require('lodash')

window.getParam = function getParam(param) {
  param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + param + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
}