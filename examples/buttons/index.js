'use strict';

// This script sends a generic event whenever a GPIO button is pressed.

var EXP = require('exp-sdk');

// start the EXP SDK
var exp = EXP.start({
  uuid: '9771eb9c-c30d-43d9-8f95-3389ea9aeb5d', // Device uuid.
  secret: 'cfe42af9027394dfc02cdc2bd64000411d59209bb52f74eae7abd3881c662ba0d6f793de583ae4647a968293a2549203' // Device secret
});

// optionally start the SDK with a device-credentials.json file downloaded from https://goexp.io
// var exp = EXP.start(require('./device-credentials.json'));

exp.getAuth().then(function() {
  console.log('connected to exp');
})
.catch(function(err) {
  console.log('could not connect to exp');
  console.error(err);
});

// setup buttons plugged into GPIO
var Gpio = require('onoff').Gpio;
var buttonRed = new Gpio(6, 'in', 'both');
var buttonGreen = new Gpio(13, 'in', 'both');
var buttonUpArrow = new Gpio(19, 'in', 'both');
var buttonDownArrow = new Gpio(26, 'in', 'both');

buttonRed.watch(function(err, value) {
  console.log('red ' + value);
  if (value === 0) {
    var channel = exp.getChannel('organization');
    channel.broadcast('buttonEvent', { 'button': 'off' });
  }
});

buttonGreen.watch(function(err, value) {
  console.log('green ' + value);
  if (value === 0) {
    var channel = exp.getChannel('organization');
    channel.broadcast('buttonEvent', { 'button': 'on' });
  }
});

buttonUpArrow.watch(function(err, value) {
  console.log('up ' + value);
  if (value === 0) {
    var channel = exp.getChannel('organization');
    channel.broadcast('buttonEvent', { 'button': 'up' });
  }
});

buttonDownArrow.watch(function(err, value) {
  console.log('down ' + value);
  if (value === 0) {
    var channel = exp.getChannel('organization');
    channel.broadcast('buttonEvent', { 'button': 'down' });
  }
});

