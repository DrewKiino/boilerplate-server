


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
    sails.REDIS_QUEUE = client

    sails.log.info(
      'redis server\t=>\t(connected)\t' + process.env.REDISTOGO_URL
    )

  } else {

    const client = redis.createClient()
    client.on('error', sails.dlogerror)
    client.send_command('CLIENT', ['SETNAME', name])

    sails.REDIS_PUB = client

    const client2 = redis.createClient()
    client2.on('error', sails.dlogerror)
    client2.send_command('CLIENT', ['SETNAME', name])
    client2.setMaxListeners(0)
    sails.REDIS_SUB = client2

    const client3 = redis.createClient()
    client3.on('error', sails.dlogerror)
    client3.send_command('CLIENT', ['SETNAME', name])
    sails.REDIS_QUEUE = client

    sails.log.info('redis server\t=>\t(connected)\tredis://127.0.0.1:6379')
  }

  return require('bluebird').resolve()
}

// command to flush all memory in redis
// redis-cli -h tarpon.redistogo.com -p 11655 -a 48ac348ee1bbc98c9d9995f82726213f flushall

export function setup(socket) {

  const sub = sails.REDIS_SUB

  sub.subscribe('/user/find')

  sub.on('message', (channel, message) => {
    const data = JSON.parse(message)
    switch (channel) {
      case '/user/find': sails.controllers.user.redisPubFindOne(data)
      default: return
    }
  })
}
