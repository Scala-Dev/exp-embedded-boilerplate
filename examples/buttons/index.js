'use strict';

// setup prerequisites for the sdk (localStorage)
global.localStorage = require('node-persist');
global.localStorage.initSync();

var exp = require('exp-js-sdk');

// gpio
var Gpio = require('onoff').Gpio;
var buttonRed = new Gpio(6, 'in', 'both');
var buttonGreen = new Gpio(13, 'in', 'both');
var buttonUpArrow = new Gpio(19, 'in', 'both');
var buttonDownArrow = new Gpio(26, 'in', 'both');

buttonRed.watch(function(err, value) {
  console.log('red ' + value);
  if (value === 0) {
    exp.channels.organization.broadcast({
      name: 'buttonEvent',
      payload: { 'button': 'off' }
    });
  }
});

buttonGreen.watch(function(err, value) {
  console.log('green ' + value);
  if (value === 0) {
    exp.channels.organization.broadcast({
      name: 'buttonEvent',
      payload: { 'button': 'on' }
    });
  }
});

buttonUpArrow.watch(function(err, value) {
  console.log('up ' + value);
  if (value === 0) {
    exp.channels.organization.broadcast({
      name: 'buttonEvent',
      payload: { 'button': 'up' }
    });
  }
});

buttonDownArrow.watch(function(err, value) {
  console.log('down ' + value);
  if (value === 0) {
    exp.channels.organization.broadcast({
      name: 'buttonEvent',
      payload: { 'button': 'down' }
    });
  }
});


// login
exp.runtime.start({
  host: 'https://api.exp.scala.com',
  uuid: '9771eb9c-c30d-43d9-8f95-3389ea9aeb5d', // Device uuid.
  secret: 'cfe42af9027394dfc02cdc2bd64000411d59209bb52f74eae7abd3881c662ba0d6f793de583ae4647a968293a2549203' // Device secret
})
.then(function() {
  console.log('connected to exp');
})
.catch(function(err) {
  console.log('not connected to exp');
  console.error(err);
});


// keep the script running
process.stdin.resume();
