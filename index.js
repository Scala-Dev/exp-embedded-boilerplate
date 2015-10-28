'use strict';

// setup prerequisites for the sdk (fetch and localStorage)
global.fetch = require('node-fetch');
global.localStorage = require('node-persist');
global.localStorage.initSync();

var exp = require('exp-js-sdk');

// login
exp.runtime.start({
  host: 'https://api.exp.scala.com',
  uuid: '9771eb9c-c30d-43d9-8f95-3389ea9aeb5d', // Device uuid.
  secret: 'cfe42af9027394dfc02cdc2bd64000411d59209bb52f74eae7abd3881c662ba0d6f793de583ae4647a968293a2549203' // Device secret
})
.then(function() {
  console.log('connected to exp');

  exp.channels.organization.broadcast({
    name: 'joke72',
    payload: {
      opening: 'knock knock?'
    }
  });

})
.catch(function(err) {
  console.log('not connected to exp');
  console.error(err);
});

// keep the script running
process.stdin.resume();
