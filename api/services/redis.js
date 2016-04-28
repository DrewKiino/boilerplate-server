


export function connect() {

  const redis = require('redis')
  const env = process.env.NODE_ENV
  const name = process.env.APP_NAME + '@' + env

  const is = require('is_js')

  if (is.not.undefined(process.env.REDISTOGO_URL)) {

    const rtg   = require('url').parse(process.env.REDISTOGO_URL)

    const client = redis.createClient(rtg.port, rtg.hostname)
    client.on('error', sails.dlogerror)
    client.auth(rtg.auth.split(':')[1])
    client.setMaxListeners(0)
    client.send_command('CLIENT', ['SETNAME', name])
    sails.REDIS_PUB = client

    const client2 = redis.createClient(rtg.port, rtg.hostname)
    client2.auth(rtg.auth.split(':')[1])
    client2.on('error', sails.dlogerror)
    client2.send_command('CLIENT', ['SETNAME', name])
    client2.setMaxListeners(0)
    sails.REDIS_SUB = client2

    const client3 = require('redis').createClient(rtg.port, rtg.hostname)
    client3.on('error', sails.dlogerror)
    client3.auth(rtg.auth.split(':')[1])
    client3.send_command('CLIENT', ['SETNAME', name])
    client3.setMaxListeners(0)
    sails.REDIS_QUEUE = client3

    sails.log.info(
      'redis server\t=>\t(connected)\t' + process.env.REDISTOGO_URL
    )

  } else {

    const client = redis.createClient()
    client.on('error', sails.dlogerror)
    client.send_command('CLIENT', ['SETNAME', name])
    client.setMaxListeners(0)
    sails.REDIS_PUB = client

    const client2 = redis.createClient()
    client2.on('error', sails.dlogerror)
    client2.send_command('CLIENT', ['SETNAME', name])
    client2.setMaxListeners(0)
    sails.REDIS_SUB = client2

    const client3 = redis.createClient()
    client3.on('error', sails.dlogerror)
    client3.send_command('CLIENT', ['SETNAME', name])
    client3.setMaxListeners(0)
    sails.REDIS_QUEUE = client3

    sails.log.info('redis server\t=>\t(connected)\tredis://127.0.0.1:6379')
  }

  return require('bluebird').resolve()
}

