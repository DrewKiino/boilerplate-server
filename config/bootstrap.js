/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  /**
   * pre-setup
   *
   * setup global variables to prevent unnecessary
   * inits of the same vars
   */
  return preSetup()
  /**
   * setup redis as the datastore server
   */
  .then(sails.services.redis.connect)
  /**
   * setup mongoose as the ORM wrapper for mongodb
   */
  .then(sails.services.mongoosemongo.connectMongooseToMongo)
  .then(sails.services.mongoosemongo.bindMongooseToModels)
  /**
   * setup kue for background jobs
   * 
   * NOTE: it seems that kue struggles with http loading
   * although its ui and api usage is very intuitive, the performance
   * doesn't reach the levels of reque, kind of disappointed. perhaps, I am
   * implementing it wrong. But I still like this api so I will try to find
   * other uses for it.
   */
  // .then(setupKue)
    /**
   * setup resque for background jbos
   *
   * NOTE: the api is kind of clunky but this handles reliable job execution
   * that reaches 10,000 clients/min.
   */
  .then(sails.services.resque.setup)
  /**
   * setup socket.io framework
   */
  .then(sails.services.sockets.setup)
  /**
   * post setup
  */
  .then(postSetup)
  /**
   * lift sails
   */
  .then(cb)
  /**
   * catch any errors
   */
  .catch(sails.log.error)
}

function preSetup() {

	sails.log.info('environment\t=>\t(' + process.env.NODE_ENV + ')')

  /**
   * global host name accessor
   */

  sails.HOST_NAME = require('os').hostname().split('.').shift()

  /**
   * global logging functions
   */

  sails.dloginfo = function(value) {
    if (sails.isDevelopment) sails.log.info(value)
  }

  sails.dlogwarn = function(value) {
    if (sails.isDevelopment) sails.log.warn(value)
  }

  sails.dlog = function(value) {
    if (sails.isDevelopment) sails.log.debug(value)
  }

  sails.dlogerror = function(value) {
    if (require('is_js').existy(value)) sails.log.error(value)
  }

	return require('bluebird').resolve()
}

function postSetup() {
  return require('bluebird').resolve()
}


































