/* global exp:false */
'use strict';

// This script is a proof-of-concept that loads remote app files using player experience config.

// globals are required for remote scripts
global.exec = require('child_process').exec;
global.http = require('http');
global.https = require('https');
global.fs = require('fs');
global._ = require('lodash');

var EXP = require('exp-sdk');
var vm = require('vm');

// handler for loading remote app
function refresh() {
  exp.getCurrentExperience().then(function(experience) {
    var apps = _.get(experience, 'document.apps', []);

    // TODO use the experience schedule instead of loading all apps in the experience
    apps.map(function(app) {
      return exp.getContent(app.appTemplate.uuid)
        .then(function(app) {
          if (app) return app.getChildren({ appContent: 'include' });
        })
        .then(function(children) {
          if (children) return children.find(function(child) { return child.document.name === 'index.js'; });
        })
        .then(function(index) {
          if (index) {
            console.log('found index.js');
            var url = index.getUrl();

            return exp.fetch(url).then(function(res) {
              return res.text();
            })
            .then(function(data){
              console.log('running remote index.js');

              var module = vm.runInThisContext(data, index.document.path);
              module({ exp: exp });
            })
            .catch(function(err) {
              console.log(err.stack);
            });
          }
        });
    });

  });

}

// login
global.exp = EXP.start({
  uuid: '2b510819-59b9-40d1-b688-6cb5096d8f48', // Device uuid.
  secret: 'ca9b6c88030cbb6f250c3c54594a0e89ea6791d1086141d8f151ff8341bcae1362674c9c2b14830f2af472694aaae249' // Device secret
});

// optionally start the SDK with a device-credentials.json file downloaded from https://goexp.io
// global.exp = EXP.start(require('./device-credentials.json'));

exp.getAuth().then(function() {
  console.log('connected to exp');
  refresh();

  exp.getCurrentDevice().then(function(device) {
    if (device) {
      // listen for device changes
      device.getChannel({ system: true }).listen('update', function () {
        refresh();
      });

      // listen for restart events
      device.getChannel().listen('restart', function () {
        refresh();
      });
    }
  });


  exp.getCurrentExperience().then(function(experience) {
    if (experience) {
      // listen for experience changes
      experience.getChannel({ system: true }).listen('update', function () {
        refresh();
      });
    }
  });
})
.catch(function(err) {
  console.log('not connected to exp');
  console.error(err);
});
