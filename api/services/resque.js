




export function setup() {

  /////////////////////////
  // REQUIRE THE PACKAGE //
  /////////////////////////

  ///////////////////////////
  // SET UP THE CONNECTION //
  ///////////////////////////

  const connectionDetails = { redis: sails.REDIS_QUEUE }

  //////////////////////////////
  // DEFINE YOUR WORKER TASKS //
  //////////////////////////////

  sails.JOBS = {}
  sails.JOBS['test'] = {
    perform: function(a, b, callback) {
      callback(undefined, true)
    }
  }
  sails.JOBS['push'] = {
    perform: function(params, b, callback) {
      sails.controllers.push._send(params)
      .then ( results => {
        callback(undefined, results)
      })
      .catch ( error => {
        callback(error, undefined)
      })
    }
  }
  const jobs = sails.JOBS

  const multiWorker = new (require('node-resque')).multiWorker({
    connection: connectionDetails, 
    queues: ['SLOW_QUEUE'],
    minTaskProcessors:   Number(process.env.NR_MIN_TASKS),
    maxTaskProcessors:   Number(process.env.NR_MAX_TASKS),
    checkTimeout:        Number(process.env.NR_TIMEOUT),
    timeout: Number(process.env.NR_TIMEOUT),
    name: 'resque@' + sails.HOST_NAME,
    maxEventLoopDelay:   Number(process.env.NR_MAX_LOOPDELAY),  
    toDisconnectProcessors: Boolean(process.env.NR_DISCONNECT_PROCESSORS),
  }, jobs);


  // multiWorker.on('success', (workerId, queue, job, result) => {
  // })
  // normal worker emitters
  // multiWorker.on('start', workerId => {
  //   console.log("worker["+workerId+"] started"); 
  // }) 
  // multiWorker.on('end',               function(workerId){                      console.log("worker["+workerId+"] ended"); })
  // multiWorker.on('cleaning_worker',   function(workerId, worker, pid){         console.log("cleaning old worker " + worker); })
  // multiWorker.on('poll',              function(workerId, queue){               console.log("worker["+workerId+"] polling " + queue); })
  // multiWorker.on('job',               function(workerId, queue, job){          console.log("worker["+workerId+"] working job " + queue + " " + JSON.stringify(job)); })
  // multiWorker.on('reEnqueue',         function(workerId, queue, job, plugin){  console.log("worker["+workerId+"] reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job)); })

  // if (env == 'staging' || env == 'production') {
  // const rtg   = require('url').parse(process.env.REDISTOGO_URL)
  // const client = require('redis').createClient(rtg.port, rtg.hostname)
  // client.auth(rtg.auth.split(':')[1])

  // client.subscribe('instances');

  // client.on('message', (channel, message) => {
  //   console.log(message)
  // })

  // client.publish('instances', 'start')


  // multiWorker.on('failure',           function(workerId, queue, job, failure){ console.log("worker["+workerId+"] job failure " + queue + " " + JSON.stringify(job) + " >> " + failure); })
  // multiWorker.on('error',             function(workerId, queue, job, error){   console.log("worker["+workerId+"] error " + queue + " " + JSON.stringify(job) + " >> " + error); })
  // multiWorker.on('pause',             function(workerId){                      console.log("worker["+workerId+"] paused"); })

  // multiWorker.on('internalError',     function(error){                         console.log(error); })
  // multiWorker.on('multiWorkerAction', function(verb, delay){                   console.log("*** checked for worker status: " + verb + " (event loop delay: " + delay + "ms)"); 
  // });

  multiWorker.start() 

  sails.log.info('resque\t\t=>\t(connected)')

  return require('bluebird').resolve()
}
























