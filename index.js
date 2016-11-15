'use strict';

var EXP = require('exp-sdk');

// login
var exp = EXP.start({
  uuid: '9771eb9c-c30d-43d9-8f95-3389ea9aeb5d', // Device uuid.
  secret: 'cfe42af9027394dfc02cdc2bd64000411d59209bb52f74eae7abd3881c662ba0d6f793de583ae4647a968293a2549203' // Device secret
});

// optionally start the SDK with a device-credentials.json file downloaded from https://goexp.io
// var exp = EXP.start(require('./device-credentials.json'));

exp.getAuth().then(function() {
  console.log('connected to exp');

  var channel = exp.getChannel('organization');

  channel.broadcast('joke72', {
    opening: 'knock knock?'
  });

})
.catch(function(err) {
  console.log('could not connect to exp');
  console.error(err);
});

