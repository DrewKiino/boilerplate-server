/**
 * SOCKET FRAMEWORK
 */
export function setup() {

  sails.log.info('socket.io\t\t=>\t(connected)')

  sails.doOnce = true

  sails.io.on('connect', function(socket) {
    // this code is ran once because the first connection is coming
    // from the server itself.
    if (sails.doOnce) { 
      sails.doOnce = false
      // clear the screen as this is the last thing on the server init list
      require('cli-clear')()
      sails.log.info('Hello, World.')
    }
  })

  return require('bluebird').resolve()
}