/**
 * SOCKET FRAMEWORK
 */
export function setup() {

  sails.log.info('socket.io\t\t=>\t(connected)')

  setTimeout(() => {
    require('cli-clear')()
    sails.log.info('Hello, World.')
  }, 100)

  return require('bluebird').resolve()
}