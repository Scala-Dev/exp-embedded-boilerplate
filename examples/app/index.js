/* global exp:false, fetch:false */
'use strict';

// setup prerequisites for the sdk (localStorage)
global.localStorage = require('node-persist');
global.localStorage.initSync();

// globals are required for remote scripts
global._ = require('lodash');
global.exp = require('exp-js-sdk');

var vm = require('vm');


// handler for loading remote app
function refresh() {
  return Promise.resolve()
  .then(function() {
    return exp.api.getCurrentExperience();
  })
  .then(function(experience) {
    //console.log(experience);

    var apps = _.get(experience, 'document.apps', []);
    apps.forEach(function(app) {

      exp.api.getContent(app.appTemplateUuid)
      .then(function(appNode) {
        return appNode.getChildren();
      })
      .then(function(children) {
        var index = _.find(children, function(child) {
          return child.document.name === 'index.js';
        });

        if (index) {
          console.log('found index.js');
          var url = index.getUrl();

          fetch(url)
            .then(function(res) {
              return res.text();
            })
            .then(function(data){
              console.log('running index');

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

// listen for new experiences
exp.channels.system.listen({ name: 'experienceChange' }, function() {
  refresh();
});

// login
exp.runtime.start({
  host: 'http://localhost:9000',
  uuid: '2b510819-59b9-40d1-b688-6cb5096d8f48', // Device uuid.
  secret: 'ca9b6c88030cbb6f250c3c54594a0e89ea6791d1086141d8f151ff8341bcae1362674c9c2b14830f2af472694aaae249' // Device secret
})
.then(function() {
  console.log('connected to exp');
  refresh();
})
.catch(function(err) {
  console.log('not connected to exp');
  console.error(err);
});


// keep the script running
process.stdin.resume();
