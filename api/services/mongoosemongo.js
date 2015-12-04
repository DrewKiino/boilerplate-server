/**
 * connect mongoose to db
 * @return {promise} [successful promise]
 */
export function connectMongooseToMongo() {
  const Promise = require('bluebird')
  const mongoose = require('mongoose')
  const dbName = sails.config.models.connection
  const config = sails.config.connections[dbName]

  // the staging server's url instead..
  // outsourcing the mongodb means that you cannot alter or drop the database
  // locally
  const mongoUrl = process.env.MONGOLAB_URI || config.url ? config.url :
    'mongodb://' + config.host + ':' + config.port + '/' + config.database

  mongoose.connect(mongoUrl)

  const db = Promise.promisifyAll(mongoose.connection)

  db.on('error', sails.log.error)

  return db.onceAsync('open')
  .then( () => {
    sails.log.info('mongoose-mongo\t=>\t(connected)\t' + mongoUrl)
  })
} // connectMongoose

/**
 * bind promisified mongoose functions to Model.mongoose. doing this in
 * bootstrap because waterline does something to functions in its build
 * phase (probably promisifying them)
 */
export function bindMongooseToModels() {
  return require('bluebird').promisify(require('glob'))("api/models/*.js")
  .then(function(files) {
    const mongoose = require('mongoose')
    const Promise = require('bluebird')

    Promise.promisifyAll(mongoose.Model)
    Promise.promisifyAll(mongoose.Model.prototype)
    Promise.promisifyAll(mongoose.Query.prototype)

    const changeCase = require('change-case')
    const path = require('path')
    const _ = require('lodash')

    const models = []

    _.each(files, function(file) {
      var basename = path.basename(file, '.js');
      // console.log('basename:', basename)
      models.push(basename)
    })

    _.each(models, function(model) {
      // define pascal and lowercase model names
      const pascalCaseModelName = model
      const lowerCaseModelName = changeCase.lowerCase(model)

      // get waterline model object
      const Model = sails.models[lowerCaseModelName]

      // get mongoose schema
      const schema = Model.schema

      // if no schema, move to the next model
      if (!schema) return

      // set schema collection name
      schema.set('collection', lowerCaseModelName)

      // declare mongoose model
      const mongooseModel = mongoose.model(pascalCaseModelName, schema)

      // append promisifed mongoose model to waterline object
      Model.mongoose = mongooseModel
    }) // _.each
    return
  })
}


/**
 * Ensure we have 2dsphere index on Place so GeoSpatial queries can work!
 * @return {promise} [nativeAsync promise fulfilling ensureIndexAsync]
 */
// function ensureMongo2dSphereIndex() {
//   Promise.promisifyAll(sails.models.place)
//   return sails.models.place.nativeAsync()
//   .then(Promise.promisifyAll)
//   .then(function(places) {
//     return places.createIndexAsync({ location: '2dsphere' })
//   })
// } 
